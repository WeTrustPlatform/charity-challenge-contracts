import CharityChallenge from "./charityChallenge"
import { TransactionOptions } from "./contracts";

export interface TestableCharityChallenge extends CharityChallenge {
  setChallengeEndTime(challengeEndTime: number, options?: TransactionOptions): Promise<void>;

  setChallengeSafetyHatchTime1(safetyHatchTime1: number, options?: TransactionOptions): Promise<void>;

  setChallengeSafetyHatchTime2(safetyHatchTime2: number, options?: TransactionOptions): Promise<void>;
}