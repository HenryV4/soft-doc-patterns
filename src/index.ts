
import "reflect-metadata";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { configureDependencies, container } from "./config/container";
import { IDataImportService } from "./bll/interfaces/IDataImportService";
import { OrderController } from "./presentation/OrderController";

const app = express();
const port = 3000;
const upload = multer({ dest: "uploads/" });

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/presentation/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Taxi Service API",
    version: "1.0.0",
    description: "Система наповнення та керування базою даних таксі"
  },
  paths: {
    "/api/import": {
      post: {
        summary: "Ручне наповнення (завантажити CSV)",
        tags: ["Import"],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { type: "object", properties: { file: { type: "string", format: "binary" } } }
            }
          }
        },
        responses: { 200: { description: "Успішно" }, 500: { description: "Помилка" } }
      }
    },
    "/api/import-static": {
      post: {
        summary: "Автоматичне наповнення (з локального taxi_data.csv)",
        tags: ["Import"],
        responses: { 200: { description: "База наповнена 1000+ записами" } }
      }
    },
    "/api/clean": {
      post: {
        summary: "Очистити базу (Maintenance)",
        tags: ["Maintenance"],
        responses: { 200: { description: "База очищена" } }
      }
    }
  }
};

async function startServer() {
  try {
    await configureDependencies();

    const orderController = container.resolve(OrderController);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // GET роути у тебе вже є:
    app.get("/", (req, res) => orderController.getAll(req, res));
    app.get("/orders/create", (req, res) => orderController.renderCreateForm(req, res));
    app.get("/orders/edit/:id", (req, res) => orderController.renderEditForm(req, res));

    // ДОДАЙ ЦІ POST РОУТИ:
    app.post("/orders/create", (req, res) => orderController.create(req, res));
    app.post("/orders/edit/:id", (req, res) => orderController.update(req, res));

    // Видалення у тебе вже є:
    app.post("/orders/delete/:id", (req, res) => orderController.delete(req, res));


    // 1. Ручний імпорт через файл
    app.post("/api/import", upload.single("file"), async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        const importService = container.resolve<IDataImportService>("IDataImportService");
        await importService.importTaxiData(req.file.path);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(200).json({ message: "SUCCESS: Manual import completed" });
      } catch (error) {
        res.status(500).json({ error: "Manual import failed" });
      }
    });

    // 2. Автоматичне наповнення
    app.post("/api/import-static", async (req, res) => {
      try {
        const importService = container.resolve<IDataImportService>("IDataImportService");
        const csvPath = path.join(process.cwd(), "data", "taxi_data.csv");
        await importService.importTaxiData(csvPath);
        res.status(200).json({ message: "SUCCESS: 1000+ rows imported" });
      } catch (error) {
        res.status(500).json({ error: "Static import failed" });
      }
    });

    // 3. Очищення
    app.post("/api/clean", async (req, res) => {
      try {
        const importService = container.resolve<IDataImportService>("IDataImportService");
        await (importService as any).clearDatabase();
        res.status(200).json({ message: "SUCCESS: Database cleared" });
      } catch (error) {
        res.status(500).json({ error: "Cleanup failed" });
      }
    });

    app.get("/test-mvc", (req, res) => {
      res.render("test");
    });

    app.listen(port, () => {
      console.log(`SWAGGER LIVE: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();