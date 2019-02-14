const CharityChallengeContract = artifacts.require("./CharityChallenge.sol")

module.exports = function(deployer, network) {
  // This is for rinkeby only
  if (network === 'rinkeby') {
    const contractOwner = "0xF58b12474c084B3Bcd32B991ea1BABdf0d67c109"
    const npoAddress = "0x7C419672d84a53B0a4eFed57656Ba5e4A0379084"
    const marketAddress = "0xec05e2b1b4bd99b490acf7b7561cc83e518767aa"
    deployer.deploy(CharityChallengeContract, contractOwner, npoAddress, marketAddress);
  }
}