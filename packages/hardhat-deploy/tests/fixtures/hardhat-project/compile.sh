#!/bin/sh
cd tests/fixtures/hardhat-project || exit 1
npx hardhat compile
cd ../../../ || exit 1