/**
 *
 * @param {import('hardhat/types').HardhatRuntimeEnvironment} hre
 */
module.exports = async function deploy(hre) {
  /**
   * Initializes MIDL hardhat deploy SDK
   */
  await hre.midl.initialize();

  /**
   * Add the deploy contract transaction intention
   */
  await hre.midl.deploy("SimpleStorage", {
    args: ["Hello from MIDL!"],
  });

  /**
   * Sends the BTC transaction and EVM transaction to the network
   */
  await hre.midl.execute();
};
