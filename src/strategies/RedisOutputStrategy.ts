import { createClient } from 'redis';
import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { TransactionRecord } from '../types';

export class RedisOutputStrategy implements IOutputStrategy {
    private client = createClient({
        url: 'redis://127.0.0.1:6379'
    });

    async send(data: TransactionRecord[]): Promise<void> {
        try {
            await this.client.connect();

            // Зберігаємо JSON-рядок
            await this.client.set('transactions', JSON.stringify(data));
            
            console.log(`[Redis] Successfully saved ${data.length} records!`);
        } catch (err) {
            console.error("[Redis] Error:", err);
            throw err;
        } finally {
            await this.client.disconnect();
        }
    }
}