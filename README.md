# josephduffy.co.uk

## Building Docker Image

Building the docker image requires the use of Docker BuiltKit. This is to allow the `GITHUB_ACCESS_TOKEN` secret during the build phase.

For example, if the `GITHUB_ACCESS_TOKEN` file contains the GitHub access token the container can be built using:

```shell
DOCKER_BUILDKIT=1 docker build . -t josephduffy:latest --secret=id=GITHUB_ACCESS_TOKEN,src=./GITHUB_ACCESS_TOKEN
```
