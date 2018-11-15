export interface CharityChallenge {
  contractOwner(): Promise<string>;

  npoAddress(): Promise<string>;

  challengeName(): Promise<string>;

  marketAddress(): Promise<string>;

  checkAugur(): Promise<boolean[]>;

  balanceOf(address: string): Promise<string>;
}