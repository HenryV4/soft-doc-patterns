import { Order } from "../../domain/entities/Order";

export interface IOrderService {
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: number): Promise<Order | null>;
    createOrder(data: Partial<Order>): Promise<Order>;
    updateOrder(id: number, data: Partial<Order>): Promise<void>;
    deleteOrder(id: number): Promise<void>;
}