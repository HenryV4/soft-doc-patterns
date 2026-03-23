# Taxi Service Data Integration System
Проєкт реалізує повноцінну систему інтеграції та обробки даних для сервісу таксі. Система автоматично генерує великі масиви даних (1000+ записів), проводить їх валідацію та імпортує в реляційну базу даних SQLite, зберігаючи цілісність складних зв'язків.

## Архітектура проєкту
Проєкт побудований на принципах **Layered Architecture** (Багатошарова архітектура) та **Dependency Injection**:

* Domain Layer (Entities): Використання TypeORM для опису сутностей. Реалізовано наслідування типів (Table Per Hierarchy) для користувачів (Водії/Клієнти).

* DAL (Data Access Layer): Патерн Repository для ізоляції логіки роботи з БД.

* BLL (Business Logic Layer): Сервіс імпорту, що трансформує "плоский" CSV у реляційну структуру.

* Infrastructure: Контейнер залежностей `tsyringe` (IoC) для управління життєвим циклом об'єктів.

## Технологічний стек
* Мова: `TypeScript`

* ORM: `TypeORM`

* БД: `SQLite`

* DI Container: `tsyringe`

* Tools: `ts-node, rimraf, csv-parse`

## Функціональні особливості
* **Smart CSV Generation**: Генерація 1000+ унікальних поїздок з українськими форматами телефонів та номерних знаків.

* **Local Routing**: Алгоритм забезпечує реалістичність маршрутів (поїздки відбуваються в межах одного міста).

* Randomized Analytics: Динамічна генерація рейтингів, кількості поїздок та статусів доступності авто.

## Структура проєкту

```
src/
├── domain/
│   ├── entities/         # ORM моделі (User, Custommer, Driver, Car, Order, Review, Route)
├── dal/                  # Data Access Layer
│   ├── interfaces/       # Інтерфейси репозиторіїв
│   ├── repositories/     # Імплементації репозиторіїв
│   └── dataSource.ts     # TypeORM конфігурація
├── bll/                  # Business Logic Layer
│   ├── interfaces/       # Інтерфейси сервісів
│   └── services/         # Імплементації сервісів
├── presentation/         # Presentation Layer
│   └── interfaces/       # Інтерфейси контролерів (Поки пусті)
├── config/
│   └── container.ts      # DI контейнер конфігурація
├── utils/
│   └── csvGenerator.ts   # Генератор CSV файлів
└── index.ts              # Головний файл додатку
```

## Запуск проєкту
1. Встановлення залежностей

`npm install`

2. Повний цикл (Очищення + Генерація + Імпорт)

Це одна команда, яка підготує базу "з нуля":

`npm run full-run`

3. Окремі команди

`npm run clean` — видалення старої бази та CSV (через PowerShell).

`npm run generate-csv` — тільки генерація 1000 рядків.

`npm run import-data` — імпорт наявного CSV в SQLite.

## Структура бази даних

Система автоматично створює та заповнює наступні таблиці:

|Таблиця|Опис|
|--|--|
|users|Клієнти та Водії (з урахуванням ролей та гендеру).|
|cars|Автомобілі зі зв'язком до водія та статусом isAvailable|
|orders|Логи замовлень|
|routes|Маршрути поїздок (Start/End points, Distance)|
|reviews|Відгуки з оцінками|

## Модель даних

#### User (Base Entity)
Базова таблиця users з використанням паттерну TableInheritance.

`userId` : `number` (Primary Key) — Унікальний ідентифікатор.

`firstName` : `string` — Ім'я.

`lastName` : `string` — Прізвище.

`phoneNumber` : `string` — Номер телефону.

`gender` : `string` — Стать.

`role` : `string` (Discriminator) — Тип користувача в БД (driver або customer).

#### Driver (Child Entity)
Наслідує User.

`totalTrips` : `integer` — Загальна кількість поїздок водія.

`driverRating` : `float` — Рейтинг водія.

`driverLicense` : `string` — Номер посвідчення.

`car` : `OneToOne<Car>` — Зв'язок з автомобілем.

#### Customer (Child Entity)
Наслідує User.

`totalTrips` : `integer` — Загальна кількість замовлень клієнта.

`customerRating` : `float` — Рейтинг клієнта.

`favoriteAddresses` : `string[]` (simple-array) — Список збережених адрес.

#### Car
`carId` : `number` (Primary Key).

`model` : `string` — Марка та модель.

`plateNumber` : `string` — Державний номер.

`color` : `string` — Колір авто.

`type` : `string` — Клас (напр., "Економ", "Комфорт").

`isAvailable` : `boolean` (default: true).

#### Order
`orderId` : `number` (Primary Key).

`status` : `string` — Поточний стан замовлення.

`totalPrice` : `float` — Вартість поїздки.

`createdAt` : `Date` — Дата та час створення.

`customer` : `ManyToOne<Customer>` — Клієнт, що замовив.

`driver` : `ManyToOne<Driver>` — Призначений водій.

`route` : `ManyToOne<Route>` — Деталі маршруту.

#### Route
`routeId` : `number` (Primary Key).

`startPoint` : `string` — Точка А.

`endPoint` : `string` — Точка Б.

`distance` : `float` — Відстань у км.

#### Review
`reviewId` : `number` (Primary Key).

`rating` : `float` — Оцінка (від 1 до 5).

`comment` : `text` — Відгук клієнта.

`order` : `OneToOne<Order>` — Зв'язок із конкретним замовленням.
