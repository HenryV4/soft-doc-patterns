import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { TransactionRecord } from '../types';

export class CSVDataReader {
    read(filePath: string): TransactionRecord[] {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
    }
}