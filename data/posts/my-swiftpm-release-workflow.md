---
title: My Swift Package Manager Release Workflow
tags: ["swift", "swiftpm", "github-actions"]
date: 2020-06-18
---

I am currently maintaining numerous Swift Packages that don't receive a constant flow of updates, but do receive updates when new Swift updates come out, or as I think of useful additions.

To ensure that I can make some of these less frequent updates without too much friction and with confidence in their correctness I rely heavily on [GitHub Actions](https://github.com/features/actions), which I'll go over in this blog post.

<!-- more -->

I have 2 workflows that I use across my projects, one for running tests and the other for performing releases.

## Tests Workflow

The tests workflow runs on every commit.

```yml
name: Tests

on: [push]

jobs:
  macos_tests:
    name: macOS Tests (SwiftPM)
    runs-on: macos-latest
    strategy:
      fail-fast: false
      matrix:
        xcode: ["11.4"]

    steps:
      - uses: actions/checkout@v2

      - name: Select Xcode ${{ matrix.xcode }}
        run: sudo xcode-select --switch /Applications/Xcode_${{ matrix.xcode }}.app

      - name: Cache SwiftPM
        uses: actions/cache@v1
        with:
          path: .build
          key: ${{ runner.os }}-xcode_${{ matrix.xcode }}-swiftpm-deps-${{ github.workspace }}-${{ hashFiles('Package.resolved') }}
          restore-keys: |
            ${{ runner.os }}-xcode_${{ matrix.xcode }}-swiftpm-deps-${{ github.workspace }}

      - name: SwiftPM tests
        run: swift test --enable-code-coverage

      - name: Convert coverage to lcov
        run: xcrun llvm-cov export -format="lcov" .build/debug/PersistPackageTests.xctest/Contents/MacOS/PersistPackageTests -instr-profile .build/debug/codecov/default.profdata > coverage.lcov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v1
        with:
          fail_ci_if_error: true

  xcode_tests:
    name: ${{ matrix.platform }} Tests (Xcode)
    runs-on: macos-latest
    strategy:
      fail-fast: false
      matrix:
        xcode: ["11.4"]
        platform: ["iOS", "tvOS"]

    steps:
      - uses: actions/checkout@v2

      - name: Select Xcode ${{ matrix.xcode }}
        run: sudo xcode-select --switch /Applications/Xcode_${{ matrix.xcode }}.app

      - name: Cache SwiftPM
        uses: actions/cache@v1
        with:
          path: CIDependencies/.build
          key: ${{ runner.os }}-xcode_${{ matrix.xcode }}-swiftpm-ci-deps-${{ github.workspace }}-${{ hashFiles('CIDependencies/Package.resolved') }}
          restore-keys: |
            ${{ runner.os }}-xcode_${{ matrix.xcode }}-swiftpm-ci-deps-${{ github.workspace }}

      - name: Cache DerivedData
        uses: actions/cache@v1
        with:
          path: ~/Library/Developer/Xcode/DerivedData
          key: ${{ runner.os }}-${{ matrix.platform }}_derived_data-xcode_${{ matrix.xcode }}
          restore-keys: |
            ${{ runner.os }}-${{ matrix.platform }}_derived_data

      - name: Run Tests
        run: swift run --configuration release --skip-update --package-path ./CIDependencies/ xcutils test ${{ matrix.platform }} --scheme Persist --enable-code-coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v1
        with:
          fail_ci_if_error: true

  watchos_build:
    name: watchOS Build (Xcode)
    runs-on: macos-latest
    strategy:
      fail-fast: false
      matrix:
        xcode: ["11.4"]

    steps:
      - uses: actions/checkout@v2

      - name: Select Xcode ${{ matrix.xcode }}
        run: sudo xcode-select --switch /Applications/Xcode_${{ matrix.xcode }}.app

      - name: Cache SwiftPM
        uses: actions/cache@v1
        with:
          path: CIDependencies/.build
          key: ${{ runner.os }}-xcode_${{ matrix.xcode }}-swiftpm-ci-deps-${{ github.workspace }}-${{ hashFiles('CIDependencies/Package.resolved') }}
          restore-keys: |
            ${{ runner.os }}-xcode_${{ matrix.xcode }}-swiftpm-ci-deps-${{ github.workspace }}

      - name: Cache DerivedData
        uses: actions/cache@v1
        with:
          path: ~/Library/Developer/Xcode/DerivedData
          key: ${{ runner.os }}-watchOS_derived_data-xcode_${{ matrix.xcode }}
          restore-keys: |
            ${{ runner.os }}-watchOS_derived_data

      - name: Build for watchOS
        run: swift run --configuration release --skip-update --package-path ./CIDependencies/ xcutils build watchOS --scheme Persist

  linux_tests:
    name: SwiftPM on ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-16.04, ubuntu-latest]
        swift: ["5.2.3"]

    steps:
      - uses: actions/checkout@v2

      - name: Install swiftenv
        run: |
          eval "$(curl -sL https://swiftenv.fuller.li/install.sh)"
          echo "::set-env name=SWIFTENV_ROOT::$HOME/.swiftenv"
          echo "::add-path::$SWIFTENV_ROOT/bin:$PATH"

      - name: swift test
        run: swift test --enable-test-discovery
```

The tests are split in to 4 sections:

- macOS tests, which are run via `swift test`
- iOS and tvOS tests, which are run via Xcode
- watchOS build, which is run via Xcode but does not run tests because tests do not work on watchOS
- Linux tests, which are run via `swift test` on Ubuntu

macOS, iOS, and tvOS tests gather test coverage and upload it to Codecov, which provides some insight it to how much new code is covered by tests.

For the iOS and tvOS tests, along with the watchOS build, I used [`xcutils`](https://github.com/JosephDuffy/xcutils). `xcutils` is another tool of mine that is used to improve the CLI of Xcode. Here it is used to run the tests/build against the latest versions of iOS/tvOS/watchOS, which means it should work on any machine and is resistant to changes made by GitHub.

On Linux the `--enable-test-discovery` flag is paseed to `swift test` to remove the need for a `LinuxMain.swift` file that much be kept in sync with the tests.

These tests have helped me match many mistakes before merging, especially for platforms such as watchOS and Linux that are less frquently used.

## Release Workflow

The release workflow is triggered by the creation of a git tag that starts with a `v`.

```yml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  create_release:
    name: Create Release
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Fetch tag
        run: git fetch --depth=1 origin +${{ github.ref }}:${{ github.ref }}

      - name: Get the release version
        id: release_version
        run: echo "::set-output name=version::${GITHUB_REF/refs\/tags\//}"

      - name: Get release description
        run: |
          description="$(git tag -ln --format=$'%(contents:subject)\n\n%(contents:body)' ${{ steps.release_version.outputs.version }})"
          # Fix set-output for multiline strings: https://github.community/t/set-output-truncates-multiline-strings/16852
          description="${description//'%'/'%25'}"
          description="${description//$'\n'/'%0A'}"
          description="${description//$'\r'/'%0D'}"
          echo "$description"
          echo "::set-output name=description::$description"
        id: release_description

      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.release_version.outputs.version }}
          release_name: ${{ steps.release_version.outputs.version }}
          body: ${{ steps.release_description.outputs.description }}
          prerelease: ${{ startsWith(steps.release_version.outputs.version, 'v0.') || contains(steps.release_version.outputs.version, '-') }}

  build_docs:
    name: Build Docs
    runs-on: macos-latest
    strategy:
      fail-fast: false
      matrix:
        xcode: ["11.4"]

    steps:
      - uses: actions/checkout@v2

      - name: Select Xcode ${{ matrix.xcode }}
        run: sudo xcode-select --switch /Applications/Xcode_${{ matrix.xcode }}.app

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1

      - uses: actions/cache@v1
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gems-${{ hashFiles('.ruby-version') }}-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gems-${{ hashFiles('.ruby-version') }}-

      - name: Bundle install
        run: |
          bundle config path vendor/bundle
          bundle install --jobs 4 --retry 3

      - name: Build docs
        run: bundle exec jazzy

      - name: Upload Docs
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs
```

The first job creates a GitHub release for the tag. The release uses the contents of the tag as the body for the release, which allows for markdown, so I write the body of the tag using markdown to benefit from improved rendering on the GitHub website. The `Get release description` step modifies the body by escaping new lines and `%` characters. This is required to prevent the output being truncated. See https://github.community/t/set-output-truncates-multiline-strings/16852.

Since my releases follow [sematic versioning 2.0.0](https://semver.org/spec/v2.0.0.html) if the release starts with `v0.` or contains a `-` the release is marked as pre-release.

The second job runs `jazzy` to build HTML docs and uploads it to a `gh-pages` branch, which is configured to be deployed automatically by GitHub, and also provides a badge displaying the percentage of public code that is documented.

## Final Thoughts

With these workflows in place I can make a change, add some tests, push, create a pull request, merge, and tag a new release with confidence and all within a couple of hours.

Sicne this workflow will be receiving small tweaks over time and I may not remember to update this workflow straight away (maybe I should make a workflow for that 🤪) you should check out the [Persist workflows](https://github.com/JosephDuffy/Persist/tree/master/.github/workflows) to find my latest changes.
