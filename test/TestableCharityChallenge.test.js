'use strict'

const assert = require('chai').assert
const TestableCharityChallenge = artifacts.require('TestableCharityChallenge.sol')
const MarketMock = artifacts.require('MarketMock.sol')
const utils = require('./utils')

contract('TestableCharityChallenge', (accounts) => {
  const CONTRACT_OWNER = accounts[1]
  const RAINFOREST_NPO_ADDRESS = accounts[2]
  const VITALIK_WEARS_SUIT_CHALLENGE = 'Vitalik wearing suits on new year\'s eve'
  const CHALLENGE_END_TIME_IN_THE_FUTURE = Math.floor(Date.now() / 1000) + 100 // 100s in the future
  const CHALLENGE_END_TIME_IN_THE_PAST = Math.floor(Date.now() / 1000) - 100 // 100s in the past
  const CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST = Math.floor(Date.now() / 1000) - 100 // 100s in the past
  const CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST = Math.floor(Date.now() / 1000) - 100 // 100s in the past

  const DONOR_A = accounts[3]
  const DONOR_B = accounts[4]
  const DONOR_C = accounts[5]

  let charityChallengeContract
  let marketMock

  beforeEach(async () => {
    marketMock = await MarketMock.new()

    charityChallengeContract = await TestableCharityChallenge.new(
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

  it('should set isEventFinalizedAndValid to false once contract is deployed', async () => {
    assert.isFalse(await charityChallengeContract.isEventFinalizedAndValid())
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
    charityChallengeContract = await TestableCharityChallenge.new(
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

  it('should throw if finalize is called the second time after market is finalized and valid',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_PAST)
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([0, 100000])
      await charityChallengeContract.finalize({ from: DONOR_A })

      // perform test
      await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_B }))
    })

  it(
    'should set challenge accomplished to true if finalize is called the second time after market is finalized and valid',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_PAST)
      await marketMock.setFinalized(false)
      await charityChallengeContract.finalize({ from: DONOR_A })

      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([0, 10000])

      // perform test
      await charityChallengeContract.finalize({ from: DONOR_A })

      // test verification
      assert.isTrue(await charityChallengeContract.isEventFinalizedAndValid())
    })

  it(
    'should set challenge accomplished to TRUE if finalize is called the second time after market is finalized and valid',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_PAST)
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(true)
      await charityChallengeContract.finalize({ from: DONOR_A })

      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([0, 10000])

      // perform test
      await charityChallengeContract.finalize({ from: DONOR_A })

      // test verification
      assert.isTrue(await charityChallengeContract.hasChallengeAccomplished())
    })

  it(
    'should set challenge accomplished to FALSE if finalize is called the second time after market is finalized and valid',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_PAST)
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(true)
      await charityChallengeContract.finalize({ from: DONOR_A })

      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([10000, 0])

      // perform test
      await charityChallengeContract.finalize({ from: DONOR_A })

      // test verification
      assert.isFalse(await charityChallengeContract.hasChallengeAccomplished())
    })

  it('should throw if finalize is called after safety hatch 1 time', async () => {
    charityChallengeContract = await TestableCharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)
    await charityChallengeContract.setChallengeSafetyHatchTime1(
      CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })

    // perform test
    await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_B }))
  })

  it('should send money to npo address if challenge accomplished', async () => {
    const RAINFOREST_NPO_INITIAL_BALANCE = web3.eth.getBalance(RAINFOREST_NPO_ADDRESS)
    charityChallengeContract = await TestableCharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_FUTURE)
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('1', 'ether'), from: DONOR_A })
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('2', 'ether'), from: DONOR_B })
    await charityChallengeContract.setChallengeEndTime(
      CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
    await marketMock.setFinalized(true)
    await marketMock.setInvalid(false)
    await marketMock.setPayoutNumerators([0, 10000])
    await charityChallengeContract.finalize({ from: DONOR_A })

    // perform test
    const donatedAmount =
      parseInt(
        web3.fromWei(web3.eth.getBalance(RAINFOREST_NPO_ADDRESS), 'ether')) -
      parseInt(
        web3.fromWei(RAINFOREST_NPO_INITIAL_BALANCE, 'ether'))
    assert.equal(donatedAmount, 3)
  })

  it(
    'should allow DONOR_A to claim 5 ETH if he has donated 5 ETH and challenge is not accomplished',
    async () => {
      const DONOR_A_INITIAL_BALANCE = web3.eth.getBalance(DONOR_A)
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([10000, 0])
      await charityChallengeContract.finalize({ from: DONOR_B })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(
        parseInt(web3.fromWei(DONOR_A_INITIAL_BALANCE, 'ether')),
        parseInt(web3.fromWei(web3.eth.getBalance(DONOR_A), 'ether')))
    })

  it(
    'should allow DONOR_A to claim 5 ETH if he has donated 5 ETH after safety hatch 1 time even thou finalize has never been called',
    async () => {
      const DONOR_A_INITIAL_BALANCE = web3.eth.getBalance(DONOR_A)
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(
        parseInt(web3.fromWei(DONOR_A_INITIAL_BALANCE, 'ether')),
        parseInt(web3.fromWei(web3.eth.getBalance(DONOR_A), 'ether')))
    })

  it(
    'should throw if DONOR_A to claim 5 ETH after safety hatch 2 time',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime2(
        CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
    })

  it('should allow contract owner to claim total contract balance of 5 ETH', async () => {
    const CONTRACT_OWNER_INITIAL_BALANCE = web3.eth.getBalance(CONTRACT_OWNER)
    charityChallengeContract = await TestableCharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_FUTURE)
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('2', 'ether'), from: DONOR_A })
    await charityChallengeContract.sendTransaction(
      { value: web3.toWei('3', 'ether'), from: DONOR_B })
    await charityChallengeContract.setChallengeSafetyHatchTime1(
      CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
    await charityChallengeContract.setChallengeSafetyHatchTime2(
      CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

    // perform test
    await charityChallengeContract.safetyHatchClaim({ from: CONTRACT_OWNER })

    // test verification
    const safetyHatchClaimAmount =
      parseInt(
        web3.fromWei(web3.eth.getBalance(CONTRACT_OWNER), 'ether')) -
      parseInt(
        web3.fromWei(CONTRACT_OWNER_INITIAL_BALANCE, 'ether'))
    assert.equal(safetyHatchClaimAmount, 5)
  })

  it(
    'should return zero balance of DONOR_A, DONOR_B, DONOR_C in the contract when contract owner calls safety hatch claim after safety hatch 2',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('3', 'ether'), from: DONOR_B })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime2(
        CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await charityChallengeContract.safetyHatchClaim({ from: CONTRACT_OWNER })

      // test verification
      assert.equal(web3.fromWei(await charityChallengeContract.balanceOf(DONOR_A), 'ether'), '0')
      assert.equal(web3.fromWei(await charityChallengeContract.balanceOf(DONOR_B), 'ether'), '0')
      assert.equal(web3.fromWei(await charityChallengeContract.balanceOf(DONOR_C), 'ether'), '0')
      assert.equal(
        web3.fromWei(web3.eth.getBalance(charityChallengeContract.address), 'ether'),
        '0')
    })

  it(
    'should emit SafetyHatchClaimed event when contract owner claims total contract balance after safety hatch time 2',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('3', 'ether'), from: DONOR_B })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime2(
        CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      const result = await charityChallengeContract.safetyHatchClaim({ from: CONTRACT_OWNER })

      // test verification
      assert.equal(result.logs[0].event, 'SafetyHatchClaimed')
    })

  it(
    'should throw if it is not the contract owner who calls safety hatch claim after safety hatch time 2',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('3', 'ether'), from: DONOR_B })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime2(
        CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await utils.assertRevert(charityChallengeContract.safetyHatchClaim({ from: DONOR_A }))
    })

  it(
    'should throw if contract owner calls safety hatch claim before safety hatch time 2',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('3', 'ether'), from: DONOR_B })
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await utils.assertRevert(charityChallengeContract.safetyHatchClaim({ from: CONTRACT_OWNER }))
    })

  it(
    'should emit Claimed event after DONOR_A claims the money',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(CHALLENGE_END_TIME_IN_THE_PAST,
        { from: CONTRACT_OWNER })
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([10000, 0])
      await charityChallengeContract.finalize({ from: DONOR_B })

      // perform test
      const result = await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(result.logs[0].event, 'Claimed')
    })

  it(
    'should return balance of DONOR_A as zero after DONOR_A has claimed',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.sendTransaction(
        { value: web3.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(CHALLENGE_END_TIME_IN_THE_PAST,
        { from: CONTRACT_OWNER })
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([10000, 0])
      await charityChallengeContract.finalize({ from: DONOR_B })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(web3.fromWei(await charityChallengeContract.balanceOf(DONOR_A)), '0')
    })

  it(
    'should throw if DONOR_A is trying to claim money he has never donated',
    async () => {
      charityChallengeContract = await TestableCharityChallenge.new(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address,
        VITALIK_WEARS_SUIT_CHALLENGE,
        CHALLENGE_END_TIME_IN_THE_FUTURE)
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([10000, 0])
      await charityChallengeContract.finalize({ from: DONOR_B })

      // test verification
      await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
    })

  it('should throw if DONOR_A call claims before challenge end time', async () => {
    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  it('should throw if DONOR_A call claims before finalize method is called', async () => {
    charityChallengeContract = await TestableCharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)

    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  it('should throw if DONOR_A call claims when challenge has accomplished', async () => {
    charityChallengeContract = await TestableCharityChallenge.new(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address,
      VITALIK_WEARS_SUIT_CHALLENGE,
      CHALLENGE_END_TIME_IN_THE_PAST)
    await marketMock.setFinalized(true)
    await marketMock.setInvalid(false)
    await marketMock.setPayoutNumerators([0, 10000])
    await charityChallengeContract.finalize({ from: DONOR_A })

    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })
})
