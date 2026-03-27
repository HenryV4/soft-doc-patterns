import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { TransactionRecord } from '../types';


export class ConsoleOutputStrategy implements IOutputStrategy {
    async send(data: TransactionRecord[]): Promise<void> {
        console.log("=== OUTPUT TO CONSOLE ===");
        console.table(data.slice(0, 10));
        console.log(`Total records processed: ${data.length}`);
    }
}