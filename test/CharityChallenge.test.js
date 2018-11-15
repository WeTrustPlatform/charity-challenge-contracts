'use strict'

const assert = require('chai').assert
const CharityChallenge = artifacts.require('CharityChallenge.sol')
const MarketMock = artifacts.require('MarketMock.sol')
const utils = require('./utils')

contract('CharityChallenge', (accounts) => {
  const CONTRACT_OWNER = accounts[1]
  const RAINFOREST_NPO_ADDRESS = accounts[2]
  const VITALIK_WEARS_SUIT_CHALLENGE = 'Vitalik wearing suits on new year\'s eve'

  const DONOR_A = accounts[3]
  const DONOR_B = accounts[4]

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

  it('should return zero contract balance when no donation has been made', async () => {
    assert.equal(await web3.eth.getBalance(charityChallengeContract.address), 0)
  })

  it('should return contract balance of 10 ETH when DONOR_A sends 10 ETH', async () => {
    // perform test
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('10', 'ether'), from: DONOR_A })

    // test verification
    const contractBalance = await web3.eth.getBalance(charityChallengeContract.address)
    assert.equal(web3.fromWei(contractBalance, 'ether'), '10')
  })

  it(
    'should return contract balance of 12 ETH when DONOR_A sends 10 ETH, DONOR_B sends 1 ETH, DONOR_A sends another 1 ETH',
    async () => {
      // perform test
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('10', 'ether'), from: DONOR_A }
      )
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('1', 'ether'), from: DONOR_B }
      )
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('1', 'ether'), from: DONOR_A }
      )

      // test verification
      const contractBalance = await web3.eth.getBalance(charityChallengeContract.address)
      assert.equal(web3.fromWei(contractBalance, 'ether'), '12')
    })

  it('should return that DONOR_A has donated 11 ETH if he has donated 11 ETH', async () => {
    // perform test
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('10', 'ether'), from: DONOR_A }
    )
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('1', 'ether'), from: DONOR_B }
    )
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('1', 'ether'), from: DONOR_A }
    )

    // test verification
    assert.equal(web3.fromWei(await charityChallengeContract.balanceOf(DONOR_A)), '11')
  })

  it('should return that DONOR_A has donated 0 ETH if he has not donated any', async () => {
    assert.equal(web3.fromWei(await charityChallengeContract.balanceOf(DONOR_A)), '0')
  })

  it('should throw if donation amount is zero', async () => {
    await utils.assertRevert(charityChallengeContract.sendTransaction(
      { value: '0', from: DONOR_A }
    ))
  })

  it('should emit Recieved event when DONOR_A sends money into contract', async () => {
    const result = await charityChallengeContract.sendTransaction(
      { value: web3.toWei('2', 'ether'), from: DONOR_A }
    )

    assert.equal(result.logs[0].event, 'Received')
  })

  it('checkAugur should return an error if the market is not finalized', async () => {
    assert.deepEqual(await charityChallengeContract.checkAugur(), [false, true])
  })
})
