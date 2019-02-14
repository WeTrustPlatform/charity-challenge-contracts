const CharityChallengeContract = artifacts.require("./CharityChallenge.sol")

module.exports = function(deployer) {
  // This deploy call without param will cause error dedicatedly
  // Please change all of these params before apply it to deployer.deploy()
  const contractOwner = "0xF58b12474c084B3Bcd32B991ea1BABdf0d67c109"
  const npoAddress = "0x7C419672d84a53B0a4eFed57656Ba5e4A0379084"
  const marketAddress = "0xec05e2b1b4bd99b490acf7b7561cc83e518767aa"
  // deployer.deploy(CharityChallengeContract, contractOwner, npoAddress, marketAddress);
  deployer.deploy(CharityChallengeContract);
}