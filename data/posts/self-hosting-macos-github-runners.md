---
title: Self-hosting macOS GitHub Runners
tags: ["ios", "macos", "devops", "github-actions"]
date: 2025-07-03T02:12:58Z
draft: true
---

This post explains how to set up an Apple Silicon Mac as a self-hosted runner for use with GitHub Actions. I will focus on setting up [Tartelet](https://github.com/shapehq/tartelet), but I will provide some alternatives at the end.

<!-- more -->

## Benefits

It is well known that CI and CD services that use macOS are quite a bit more expensive than other operating systems, especially Linux. For example the standard Linux runner on GitHub costs $0.008 per minute, whereas for macOS it costs $0.08. This goes up to $0.16 for a 6-core M1.

> [!NOTE]
> These costs are for _private_ repos. If you're hosting a _public_ repo you can use GitHub-hosted runners for free 🎉

With a refurbished M1 Mac Mini being available for around $350 that's 4,375 minutes worth. Even a brand new 10-core M4 Mac Mini, at $599, is the same as roughly 7,487 minutes. On a medium sized project it's easy to use 4000 minutes in just a week, so it can be financially viable to instead use your own Mac Mini.

Other than just the financials there are other benefits, too:

- You can buy more powerful hardware, speeding up the runs.
- You have full control over the hardware and the configuration of the OS.
- You don't have to wait for GitHub to add support for new software, such as Xcode updates.

## Core Technologies

Apple's Virtualization framework is used to run VMs. This is also the reason we require an Apple Silicon Mac; Intel Macs cannot virtualise macOS with the Virtualization framework.

Another restriction of the Virtualization framework is that we can only run 2 VMs at once. Especially for more powerful Macs this can feel quite restrictive but it's important to note that while this is enforced in the software this actually a _legal_ requirement.

The Virtualization framework introduces very little overhead. Quoting [Shape](https://shape.dk):

> We found that our jobs run about 12% slower when running two virtual machines in parallel compared to running a single virtual machine. We find this performance cost negligible as running two virtual machines significantly increases our throughput at a low monetary cost.

[Tart](https://github.com/cirruslabs/tart) is a project built on top of Apple's Virtualization framework by providing both a GUI and CLI for managing VMs.

All of the tools discussed in this post – including Tartelet – boil down to managing a simple loop:

Start VM → Login to VM via SSH → Install the GitHub runner → Listen for jobs → Tear down → Repeat

## Setup

### GitHub

To automate adding the runners Tartelet requires an app to be created and install on GitHub. There are options for this: a personal app or an organisation app.

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <th>Scope</th>
    <th>Restrictions</th>
    <th>App Link</th>
    <th>Permissions</th>
  </tr>
  <tr>
    <th>Personal</th>
    <td>Tartelet only allows registering the runners with a single repository at a time.</td>
    <td><a href="https://github.com/settings/apps">https://github.com/settings/apps</a></td>
    <td>
      <ul>
        <li>Repository: Administration (Read and Write)</li>
        <li>Repository: Metadata (Read-only)</li>
    </td>
  </tr>
  <tr>
    <th>Organisation</th>
    <td>Runners can be used for any repo in the organisation.</td>
    <td>https://github.com/organizations/&lt;ORGANISATION_NAME&gt;/settings/apps</td>
    <td>
      <ul>
        <li>Organization: Self-hosted runners (Read and write)</li>
    </td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html -->

With the app created you should:

- Note down the _App ID_.
- Generate and download a private key.
- Choose _Install App_ on the left side. Install it against your account.

### Host Machine

The first step is to install Tart and Tartelet.

```shell
brew install cirruslabs/cli/tart
```

With this you can now clone a VM. For example to clone Xcode 16.3 on Sequoia you can run:

```shell
tart clone ghcr.io/cirruslabs/macos-sequoia-xcode:16.3 github-runner
```

This will download the `ghcr.io/cirruslabs/macos-sequoia-xcode:16.3` image and create a local VM called `github-runner`. See <#choosing-an-image> for more information on how to choose or create an image.

> [!WARNING]
> Be careful with the name you choose here. Tartelet will create runners by appending `-1` and `-2` to the name of the runner, which is also the name of the runner when registered with GitHub. These names should be unique. So if you're creating VMs across multiple physical machines then each machine should use a unique name for the images.

If you want to run this now you can run:

```shell
tart run github-runner
```

Now download the latest version of Tartelet from the [releases page](https://github.com/shapehq/tartelet/releases "Tartelet releases") and move Tartelet.app to your Applications directory.

Open Tartelet and switch to the _Virtual Machine_ tab. Here you should select the virtual machine you created above and enter the SSH details. For the images provided by Cirrus the username and password are both `admin`.

> [!NOTE]
> A username and password of `admin`!? That sounds insecure! Don't worry too much about this. The VMs are setup with [passwordless sudo, which is normal for GitHub runners](https://docs.github.com/en/actions/how-tos/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners#administrative-privileges). Your host machine and repo should be protected, and the VM itself should not contain anything sensitive.

For now we can leave the _Number of Machines_ at _One_ and disable _Start Virtual Machines on App Launch_, just in case something is wrong with our setup.

Next switch to the GitHub tab. Choose the appropriate option for _Runner Scope_ and provide the _Organization Name_ for an organisation-scoped runner, or the _Owner Name_ and _Repository Name_ for a repository-scoped runner. Provide the _App ID_ and _Private Key (PEM)_ for all runners.

The last tab to customise is the _Runner_ tab. Here you can set the labels for the runners. You may wish to use this to distinguish between multiple hosts, for example a more powerful host may be used to run tests while a cheaper and less powerful host is used for things like linting. The labels may also be used to differentiate the VMs used, for example you can add `xcode-16.3` as a label to indicate the VM includes Xcode 16.3.

Finally, click the icon for Tartelet in the menu bar and choose _Start_. This should launch a VM, which Tartelet will then SSH in to to start the runner. Once a job has finished Tartelet will shut down the VM and start it again, ready for the next job.

If everything is working, you can switch back to the _Virtual Machine_ tab, set the _Number of Machines_ to _Two_ and enable _Start Virtual Machines on App Launch_. I also recommend starting Tartelet when the logging in by right clicking on the icon in the dock and choosing _Options_ → _Open at Login_.

#### Debugging

If something isn't quite working right, such as the VM starting and restarting quickly there are a few things you can do to debug the issue.

When Tartelet gets in to a loop like this it can be hard to stop. Start by clicking the menu bar icon and choosing _Stop_. Then quit Tartelet and and running VMs.

On the _General_ tab of Tartelet there's an _Export Logs..._ button, which you can used to view the logs. This can help you find common errors, such as _The GitHub app has not been installed. Please install it from the developer settings_, which indicates that the GitHub app created earlier has not been installed to the organisation or repository specified in the setting.

You can also try starting the VM via `tart`. Using `tart ip github-action` you can find the IP of the VM and verify your SSH credentials.

Lastly, check out [Tartelet's issues on GitHub](https://github.com/shapehq/tartelet/issues) for other issues people are running in to.

#### DHCP Lease Time Setup

It is also recommended that you [change the default DHCP lease time on the host machine](https://tart.run/faq/#changing-the-default-dhcp-lease-time). Tart recommends 600 seconds:

```shell
sudo defaults write /Library/Preferences/SystemConfiguration/com.apple.InternetSharing.default.plist bootpd -dict DHCPLeaseTimeSecs -int 600
```

### Choosing an Image

While you can set up your own image I personally find it easier to use an existing one. Cirrus – the company that maintains Tart - provide various macOS images under their [macos-image-templates repo](https://github.com/cirruslabs/macos-image-templates). For example to use Xcode 16.3 on Sequoia you can use `ghcr.io/cirruslabs/macos-sequoia-xcode:16.3`.

Cirrus Labs keep these images up-to-date at a good pace. For example Xcode 16.4 was released 27th May 2025. They aim to add new versions within 24 hours, although the closest I could find was their [image released May 31st 2025](https://github.com/cirruslabs/macos-image-templates/pkgs/container/macos-sequoia-xcode/427962229?tag=16.4). In contrast, [GitHub's official runners added Xcode 16.4 June 4th 2025](https://github.com/actions/runner-images/commit/6a2b811d2ab501aea77030f1352687c7c2aaedb0#diff-f1064973929930b1921e70f6987616be484745844127abfdf04ee1b96adb1382R16-R155).

If you need further configuration, for example you want to pre-cache some common tools you use, you can download the image, create a new VM, run it, modify it, then use it for the runner.

You may also choose to create your own VM from scratch. While this guide will go in to this, Shape provides [good instructions on how to set up your own VM from scratch](https://github.com/shapehq/tartelet/wiki/Configuring-Tartelet#creating-a-virtual-machine).

## Alternatives

There are a few alternatives to Tartelet, which each have different tradeoffs.

- Set up a runner using [GitHub's guide to setting up self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners), which will _not_ be ephemeral and has extra security implications.
- [Ekiden](https://github.com/mirego/ekiden), which supports monitoring via Grafana, using an internal registry for the VMs, and set up and configuration via scripts.
- [Cilicon](https://github.com/traderepublic/Cilicon), which is a standalone app that also supports OCI hosted images, has a nice GUI, and supports GitLab and Buildkite along with GitHub. However, it only supports 1 runner at a time.
