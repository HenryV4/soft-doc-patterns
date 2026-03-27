import * as path from 'path';
import * as config from '../config/app.config.json';
import { CSVDataReader } from './readers/CSVDataReader';
import { OutputStrategyFactory } from './factories/OutputStrategyFactory';

async function main(): Promise<void> {
    try {
        const inputPath = path.resolve(process.cwd(), config.datasetPath);
        
        const reader = new CSVDataReader();
        const data = await reader.read(inputPath); 
        
        console.log(`Read ${data.length} records. Sending first 100 for test...`);

        const strategy = OutputStrategyFactory.getStrategy(config.outputType);
        
        await strategy.send(data.slice(0, 100));
        
        console.log('Lab-4 pipeline completed successfully.');
    } catch (error) {
        process.exit(1);
    }
}

void main();