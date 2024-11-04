#!/bin/bash

# Define URL and destination directory
URL="https://github.com/unisat-wallet/extension/releases/download/v1.5.1/unisat-chrome-mv3-v1.5.1-release.zip"
DEST_DIR="./extensions/unisat"

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Download the file
curl -L -o unisat.zip "$URL"

# Extract the contents to the destination directory
unzip -o unisat.zip -d "$DEST_DIR"

# Clean up the downloaded zip file
rm unisat.zip

echo "Download and extraction completed."