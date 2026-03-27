import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { ConsoleOutputStrategy } from '../strategies/ConsoleOutputStrategy';
import { FileOutputStrategy } from '../strategies/FileOutputStrategy';
import { RedisOutputStrategy } from '../strategies/RedisOutputStrategy';
import { KafkaOutputStrategy } from '../strategies/KafkaOutputStrategy';

export class OutputStrategyFactory {
    static getStrategy(type: string): IOutputStrategy {
        switch (type.toLowerCase()) {
            case 'console': return new ConsoleOutputStrategy();
            case 'file': return new FileOutputStrategy();
            case 'redis': return new RedisOutputStrategy();
            case 'kafka': return new KafkaOutputStrategy();
            default: throw new Error(`Unknown strategy: ${type}`);
        }
    }
}