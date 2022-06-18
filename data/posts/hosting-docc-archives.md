---
title: Hosting DocC Archives
tags: ["swift", "docc", "netlify", "vapor", "nginx", "apache", "wwdc", "wwdc21"]
date: 2021-06-12T21:49:13Z
---

At WWDC21 Apple introduced DocC, a tool for creating archives of Swift documentation that includes the static files required to host a version of the documentation on a website.

In this post I will summarise various methods of serving a DocC archive:

- Netlify
- Vapor middleware
- nginx
- Apache

All the examples provided here are hosting the DocC archive for [VaporDocC](https://github.com/JosephDuffy/VaporDocC), the Vapor middleware I wrote for hosting DocC archives.

<!-- more -->

## Shared Characteristics

All the examples implement the same basic set of rules:

- Send all requests starting with `/documentation/` or `/tutorials/` to the `index.html` file
- Send all requests starting with `/css/`, `/data/`, `/downloads/`, `/images/`, `/img/`, `/index/`, `/js/`, or `/videos/` to their respective folders
- Send all requests to `favicon.ico`, `favicon.svg`, and `theme-settings.json` to their respective files
- Send all requests to `/data/documentation.json` to the file in the `data/documentation/` folder that has the name of the module and ends with `.json`
- Redirect requests to `/` and `/documentation` to `/documentation/`
- Redirect requests to `/tutorials` to `/tutorials/`

The redirects aren't strictly necessary, although they will likely be useful to a lot of people.

## Netlify

Website: <a href="https://docc-netlify.josephduffy.co.uk/" rel="nofollow">docc-netlify.josephduffy.co.uk</a> | Repo: [github.com/JosephDuffy/DocC-netlify](https://github.com/JosephDuffy/DocC-netlify)

[Netlify](https://netlify.com) is one of the easiest to setup and provides the most functionality for the least amount of setup. To get setup add your DocC archive to a git repo, add the below configuration (updating the name of the `.docarchive`), publish your repo (public or private), and then set it up on Netlify.

```toml
[build]
publish = "VaporDocC.doccarchive/"

[[redirects]]
from = "/documentation/*"
status = 200
to = "/index.html"

[[redirects]]
from = "/tutorials/*"
status = 200
to = "/index.html"

[[redirects]]
from = "/data/documentation.json"
status = 200
to = "/data/documentation/vapordocc.json"

[[redirects]]
force = true
from = "/"
status = 302
to = "/documentation/"

[[redirects]]
force = true
from = "/documentation"
status = 302
to = "/documentation/"

[[redirects]]
force = true
from = "/tutorials"
status = 302
to = "/tutorials/"
```

Netlify will host your DocC archive and allow you to setup your own domain to point to the documentation, including automatically provisioning and TLS certificate, all for free.

## Vapor Middleware

Website: <a href="https://vapordocc.josephduffy.co.uk/" rel="nofollow">vapordocc.josephduffy.co.uk</a> |
Repo: [github.com/JosephDuffy/VaporDocC-website](https://github.com/JosephDuffy/VaporDocC-website)

[VaporDocC](https://github.com/JosephDuffy/VaporDocC) is middleware I wrote for use with [Vapor](https://github.com/vapor/vapor), a server-side Swift web framework.

I personally like this because the only configuration required is pointing it to the DocC archive; it will automatically find the `json` file in `data/documentation/` when `/data/documentation.json` is requested. It's also entirely written in Swift!

A docker container is published at [ghcr.io/josephduffy/vapordocc](https://ghcr.io/josephduffy/vapordocc), which can be used to host your own DocC archive with minimal setup:

```shell
docker run \
  -p 8080:8080 \
  -v /path/to/ModuleName.doccarchive:/docs \
  ghcr.io/josephduffy/vapordocc
```

There are 2 environment variables that can be used to configure the redirects, both of which are disabled by default. To meet the basic set of rules outlines above you can use:

```shell
docker run \
  -p 8080:8080 \
  -v /path/to/ModuleName.doccarchive:/docs \
  -e REDIRECT_ROOT=/documentation/ \
  -e REDIRECT_MISSING_TRAILING_SLASH=TRUE \
  ghcr.io/josephduffy/vapordocc
```

## nginx

Website: <a href="https://docc-nginx.josephduffy.co.uk/" rel="nofollow">docc-nginx.josephduffy.co.uk</a> | Repo: [github.com/JosephDuffy/DocC-nginx](https://github.com/JosephDuffy/DocC-nginx)

Using the nginx configuration may be a good option if you're adding documentation or tutorials to a website that's already using nginx. For nginx there are a few location blocks that will satisfy the basic set of rules:

```nginx
location ~ ^/(documentation|tutorial)/ {
    alias /docs/;
    try_files /index.html =404;
}

location = /data/documentation.json {
    alias /docs/data/;
    # Xcode 13.0 beta 1 generated DocC archives without a file at data/documentation.json.
    # Replace "vapordocc" with the name of the name of your product.
    try_files /documentation.json /documentation/vapordocc.json =404;
}

location ~ ^/(css|data|downloads|images|img|index|js|videos)/ {
    alias /docs/;
    try_files $uri =404;
}

location ~ ^/(favicon.ico|favicon.svg|theme-settings.json)$ {
    alias /docs/;
    try_files $uri =404;
}

location = / {
    return 302 /documentation/;
}

location = /documentation {
    return 302 /documentation/;
}

location = /tutorial {
    return 302 /tutorial/;
}
```

This configuration assumes that your DocC archive is stored at `/docs/`.

## Apache

Website: <a href="https://docc-apache.josephduffy.co.uk/" rel="nofollow">docc-apache.josephduffy.co.uk</a> | Repo: [github.com/JosephDuffy/DocC-Apache](https://github.com/JosephDuffy/DocC-Apache)

An Apache config is the example provided in the WWDC talk, but some extra changes are required to have it function correctly:

```apacheconf
RewriteEngine On

RewriteRule ^(documentation|tutorials)\/.*$ ModuleName.doccarchive/index.html [L]

# Xcode 13.0 beta 1 generated DocC archives without a file at data/documentation.json.
# Replace "modulename" with the name of the name of your product.
RewriteRule /data/documentation.json ModuleName.doccarchive/data/documentation/modulename.json [L]

RewriteRule ^(css|js|data|images|downloads|img|videos)\/.*$ ModuleName.doccarchive/$0 [L]

RewriteRule ^(favicon\.ico|favicon\.svg|theme-settings\.json)$ ModuleName.doccarchive/$0 [L]

RewriteRule ^$ /documentation/ [L,R=302]
RewriteRule ^documentation$ /documentation/ [L,R=302]
RewriteRule ^tutorials$ /tutorials/ [L,R=302]
```

This configuration assumes that your DocC archive is stored at `/usr/local/apache2/htdocs/ModuleName.doccarchive`.

## Extras to Consider

The VaporDocC, nginx, and Apache options don't cover things like TLS (HTTPS) or caching headers. These are left as an exercise for the reader, but I would recommend using Netlify or hosting yourself and using Cloudflare if you're unsure what to do.

## Issues With WWDC Example

If you've watched the [WWDC21 talk "Host and automate your DocC documentation"](https://developer.apple.com/wwdc21/10236) you may have run in to some issues when trying to use the provides an example `.htaccess` file:

```apacheconf
# Enable custom routing.
RewriteEngine On


# Route documentation and tutorial pages.
RewriteRule ^(documentation|tutorials)\/.*$ SlothCreator.doccarchive/index.html [L]


# Route files within the documentation archive.
RewriteRule ^(css|js|data|images|downloads|favicon\.ico|favicon\.svg|img|theme-settings\.json|videos)\/.*$ SlothCreator.doccarchive/$0 [L]
```

For example the `favicon.ico`, `favicon.svg`, and `theme-settings.json` files are not handled because the rewrite rule requires a trailing slash.

Another issue is that the DocC archive generated by Xcode 13.0 beta 1 generates a file at `data/documentation/$module_name.json`, but the generated HTML file requests a file at `data/documentation.json`. I am hoping a future release generates the file at `data/documentation.json` to allow for generic solutions to work without the need to manually provide the module name.

## Closing Thoughts

So far I'm loving DocC. The websites produces are really nice, with support for both light and dark mode, and the option of writing documentation within the source files themselves while embedding the linking between symbols within the documentation has made it really pleasant to write documentation.

I hope that with it being so easy to write at least _some_ documentation we see more documentation in open source projects, and I hope that this posts helps people with hosting that documentation.

If you've found this useful I'd love for you to [tell me about it on Twitter](https://twitter.com/Joe_Duffy)! If you think there could be improvements to any of the solutions please open an issue or a pull requests against the repo containing the example.
