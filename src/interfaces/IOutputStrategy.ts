import { TransactionRecord } from '../types';

export interface IOutputStrategy {
    send(data: TransactionRecord[]): Promise<void>;
}