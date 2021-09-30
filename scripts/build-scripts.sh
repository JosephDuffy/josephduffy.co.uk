#!/bin/sh

npx esbuild ./scripts/*.ts --outdir=./scripts/ --bundle --platform=node --target=node14.15.4 --out-extension:.js=.mjs --banner:js='import { createRequire as topLevelCreateRequire } from "module";
const require = topLevelCreateRequire(import.meta.url);'
