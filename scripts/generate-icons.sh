#!/bin/sh

convert "$1" -resize 512x512 ./public/icons/manifest-icon-512x512.png
convert "$1" -resize 192x192 ./public/icons/manifest-icon-192x192.png
convert "$1" -resize 180x180 ./public/icons/apple-touch-icon-180x180.png
convert "$1" -resize 32x32 ./public/icons/favicon-32x32.png
