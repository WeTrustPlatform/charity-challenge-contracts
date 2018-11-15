import { TransactionOptions } from "./contracts"

export interface MarketMock {
  setFinalized(finalized: boolean, options?: TransactionOptions): Promise<void>;

  setInvalid(invalid: boolean, options?: TransactionOptions): Promise<void>;

  setPayoutNumerators(numerators: number[], options?: TransactionOptions): Promise<void>;
}