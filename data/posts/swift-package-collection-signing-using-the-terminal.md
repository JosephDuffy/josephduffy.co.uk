---
title: Swift Package Collection Signing Using the Terminal
tags: ["swift", "swiftpm"]
date: 2022-01-11T05:49:14Z
---

Swift Packages are JSON files that describe a collection of packages. This post will explain how to sign these packages with a trusted certificate entirely from the terminal. These methods should work on Linux and macOS alike. At the end I describe how to have Swift on Linux implicitly trust these packages.

Using this technique I have published [my own package collection](/swift-package-collection).

If you're targeting macOS only and find GUIs more intuitive I recommend following the [“Swift Package Collection” blog post from Shaps](https://benkau.com/swift-package-collections/), which is the post that finally made this “click” for me.

<!-- more -->

The first choice to make is what kind of key to generate. [Packages support certificates using either 256-bit EC or 2048-bit RSA keys][package-signing-requirement]. Check with your certificate provider which they support.

<p class="info">
Apple's Code Signing certificates only support 2048-bit RSA keys. If you want to use a 256-bit EC key you'll need to use an alternative certificate provider.
</p>

A 2048-bit RSA key can be generated using:

```shell
openssl genrsa -out private.pem 2048
```

Here's what this command is doing:

- `genrsa` tells `openssl` to generate an RSA key
- `-out private.pem` tells `openssl` to output the generated file to `private.pem`
- `2048` tells `openssl` to generate a key with 2048 bits

<details>
<summary>
If your certificate provider supports 256-bit EC keys <code>openssl</code> can also be used to generate that key.
</summary>

```shell
openssl ecparam -name prime256v1 -genkey -noout -out private.pem
```

Here's what this command is doing:

- `ecparam` tells `openssl` to work with an EC (elliptical curve) key
- `-name prime256v1` tells `openssl` to use the curve named `prime256v1` (which is 256-bit)
- `-genkey` tells `openssl` to generate a key
- `-noout` prevents including the public key in the output (it's not necessary here)
- `-out private.pem` tells `openssl` to output the generated file to `private.pem`

</details>

To have a trusted certificate authority to sign our key we need to generate a Certificate Signing Request (CSR):

```shell
openssl req -new -key private.pem -out req.csr
```

You must provide a value for at least 1 field.

This command is doing:

- `req` specifies we are making a request
- `-new` tells `openssl` we want to generate a new request
- `-key private.pem` specifies that we want to request that `private.pem` be signed
- `-out req.csr` tells `openssl` tou output the request to `req.csr`

The produced `req.csr` file can be uploaded to your chosen certificate authority. If you're using Apple you can do this through their developer portal, specifically [https://developer.apple.com/account/resources/certificates/add](https://developer.apple.com/account/resources/certificates/add) and choose “Swift Package Collection Certificate.”

<p class="info">
Apple will only provide 1 code signing certificate per paid developer account.
</p>

Download the `.cer` file from your certificate provider and keep it safe. Here I'm going to assume you've named it `swift_package.cer`.

With your new certificate you can now sign your package:

<p class="info">
This is using the <a href="https://github.com/apple/swift-package-collection-generator">swift-package-collection-generator package</a>, which you will need  to install separately.
</p>

```bash
swift run package-collection-sign collection.json signed-collection.json private.pem swift_package.cer
```

This file can now be uploaded to a server and others can add it.

<p class="info">
Need to quickly test hosting the file? <code>ngrok http "file://$(pwd)"</code> can be used to serve the files over HTTPS and provide external routing.
</p>

## Supporting Linux

At this point your collection will be trusted when added via Xcode, but not when downloaded on Linux. To work on Linux the consumer needs to add the root certificate that signed your certificate to their trust store. This is stored in `~/.swiftpm/config/trust-root-certs/`. To test this we can start a Docker container that contains Swift and try adding the package.

```bash
docker run --rm -it --entrypoint bash swift
```

This is asking Docker to:

- `run` a container
- `--rm`: remove it if it exists
- `--it`: Makes the container `--interactive` and attaches a `--tty`
- `--entrypoint bash`: Enters the container using `bash`
- `swift`: Use the latest Swift image (at the time of writing this is 5.5.2)

We can try adding the package without making any changes:

```shell
swift package-collection add https://example.com/swift-package-collection.json
```

This will display the following error:

```
Error: The collection's signature is invalid. If you would still like to add it please rerun 'add' with '--skip-signature-check'.
```

To be able to download the certificate you'll need a tool such as `wget`:

```shell
apt update
apt install wget
```

The target directory also needs to exist:

```shell
mkdir -p ~/.swiftpm/config/trust-root-certs/
```

You can get the root certificate from your certificate provider. To see the name of the issuer run `openssl x509 -noout -inform DER -in swift_package.cer -issuer`.

With my Apple-provided cert this outputs:

`issuer= /CN=Apple Worldwide Developer Relations Certification Authority/OU=G3/O=Apple Inc./C=US`

This certificate can be found on [Apple's PKI][apple-pki]. Copy the URL and download it in the container:

```shell
wget https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer -O ~/.swiftpm/config/trust-root-certs/AppleWWDRCAG3.cer
```

If we rerun the command we should now see:

`Added "Joseph Duffy's Collection" to your package collections.`

🎉 Our package is now signed and can be trusted by by both macOS and Linux users!

Now all you need to do is upload the `signed-collection.json` file somewhere and link people to it.

[apple-pki]: https://www.apple.com/certificateauthority/
[package-signing-requirement]: https://github.com/apple/swift-package-manager/blob/main/Documentation/PackageCollections.md#requirements-on-signing-certificate
