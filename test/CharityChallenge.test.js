'use strict'

const assert = require('chai').assert
const CharityChallenge = artifacts.require('CharityChallenge.sol')

contract('CharityChallenge', (accounts) => {
  const CONTRACT_OWNER = accounts[1]

  let charityChallengeContract

  beforeEach(async () => {
    charityChallengeContract = await CharityChallenge.new(CONTRACT_OWNER)
  })

  it('should set contract owner via constructor', async () => {
    assert.equal(await charityChallengeContract.contractOwner(), CONTRACT_OWNER)
  })
})
