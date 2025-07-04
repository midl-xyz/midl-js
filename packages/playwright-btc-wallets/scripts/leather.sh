#!/bin/bash

# Define URL and destination directory
URL="https://github.com/leather-io/extension/releases/download/v6.55.0/leather-chromium.v6.55.0.zip"
SCRIPT_DIR=$(dirname "$0")
DEST_DIR="$SCRIPT_DIR/../.extensions"


if [ -d "$DEST_DIR/leather" ]; then
    echo "Directory already exists. Skipping download and extraction."
    exit 0
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Download the file
curl -L -o leather.zip "$URL" > /dev/null 2>&1

# Extract the contents to the destination directory
unzip -o leather.zip  -d "$DEST_DIR"  > /dev/null 2>&1
mv "$DEST_DIR/leather-chromium-v6.55.0" "$DEST_DIR/leather"

# Clean up the downloaded zip file
rm leather.zip

echo "Download and extraction completed."