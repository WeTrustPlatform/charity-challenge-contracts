import { TransactionOptions } from "./contracts"

export interface CharityChallenge {
  contractOwner(): Promise<string>;

  npoAddress(): Promise<string>;

  challengeName(): Promise<string>;
}