const path = require('path');
const fs = require('fs');

const CharityChallengeContract = path.resolve(__dirname, './build/contracts/CharityChallenge.json');

const {
  abi, bytecode, sourceMap, source, compiler, schemaVersion,
} = require(CharityChallengeContract);

const contractContent = {
  abi, bytecode, sourceMap, source, compiler, schemaVersion,
};

fs.writeFileSync('./.exported.js', `module.exports = ${JSON.stringify(contractContent)};`, 'utf-8');
