#!/bin/bash

# Get the directory of the current script
SCRIPT_DIR=$(dirname "$0")

# Paths to the scripts based on the script's directory
UNISAT_SCRIPT="$SCRIPT_DIR/unisat.sh"
LEATHER_SCRIPT="$SCRIPT_DIR/leather.sh"

# Check if unisat.sh exists and is executable
if [[ -f "$UNISAT_SCRIPT" && -x "$UNISAT_SCRIPT" ]]; then
    echo "Running unisat.sh..."
    "$UNISAT_SCRIPT"
else
    echo "Error: unisat.sh not found or not executable."
fi

# Check if leather.sh exists and is executable
if [[ -f "$LEATHER_SCRIPT" && -x "$LEATHER_SCRIPT" ]]; then
    echo "Running leather.sh..."
    "$LEATHER_SCRIPT"
else
    echo "Error: leather.sh not found or not executable."
fi

echo "Script execution completed."
