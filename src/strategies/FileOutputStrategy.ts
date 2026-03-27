import fs from 'fs';
import path from 'path';
import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { TransactionRecord } from '../types';

export class FileOutputStrategy implements IOutputStrategy {
    async send(data: TransactionRecord[]): Promise<void> {
        const outputPath = path.join(__dirname, '../../output/result.json');
        
        if (!fs.existsSync(path.dirname(outputPath))) {
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`Successfully saved ${data.length} records to ${outputPath}`);
    }
}