'use strict'

const assert = require('chai').assert
const CharityChallenge = artifacts.require('CharityChallenge.sol')
const MarketMock = artifacts.require('MarketMock.sol')

contract('CharityChallenge', (accounts) => {
  const CONTRACT_OWNER = accounts[1]
  const RAINFOREST_NPO_ADDRESS = accounts[2]
  const VITALIK_WEARS_SUIT_CHALLENGE = 'Vitalik wearing suits on new year\'s eve'

  let charityChallengeContract
  let marketMock

  beforeEach(async () => {
    marketMock = await MarketMock.new(false)

    charityChallengeContract = await CharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE)
  })

  it('should set contract owner via constructor', async () => {
    assert.equal(await charityChallengeContract.contractOwner(), CONTRACT_OWNER)
  })

  it('should set NPO address via constructor', async () => {
    assert.equal(await charityChallengeContract.npoAddress(), RAINFOREST_NPO_ADDRESS)
  })

  it('should set Market address via constructor', async () => {
    assert.equal(await charityChallengeContract.marketAddress(), marketMock.address)
  })

  it('should set challenge name via constructor', async () => {
    assert.equal(await charityChallengeContract.challengeName(), VITALIK_WEARS_SUIT_CHALLENGE)
  })

  it('checkAugur should return an error if the market is not finalized', async () => {
    assert.deepEqual(await charityChallengeContract.checkAugur(), [false, true])
  })
})
