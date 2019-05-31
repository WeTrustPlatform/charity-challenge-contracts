const path = require('path');
const fs = require('fs');

const CharityChallengeContract = path.resolve(__dirname, './build/contracts/CharityChallenge.json');
const RealityCheckMockContract = path.resolve(__dirname, './build/contracts/RealityCheckMock.json');
const TestableCharityChallengeContract = path.resolve(__dirname, './build/contracts/TestableCharityChallenge.json');

const getSubContent = ({abi, bytecode, sourceMap, source, compiler, schemaVersion}) => ({abi, bytecode, sourceMap, source, compiler, schemaVersion})

const contractsContent = {
  CharityChallenge: getSubContent(require(CharityChallengeContract)),
  RealityCheckMock: getSubContent(require(RealityCheckMockContract)),
  TestableCharityChallenge: getSubContent(require(TestableCharityChallengeContract))
}

fs.writeFileSync('./.exported.js', `module.exports = ${JSON.stringify(contractsContent)};`, 'utf-8');
