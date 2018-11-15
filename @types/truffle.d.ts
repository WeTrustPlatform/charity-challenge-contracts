import * as Web3 from 'web3'
import { SpringNFTContract } from 'spring-nft-contract'
import { ERC165QueryInstance } from "./erc165-query-instance"

declare global {
  function contract(name: string, test: ContractTest): void;

  var artifacts: Artifacts;
  var web3: Web3;
  var assert: Chai.AssertStatic;
}

declare type ContractTest = (accounts: string[]) => void;

interface Contract<T> {
  "new"(...args: any[]): Promise<T>;

  deployed(): Promise<T>;

  at(address: string): T;
}

interface Artifacts {
  require(name: 'CharityChallenge.sol'): Contract<SpringNFTContract>;

  require(name: 'MarketMock.sol'): Contract<MarketMock>;
}

interface Web3 {
  toWei(amount: string, unit?: string): string;

  fromWei(amount: string, unit?: string): string;
}
