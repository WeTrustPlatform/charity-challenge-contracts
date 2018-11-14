import { TransactionOptions } from "./contracts"

export interface CharityChallenge {
  contractOwner(): Promise<string>
}