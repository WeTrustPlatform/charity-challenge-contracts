# charity-challenge-contract

* Smart contract is associated with 
  * one challenge, 
  * one NPO address, 
  * 1 owner for safety hatch 2

--

* Users send ETH to our smart contract. No ERC20.
* Smart contract records who sends how much.

--

* After period P1, contract stops accepting money. 
One person (anyone who wants to pay for gas) can trigger the "finalize" method 
which determine where the fund would be sent to.  
The method "finalize" will check for the result of our Augur bet and then determine whether to 1) 
Refund. 2) Forwarder to a predefined NPO's address.

* Scenario 1: Each contributor will need to trigger the "claim" method to get ETH back.
* Scenario 2: ETH is sent to NPO. This can be coupled with the "finalize" call or a separate call 
depending on the gas limit.

--

* Safety hatch 1: In case Augur's contract messed up. 
After period P2 (>P1), if money hasn't moved to the NPO's address 
(due to unexpected issues from the oracles), each contributor can claim ETH back like Scenario 1 
(or TBD?).

-- 

* Safety hatch 2: Something really really wrong that prevent users from claiming ETH 
or forwarding to NPO. After period P3 (a lot greater than P2), 
the contract's owner or Vitalik (we know his public address) can claim it 
and it's up to the taker to decide what to do with the money. Implement designated contract's owner!