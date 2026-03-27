import { injectable, inject } from 'tsyringe';
import { IOrderService } from '../interfaces/IOrderService';
import { IOrderRepository } from '../../dal/interfaces/IOrderRepository';
import { Order } from '../../domain/entities/Order';

@injectable()
export class OrderService implements IOrderService {
    constructor(
        @inject('IOrderRepository') private orderRepository: IOrderRepository
    ) {}

    async getAllOrders(): Promise<Order[]> {
        // Використовуємо твій готовий метод, який тягне зв'язки
        return await this.orderRepository.findAll();
    }

    async getOrderById(id: number): Promise<Order | null> {
        // Потрібен для форми редагування
        return await this.orderRepository.findById(id);
    }

    async createOrder(data: Partial<Order>): Promise<Order> {
        // Створюємо через репозиторій
        const order = new Order(data);
        return await this.orderRepository.save(order);
    }

    async updateOrder(id: number, data: Partial<Order>): Promise<void> {
        const order = await this.orderRepository.findById(id);
        if (order) {
            Object.assign(order, data);
            await this.orderRepository.save(order);
        }
    }

    async deleteOrder(id: number): Promise<void> {
        // Отримуємо доступ до базового репозиторію TypeORM для видалення
        const actualRepo = (this.orderRepository as any).repository;
        await actualRepo.delete(id);
    }
}