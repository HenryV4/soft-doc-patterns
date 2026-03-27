import { Kafka, Partitioners } from 'kafkajs';
import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { TransactionRecord } from '../types';

export class KafkaOutputStrategy implements IOutputStrategy {
    async send(records: TransactionRecord[]): Promise<void> {
        
        process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

        const kafka = new Kafka({
            clientId: 'lab4-app',
            brokers: ['localhost:9092']
        });

        const producer = kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });

        await producer.connect();

        try {
            await producer.send({
                topic: 'finance-data',
                messages: records.map((record) => ({
                    value: JSON.stringify(record)
                }))
            });

            console.log(`Published ${records.length} records to Kafka topic finance-data`);
        } catch (err) {
            console.error('Kafka send failed:', err);
            throw err;
        } finally {
            await producer.disconnect();
        }
    }
}