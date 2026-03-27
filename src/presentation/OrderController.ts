import { Request, Response } from "express";
import { injectable, inject, container } from "tsyringe";
import { IOrderService } from "../bll/interfaces/IOrderService";
import { IDriverRepository } from "../dal/interfaces/IDriverRepository";
import { ICustomerRepository } from "../dal/interfaces/ICustomerRepository";

@injectable()
export class OrderController {
    constructor(
        @inject("IOrderService") private orderService: IOrderService,
        @inject("IDriverRepository") private driverRepository: IDriverRepository,
        @inject("ICustomerRepository") private customerRepository: ICustomerRepository
    ) {}

    // Відображення списку
    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.getAllOrders();
            res.render("index", { orders });
        } catch (error) {
            res.status(500).send("Помилка отримання даних");
        }
    }

    // Сторінка створення (GET)
    public async renderCreateForm(req: Request, res: Response): Promise<void> {
    try {
        // Отримуємо всіх водіїв та клієнтів для випадаючих списків
        const customers = await (container.resolve("ICustomerRepository") as any).findAll();
        const drivers = await (container.resolve("IDriverRepository") as any).findAll();
        
        res.render("create-order", { customers, drivers });
    } catch (error) {
        res.status(500).send("Помилка завантаження даних для форми");
    }
    }

    // Дія створення (POST)
    public async create(req: Request, res: Response): Promise<void> {
    try {
        const { status, totalPrice, customerId, driverId } = req.body;
        
        await this.orderService.createOrder({ 
            status, 
            totalPrice: parseFloat(totalPrice),
            createdAt: new Date(),
            // Додаємо зв'язки (TypeORM зрозуміє ці об'єкти за ID)
            customer: { userId: parseInt(customerId) } as any,
            driver: { userId: parseInt(driverId) } as any
        });
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Помилка при створенні");
    }
    }

    // Сторінка редагування (GET)
    public async renderEditForm(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string); // Явне приведення для TS
            const order = await this.orderService.getOrderById(id);
            if (!order) {
                res.status(404).send("Замовлення не знайдено");
                return;
            }
            res.render("edit-order", { order });
        } catch (error) {
            res.status(500).send("Помилка завантаження форми");
        }
    }

    // Дія оновлення (POST)
    public async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const { status, totalPrice } = req.body;
            await this.orderService.updateOrder(id, { 
                status, 
                totalPrice: parseFloat(totalPrice) 
            });
            res.redirect("/");
        } catch (error) {
            res.status(500).send("Помилка при оновленні");
        }
    }

    // Видалення (POST)
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await this.orderService.deleteOrder(id);
            res.redirect("/");
        } catch (error) {
            res.status(500).send("Помилка при видаленні");
        }
    }
}