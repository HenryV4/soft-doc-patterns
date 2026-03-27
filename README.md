## Financial Data Processor (Strategy & Factory Patterns)
Цей проєкт реалізує гнучку систему обробки фінансових транзакцій з використанням патернів проектування Strategy та Factory. Програма зчитує великі обсяги даних з CSV-файлів та дозволяє динамічно змінювати спосіб їх виводу через конфігурацію.

### Основні можливості
- Паралельна підтримка 4-х типів виводу: **Консоль, Файл (JSON), Redis та Apache Kafka**.

- Динамічна конфігурація: Зміна місця призначення даних без перекомпіляції коду.

### Архітектура проєкту
В основі лежить принцип **Open/Closed (SOLID)**: система відкрита для розширення, але закрита для модифікації.

**Патерн Strategy**

Використовується для ізоляції логіки запису даних. Кожен тип виводу реалізує спільний інтерфейс IOutputStrategy.

**Патерн Factory**

Клас OutputStrategyFactory відповідає за створення об'єктів стратегій на основі параметра outputType з конфігураційного файлу.

### Технологічний стек
- Language: TypeScript (Node.js)

- Data Streaming: Apache Kafka 4.2.0 (KRaft mode)

- NoSQL Storage: Redis 7.2

- Containerization: Docker & Docker Compose

### Налаштування та запуск
**1. Підготовка середовища**

Переконайтеся, що у вас встановлені **Docker Desktop та Node.js**.

**2. Запуск інфраструктури**

Підніміть контейнери Redis та Kafka:
``docker compose up -d``.
Зачекайте 20-30 секунд для ініціалізації Kafka брокера.

**3. Конфігурація (app.config.json)**

Налаштуйте файл у папці config/:

```json
{
  "outputType": "kafka",
  "datasetPath": "./data.csv"
}
```

Доступні типи: console, file, redis, kafka.

**4. Запуск програми**

Встановіть залежності та запустіть головний скрипт:

```
npm install
npx ts-node src/main.ts
```

### Перевірка результатів
Перевірка Kafka (через термінал)

Щоб переконатися, що повідомлення потрапили в топік, виконайте:

``docker exec lab4-kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic finance-data --from-beginning --max-messages 10``

Перевірка Redis (через термінал)

Для перегляду збережених даних у Redis:

``docker exec lab4-redis redis-cli get transactions``