import { TransactionOptions } from "./contracts"

export interface CharityChallenge {
  contractOwner(): Promise<string>;

  npoAddress(): Promise<string>;

  challengeName(): Promise<string>;

  marketAddress(): Promise<string>;

  checkAugur(): Promise<boolean[]>;

  balanceOf(address: string): Promise<string>;

  challengeEndTime(): Promise<number>;

  finalize(options?: TransactionOptions): Promise<void>;

  hasFinalizeCalled(): Promise<boolean>;

  hasChallengeAccomplished(): Promise<boolean>;

  claim(options?: TransactionOptions): Promise<void>;
}