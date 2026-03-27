##  Taxi Service Management System (MVC)
Цей проєкт є веб-додатком для керування службою таксі, побудованим на архітектурному шаблоні MVC (Model-View-Controller). Проєкт дозволяє переглядати, створювати, редагувати та видаляти замовлення через зручний веб-інтерфейс.

##  Основні можливості (CRUD)
- Create: Створення нових замовлень з автоматичним призначенням статусу PENDING.

- Read: Візуалізація даних у вигляді таблиць (список замовлень, імена клієнтів та водіїв).

- Update: Редагування існуючих записів (зміна статусу та ціни).

- Delete: Видалення замовлень із бази даних.

- Import: Автоматичне наповнення бази даних 1000+ записами через CSV-файл (Lab 2 legacy).

##  Архітектура проєкту
Проєкт реалізований з чітким розділенням відповідальності:

- Model: Бізнес-логіка (OrderService) та доступ до даних (OrderRepository).

- View: Динамічні HTML-сторінки, побудовані на рушії шаблонів EJS з використанням Bootstrap 5.

- Controller: Обробка вхідних запитів та керування потоком даних (OrderController).

##  Технологічний стек
- Backend: Node.js, Express, TypeScript.

- Database: SQLite + TypeORM.

- Dependency Injection: tsyringe.

- Frontend: EJS (Embedded JavaScript templates), Bootstrap.

- API Documentation: Swagger UI.

##  Як запустити проєкт
1. Встановлення залежностей
Оскільки проект використовує специфічні версії TypeORM та MySQL драйверів, встановлюйте пакети з ігноруванням конфліктів peer-залежностей:
``npm install --legacy-peer-deps``

2. Наповнення бази даних
Перед першим використанням інтерфейсу необхідно наповнити базу даних:
- Запустіть сервер: npm run dev.

- Відкрийте Swagger: http://localhost:3000/api-docs.

- Виконайте POST запит до /api/import-static.

3. Робота з інтерфейсом
Відкрийте браузер за адресою:
http://localhost:3000/

##  Структура папок (MVC частина)
- src/presentation/views/ — HTML-шаблони (index, edit-order, create-order).

- src/presentation/OrderController.ts — логіка обробки запитів.

- src/bll/services/OrderService.ts — рівень бізнес-логіки.

- src/index.ts — конфігурація сервера та маршрутизація.