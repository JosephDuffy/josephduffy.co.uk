#!/bin/sh

FAVICON_SVG=./public/favicon-dark.svg

/Applications/Inkscape.app/Contents/MacOS/inkscape "$FAVICON_SVG" -w 512 -h 512 -o ./public/android-chrome-512x512.png
/Applications/Inkscape.app/Contents/MacOS/inkscape "$FAVICON_SVG" -w 192 -h 192 -o ./public/android-chrome-192x192.png
/Applications/Inkscape.app/Contents/MacOS/inkscape "$FAVICON_SVG" -w 180 -h 180 -o ./public/apple-touch-icon.png
/Applications/Inkscape.app/Contents/MacOS/inkscape "$FAVICON_SVG" -w 16 -h 16 -o ./public/favicon-16x16.png
/Applications/Inkscape.app/Contents/MacOS/inkscape "$FAVICON_SVG" -w 32 -h 32 -o ./public/favicon-32x32.png
/Applications/Inkscape.app/Contents/MacOS/inkscape "$FAVICON_SVG" -w 48 -h 48 -o ./public/favicon-48x48.png

/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ./public/android-chrome-512x512.png ./public/android-chrome-192x192.png ./public/apple-touch-icon.png ./public/favicon-16x16.png ./public/favicon-32x32.png ./public/favicon-48x48.png
/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ./public/android-chrome-512x512.png ./public/android-chrome-192x192.png ./public/apple-touch-icon.png ./public/favicon-16x16.png ./public/favicon-32x32.png ./public/favicon-48x48.png

~/Projects/icopack/icopack ./public/favicon.ico ./public/favicon-16x16.png ./public/favicon-32x32.png ./public/favicon-48x48.png

rm ./public/favicon-48x48.png
