#!/bin/bash

# Define URL and destination directory
URL="https://github.com/unisat-wallet/extension/releases/download/v1.5.1/unisat-chrome-mv3-v1.5.1-release.zip"
SCRIPT_DIR=$(dirname "$0")
DEST_DIR="$SCRIPT_DIR/../.extensions/unisat"

if [ -d "$DEST_DIR" ]; then
    echo "Directory $DEST_DIR already exists. Skipping download and extraction."
    exit 0
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Download the file
curl -L -o unisat.zip "$URL" > /dev/null 2>&1

# Extract the contents to the destination directory
unzip -o -qq unisat.zip -d "$DEST_DIR" > /dev/null 2>&1

# Clean up the downloaded zip file
rm unisat.zip

echo "Download and extraction completed."