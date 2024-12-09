#!/bin/bash

# Define source and destination directories
SOURCE_DIR="./build"
DEST_DIR="./dist"

# Copy required files to the build folder
cp package.json "$SOURCE_DIR/package.json"
cp CHANGELOG.md "$SOURCE_DIR/CHANGELOG.md"
cp README.md "$SOURCE_DIR/README.md"
cp .npmrc "$SOURCE_DIR/.npmrc"
cp .npmignore "$SOURCE_DIR/.npmignore"

# Rename the build folder to dist
mv "$SOURCE_DIR" "$DEST_DIR"

echo "Build folder successfully renamed to dist."