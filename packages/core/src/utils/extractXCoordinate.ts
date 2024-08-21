/**
 * Extracts the x coordinate from a public key
 * @param publicKey hexadecimal public key
 * @returns hexadecimal x coordinate
 */
export const extractXCoordinate = (publicKey: string) => {
  const publicKeyBuffer = Buffer.from(publicKey, "hex");

  console.log(publicKeyBuffer.length);

  if (publicKeyBuffer.length !== 33 && publicKeyBuffer.length !== 65) {
    throw new Error("Invalid public key length");
  }

  const xCoordinate = publicKeyBuffer.subarray(1, 33);

  return xCoordinate.toString("hex");
};
