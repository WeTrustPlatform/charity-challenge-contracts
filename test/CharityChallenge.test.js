'use strict'

const assert = require('chai').assert
const CharityChallenge = artifacts.require('CharityChallenge.sol')
const MarketMock = artifacts.require('MarketMock.sol')
const utils = require('./utils')

contract('CharityChallenge', (accounts) => {
  const CONTRACT_OWNER = accounts[1]
  const RAINFOREST_NPO_ADDRESS = accounts[2]
  const VITALIK_WEARS_SUIT_CHALLENGE = 'Vitalik wearing suits on new year\'s eve'
  const CHALLENGE_END_TIME_IN_THE_FUTURE = Math.floor(Date.now() / 1000) + 100 // 100s in the future
  const CHALLENGE_END_TIME_IN_THE_PAST = Math.floor(Date.now() / 1000) - 100 // 100s in the past

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
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_FUTURE)
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

  it('should set challenge end time via constructor', async () => {
    assert.equal(
      await charityChallengeContract.challengeEndTime(),
      CHALLENGE_END_TIME_IN_THE_FUTURE)
  })

  it('should set hasFinalizedCalled to false once contract is deployed', async () => {
    assert.isFalse(await charityChallengeContract.hasFinalizeCalled())
  })

  it('should set hasChallengeAccomplished to false once contract is deployed', async () => {
    assert.isFalse(await charityChallengeContract.hasChallengeAccomplished())
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

  it('should throw if DONOR_A sends money into contract after challenge end time', async () => {
    charityChallengeContract = await CharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)

    await utils.assertRevert(charityChallengeContract.sendTransaction(
      { value: web3.toWei('1', 'ether'), from: DONOR_A }
    ))
  })

  it('should throw if DONOR_A calls finalize before challenge end time', async () => {
    await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_A }))
  })

  it('should throw if finalize is called the second time', async () => {
    charityChallengeContract = await CharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)
    await charityChallengeContract.finalize({ from: DONOR_A })

    // perform test
    await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_B }))
  })

  // TODO: remove this test
  it('should send money to npo address if challenge accomplished', async () => {
    const RAINFOREST_NPO_INITIAL_BALANCE = web3.eth.getBalance(RAINFOREST_NPO_ADDRESS)
    charityChallengeContract = await CharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_FUTURE)
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('1', 'ether'), from: DONOR_A })
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('2', 'ether'), from: DONOR_B })
    charityChallengeContract.setChallengeEndTime(CHALLENGE_END_TIME_IN_THE_PAST,
      { from: CONTRACT_OWNER })
    await charityChallengeContract.setChallengeAccomplished(true, { from: CONTRACT_OWNER })
    await charityChallengeContract.finalize({ from: DONOR_A })

    // perform test
    const donatedAmount =
      parseInt(
        web3.fromWei(web3.eth.getBalance(RAINFOREST_NPO_ADDRESS), 'ether')) -
      parseInt(
        web3.fromWei(RAINFOREST_NPO_INITIAL_BALANCE, 'ether'))
    assert.equal(donatedAmount, 3)
  })

  // TODO: remove this test
  it(
    'should allow DONOR_A to claim 5 ETH if he has donated 5 ETH and challenge is not accomplished',
    async () => {
      const DONOR_A_INITIAL_BALANCE = web3.eth.getBalance(DONOR_A)
      charityChallengeContract = await CharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('5', 'ether'), from: DONOR_A })
      charityChallengeContract.setChallengeEndTime(CHALLENGE_END_TIME_IN_THE_PAST,
        { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeAccomplished(false, { from: CONTRACT_OWNER })
      await charityChallengeContract.finalize({ from: DONOR_B })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(
        parseInt(web3.fromWei(DONOR_A_INITIAL_BALANCE, 'ether')),
        parseInt(web3.fromWei(web3.eth.getBalance(DONOR_A), 'ether')))
    })

  it('should throw if DONOR_A call claims before challenge end time', async () => {
    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  it('should throw if DONOR_A call claims before finalize method is called', async () => {
    charityChallengeContract = await CharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)

    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  // TODO: Remove this test
  it('should throw if DONOR_A call claims when challenge has accomplished', async () => {
    charityChallengeContract = await CharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)
    await charityChallengeContract.finalize({ from: DONOR_A })
    await charityChallengeContract.setChallengeAccomplished(true, { from: CONTRACT_OWNER })

    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  it('checkAugur should return an error if the market is not finalized', async () => {
    assert.deepEqual(await charityChallengeContract.checkAugur(), [false, true])
  })
})
