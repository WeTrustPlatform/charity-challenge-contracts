'use strict'

const assert = require('chai').assert
const TestableCharityChallenge = artifacts.require('TestableCharityChallenge.sol')
const MarketMock = artifacts.require('MarketMock.sol')
const utils = require('./utils')

const newSingleNPOChallengeContract = (contractAddr, npoAddr, marketAddr) => {
  const npoAddrs = [npoAddr]
  const ratios = [1]
  return TestableCharityChallenge.new(contractAddr, npoAddrs, ratios, marketAddr, false)
}

const newMultiplNPOsChallengeContract = (contractAddr, npoAddrs, ratios, marketAddr) => {
  return TestableCharityChallenge.new(contractAddr, npoAddrs, ratios, marketAddr, false)
}

const newSingleNPOChallengeOption2Contract = (contractAddr, npoAddr, marketAddr) => {
  const npoAddrs = [npoAddr]
  const ratios = [1]
  return TestableCharityChallenge.new(contractAddr, npoAddrs, ratios, marketAddr, true)
}

contract('TestableCharityChallenge', (accounts) => {
  const CONTRACT_OWNER = accounts[1]
  const RAINFOREST_NPO_ADDRESS = accounts[2]
  const CHAINSAFE_NPO_ADDRESS = accounts[3]
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
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)

    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)
  })

  it('should set contract owner via constructor', async () => {
    assert.equal(await charityChallengeContract.contractOwner(), CONTRACT_OWNER)
  })

  it('should set NPO address via constructor', async () => {
    assert.equal(await charityChallengeContract.npoAddresses(0), RAINFOREST_NPO_ADDRESS)
  })

  it('should set Market address via constructor', async () => {
    assert.equal(await charityChallengeContract.marketAddress(), marketMock.address)
  })

  it('should set challenge end time via constructor', async () => {
    assert.equal(
      await charityChallengeContract.challengeEndTime(),
      CHALLENGE_END_TIME_IN_THE_FUTURE)
  })

  it('should set isEventFinalized to false once contract is deployed', async () => {
    assert.isFalse(await charityChallengeContract.isEventFinalized())
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
      { value: web3.utils.toWei('10', 'ether'), from: DONOR_A })

    // test verification
    const contractBalance = await web3.eth.getBalance(charityChallengeContract.address)
    assert.equal(web3.utils.fromWei(contractBalance, 'ether'), '10')
  })

  it(
    'should return contract balance of 12 ETH when DONOR_A sends 10 ETH, DONOR_B sends 1 ETH, DONOR_A sends another 1 ETH',
    async () => {
      // perform test
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('10', 'ether'), from: DONOR_A }
      )
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('1', 'ether'), from: DONOR_B }
      )
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('1', 'ether'), from: DONOR_A }
      )

      // test verification
      const contractBalance = await web3.eth.getBalance(charityChallengeContract.address)
      assert.equal(web3.utils.fromWei(contractBalance, 'ether'), '12')
    })

  it('should return that DONOR_A has donated 11 ETH if he has donated 11 ETH', async () => {
    // perform test
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('10', 'ether'), from: DONOR_A }
    )
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('1', 'ether'), from: DONOR_B }
    )
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('1', 'ether'), from: DONOR_A }
    )

    // test verification
    assert.equal(web3.utils.fromWei(await charityChallengeContract.balanceOf(DONOR_A)), '11')
    assert.equal(2, await charityChallengeContract.donorCount())
  })

  it('should return that DONOR_A has donated 0 ETH if he has not donated any', async () => {
    assert.equal(web3.utils.fromWei(await charityChallengeContract.balanceOf(DONOR_A)), '0')
    assert.equal(0, await charityChallengeContract.donorCount())
  })

  it('should throw if donation amount is zero', async () => {
    await utils.assertRevert(charityChallengeContract.sendTransaction(
      { value: '0', from: DONOR_A }
    ))
  })

  it('should emit Recieved event when DONOR_A sends money into contract', async () => {
    const result = await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('2', 'ether'), from: DONOR_A }
    )

    assert.equal(result.logs[0].event, 'Received')
  })

  it('should throw if DONOR_A sends money into contract after challenge end time', async () => {
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)

    await utils.assertRevert(charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('1', 'ether'), from: DONOR_A }
    ))
  })

  it('should throw if DONOR_A calls finalize before challenge end time', async () => {
    await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_A }))
  })

  it('should throw if finalize is called the second time after market is finalized',
    async () => {
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([0, 100000])
      await charityChallengeContract.finalize({ from: DONOR_A })

      // perform test
      await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_B }))
    })

  it(
    'should set challenge accomplished to true if finalize is called the second time after market is finalized',
    async () => {
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await marketMock.setFinalized(false)
      await charityChallengeContract.finalize({ from: DONOR_A })

      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([0, 10000])

      // perform test
      await charityChallengeContract.finalize({ from: DONOR_A })

      // test verification
      assert.isTrue(await charityChallengeContract.isEventFinalized())
    })

  it(
    'should set challenge accomplished to FALSE if market is finalized and its outcome is INVALID',
    async () => {
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(true)

      // perform test
      await charityChallengeContract.finalize({ from: DONOR_A })

      // test verification
      assert.isFalse(await charityChallengeContract.hasChallengeAccomplished())
    })

  it('should throw if finalize is called after safety hatch 1 time', async () => {
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)
    await charityChallengeContract.setChallengeSafetyHatchTime1(
      CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })

    // perform test
    await utils.assertRevert(charityChallengeContract.finalize({ from: DONOR_B }))
  })

  it('should send money to npo address if augur market is YES', async () => {
    const RAINFOREST_NPO_INITIAL_BALANCE = await web3.eth.getBalance(RAINFOREST_NPO_ADDRESS)
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('1', 'ether'), from: DONOR_A })
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('2', 'ether'), from: DONOR_B })
    await charityChallengeContract.setChallengeEndTime(
      CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
    await marketMock.setFinalized(true)
    await marketMock.setInvalid(false)
    await marketMock.setPayoutNumerators([0, 10000])
    await charityChallengeContract.finalize({ from: DONOR_A })

    const rainForestBalance = await web3.eth.getBalance(RAINFOREST_NPO_ADDRESS) 
    // perform test
    const donatedAmount =
      parseInt(
        web3.utils.fromWei(rainForestBalance.toString(), 'ether')) -
      parseInt(
        web3.utils.fromWei(RAINFOREST_NPO_INITIAL_BALANCE.toString(), 'ether'))
    assert.equal(donatedAmount, 3)
  })

  it('should send money to npo address if augur market is NO', async () => {
    const RAINFOREST_NPO_INITIAL_BALANCE = await web3.eth.getBalance(RAINFOREST_NPO_ADDRESS)
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
    charityChallengeContract = await newSingleNPOChallengeOption2Contract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('1', 'ether'), from: DONOR_A })
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('2', 'ether'), from: DONOR_B })
    await charityChallengeContract.setChallengeEndTime(
      CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
    await marketMock.setFinalized(true)
    await marketMock.setInvalid(false)
    await marketMock.setPayoutNumerators([10000, 0])
    await charityChallengeContract.finalize({ from: DONOR_A })

    const rainForestBalance = await web3.eth.getBalance(RAINFOREST_NPO_ADDRESS) 
    // perform test
    const donatedAmount =
      parseInt(
        web3.utils.fromWei(rainForestBalance.toString(), 'ether')) -
      parseInt(
        web3.utils.fromWei(RAINFOREST_NPO_INITIAL_BALANCE.toString(), 'ether'))
    assert.equal(donatedAmount, 3)
  })

  it(
    'should allow DONOR_A to claim 5 ETH if he has donated 5 ETH and challenge is not accomplished',
    async () => {
      const DONOR_A_INITIAL_BALANCE = await web3.eth.getBalance(DONOR_A)
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('5', 'ether'), from: DONOR_A })
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
        parseInt(web3.utils.fromWei(DONOR_A_INITIAL_BALANCE.toString(), 'ether')),
        parseInt(web3.utils.fromWei(await web3.eth.getBalance(DONOR_A), 'ether')))
    })

  it(
    'should allow DONOR_A to claim 5 ETH if he has donated 5 ETH after safety hatch 1 time even thou finalize has never been called',
    async () => {
      const DONOR_A_INITIAL_BALANCE = await web3.eth.getBalance(DONOR_A)
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(
        parseInt(web3.utils.fromWei(DONOR_A_INITIAL_BALANCE.toString(), 'ether')),
        parseInt(web3.utils.fromWei(await web3.eth.getBalance(DONOR_A), 'ether')))
    })

  it(
    'should allow DONOR_A to claim 5 ETH after safety hatch 2 time',
    async () => {
      const DONOR_A_INITIAL_BALANCE = await web3.eth.getBalance(DONOR_A)
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(
        CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime2(
        CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(
        parseInt(web3.utils.fromWei(DONOR_A_INITIAL_BALANCE.toString(), 'ether')),
        parseInt(web3.utils.fromWei(await web3.eth.getBalance(DONOR_A), 'ether')))
    })

  it('should allow contract owner to claim total contract balance of 5 ETH', async () => {
    const CONTRACT_OWNER_INITIAL_BALANCE = await web3.eth.getBalance(CONTRACT_OWNER)
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('2', 'ether'), from: DONOR_A })
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('3', 'ether'), from: DONOR_B })
    await charityChallengeContract.setChallengeSafetyHatchTime1(
      CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
    await charityChallengeContract.setChallengeSafetyHatchTime2(
      CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

    // perform test
    await charityChallengeContract.safetyHatchClaim({ from: CONTRACT_OWNER })

    const balance = await web3.eth.getBalance(CONTRACT_OWNER)
    // test verification
    const safetyHatchClaimAmount =
      parseInt(
        web3.utils.fromWei(balance.toString(), 'ether')) -
      parseInt(
        web3.utils.fromWei(CONTRACT_OWNER_INITIAL_BALANCE.toString(), 'ether'))
    assert.equal(safetyHatchClaimAmount, 5)
  })

  it(
    'should return zero balance of DONOR_A, DONOR_B, DONOR_C in the contract when contract owner calls safety hatch claim after safety hatch 2',
    async () => {
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('3', 'ether'), from: DONOR_B })
      await charityChallengeContract.setChallengeSafetyHatchTime1(
        CHALLENGE_SAFETY_HATCH_1_IN_THE_PAST, { from: CONTRACT_OWNER })
      await charityChallengeContract.setChallengeSafetyHatchTime2(
        CHALLENGE_SAFETY_HATCH_2_IN_THE_PAST, { from: CONTRACT_OWNER })

      // perform test
      await charityChallengeContract.safetyHatchClaim({ from: CONTRACT_OWNER })

      const balanceA = await charityChallengeContract.balanceOf(DONOR_A)
      const balanceB = await charityChallengeContract.balanceOf(DONOR_B)
      const balanceC = await charityChallengeContract.balanceOf(DONOR_C)
      const balance = await web3.eth.getBalance(charityChallengeContract.address)
      // test verification
      assert.equal(web3.utils.fromWei(balanceA.toString(), 'ether'), '0')
      assert.equal(web3.utils.fromWei(balanceB.toString(), 'ether'), '0')
      assert.equal(web3.utils.fromWei(balanceC.toString(), 'ether'), '0')
      assert.equal(web3.utils.fromWei(balance, 'ether'), '0')
      assert.equal(2, await charityChallengeContract.donorCount())
    })

  it(
    'should emit SafetyHatchClaimed event when contract owner claims total contract balance after safety hatch time 2',
    async () => {
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('3', 'ether'), from: DONOR_B })
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
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('3', 'ether'), from: DONOR_B })
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
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('2', 'ether'), from: DONOR_A })
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('3', 'ether'), from: DONOR_B })
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
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('5', 'ether'), from: DONOR_A })
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
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
      await charityChallengeContract.sendTransaction(
        { value: web3.utils.toWei('5', 'ether'), from: DONOR_A })
      await charityChallengeContract.setChallengeEndTime(CHALLENGE_END_TIME_IN_THE_PAST,
        { from: CONTRACT_OWNER })
      await marketMock.setFinalized(true)
      await marketMock.setInvalid(false)
      await marketMock.setPayoutNumerators([10000, 0])
      await charityChallengeContract.finalize({ from: DONOR_B })

      // perform test
      await charityChallengeContract.claim({ from: DONOR_A })

      // test verification
      assert.equal(web3.utils.fromWei(await charityChallengeContract.balanceOf(DONOR_A)), '0')
      assert.equal(1, await charityChallengeContract.donorCount())
    })

  it(
    'should throw if DONOR_A is trying to claim money he has never donated',
    async () => {
      marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
      charityChallengeContract = await newSingleNPOChallengeContract(
        CONTRACT_OWNER,
        RAINFOREST_NPO_ADDRESS,
        marketMock.address)
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
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)

    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  it('should throw if DONOR_A call claims when challenge has accomplished', async () => {
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_PAST)
    charityChallengeContract = await newSingleNPOChallengeContract(
      CONTRACT_OWNER,
      RAINFOREST_NPO_ADDRESS,
      marketMock.address)
    await marketMock.setFinalized(true)
    await marketMock.setInvalid(false)
    await marketMock.setPayoutNumerators([0, 10000])
    await charityChallengeContract.finalize({ from: DONOR_A })

    await utils.assertRevert(charityChallengeContract.claim({ from: DONOR_A }))
  })

  it('should throw if length of npos is not the same to length of ratios', async () => {
    await utils.assertRevert(
      charityChallengeContract = newMultiplNPOsChallengeContract(
        CONTRACT_OWNER,
        [RAINFOREST_NPO_ADDRESS],
        [1, 1],
        marketMock.address)
    )
  })

  it('should create contract with multiple npos successfully', async () => {
    marketMock.setEndTime(CHALLENGE_END_TIME_IN_THE_FUTURE)
    charityChallengeContract = await newMultiplNPOsChallengeContract(
      CONTRACT_OWNER,
      [RAINFOREST_NPO_ADDRESS, CHAINSAFE_NPO_ADDRESS],
      [2, 1],
      marketMock.address)

    assert.equal(CONTRACT_OWNER, await charityChallengeContract.contractOwner())
    assert.equal(RAINFOREST_NPO_ADDRESS, await charityChallengeContract.npoAddresses(0))
    assert.equal(CHAINSAFE_NPO_ADDRESS, await charityChallengeContract.npoAddresses(1))
    assert.equal(2, await charityChallengeContract.npoRatios(RAINFOREST_NPO_ADDRESS))
    assert.equal(1, await charityChallengeContract.npoRatios(CHAINSAFE_NPO_ADDRESS))

    // should allow donors to donate multiple-npo contract
    await charityChallengeContract.sendTransaction(
      { value: web3.utils.toWei('5', 'ether'), from: DONOR_A })

    const balance = await web3.eth.getBalance(charityChallengeContract.address)
    assert.equal(5, parseInt(
      web3.utils.fromWei(balance.toString(), 'ether')) )

    // should get correct expected amount
    const expectedRainForestAmountWei = await charityChallengeContract.getExpectedDonationAmount(RAINFOREST_NPO_ADDRESS);
    const expectedRainForestAmount = parseFloat(web3.utils.fromWei(expectedRainForestAmountWei.toString(), 'ether'));
    assert.equal('3.33', expectedRainForestAmount.toString().substring(0, 4));

    const expectedChainSafeAmountWei = await charityChallengeContract.getExpectedDonationAmount(CHAINSAFE_NPO_ADDRESS);
    const expectedChainSafeAmount = parseFloat(web3.utils.fromWei(expectedChainSafeAmountWei.toString(), 'ether'));
    assert.equal('1.66', expectedChainSafeAmount.toString().substring(0, 4));

    await utils.assertRevert(charityChallengeContract.getExpectedDonationAmount(CONTRACT_OWNER))

    // should donate correct amount to ratios
    const RAINFOREST_NPO_INITIAL_BALANCE = await web3.eth.getBalance(RAINFOREST_NPO_ADDRESS)
    const CHAINSAFE_NPO_INITIAL_BALANCE = await web3.eth.getBalance(CHAINSAFE_NPO_ADDRESS)

    await charityChallengeContract.setChallengeEndTime(
      CHALLENGE_END_TIME_IN_THE_PAST, { from: CONTRACT_OWNER })
    await marketMock.setFinalized(true)
    await marketMock.setInvalid(false)
    await marketMock.setPayoutNumerators([0, 10000])
    const result = await charityChallengeContract.finalize({ from: DONOR_A })
    assert.equal('Donated', result.logs[0].event)
    assert.equal('Donated', result.logs[1].event)
    
    const newRainForestBalance = await web3.eth.getBalance(RAINFOREST_NPO_ADDRESS)
    let donatedAmount = 
      parseFloat(
        web3.utils.fromWei(newRainForestBalance.toString(), 'ether')) -
      parseFloat(
        web3.utils.fromWei(RAINFOREST_NPO_INITIAL_BALANCE.toString(), 'ether'))
    assert.equal('3.33', donatedAmount.toString().substring(0, 4))
    const newChainSafeBalance = await web3.eth.getBalance(CHAINSAFE_NPO_ADDRESS)
    donatedAmount = 
      parseFloat(
        web3.utils.fromWei(newChainSafeBalance.toString(), 'ether')) -
      parseFloat(
        web3.utils.fromWei(CHAINSAFE_NPO_INITIAL_BALANCE.toString(), 'ether'))
    assert.equal('1.66', donatedAmount.toString().substring(0, 4))
  })

  // it('should allow donors to donate multiple-npo contract', async () => {
    
  // })

  // it('should donate correct amount to ratios', async () => {
    
  // })
})
