import "reflect-metadata";
import path from "path";
import { configureDependencies, container } from "./config/container";
import { IDataImportService } from "./bll/interfaces/IDataImportService";

async function run() {
  try {
    console.log("-----------------------------------------");
    console.log("TAXI SERVICE DATA IMPORT STARTING...");
    console.log("-----------------------------------------");

    // 1. Налаштовуємо DI та підключаємо базу
    await configureDependencies();

    // 2. Отримуємо сервіс імпорту з контейнера
    const importService = container.resolve<IDataImportService>("IDataImportService");

    // 3. Визначаємо шлях до твого згенерованого файлу
    const csvPath = path.join(process.cwd(), "data", "taxi_data.csv");

    // 4. Запускаємо основну логіку
    console.log(`Starting to process file: ${csvPath}`);
    await importService.importTaxiData(csvPath);

    console.log("-----------------------------------------");
    console.log("SUCCESS: 1000+ ROWS IMPORTED TO SQLITE");
    console.log("-----------------------------------------");
    
    // Виходимо з процесу після завершення
    process.exit(0);
  } catch (error) {
    console.error("CRITICAL ERROR DURING IMPORT:");
    console.error(error);
    process.exit(1);
  }
}

run();