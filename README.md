# RPG Admin Panel - админ-панель управления аккаунтами

Учебный проект для курса JavaRush (модуль «Java Professional»). 
Фронтенд-админка для управления аккаунтами онлайн-игры: просмотр списка с пагинацией, создание, редактирование и удаление записей. 
Бэкенд (Spring MVC REST API) предоставлен JavaRush; основная работа — HTML, CSS, JavaScript (jQuery).

## Что сделано

- Таблица аккаунтов с колонками: ID, Name, Title, Race, Profession, Level, Birthday, Banned, Edit, Delete.
- Загрузка списка через GET `/rest/players` с параметрами `pageNumber` и `pageSize`.
- Пагинация: подсчёт общего количества через GET `/rest/players/count`, генерация кнопок страниц, подсветка текущей.
- Inline-редактирование: поля Name, Title, Race, Profession, Banned превращаются в редактируемые элементы; кнопка Edit меняется на Save, кнопка Delete скрывается.
- Сохранение изменений через POST `/rest/players/{id}` с телом JSON.
- Удаление через DELETE `/rest/players/{id}` с подтверждением.
- Форма создания нового аккаунта с валидацией всех полей.
- POST `/rest/players` для создания, очистка формы и перезагрузка списка после успеха.
- Валидация на клиенте: name (1–12 символов), title (1–30), level (0–100), birthday — обязательно.
- Обработка ошибок сервера с парсингом ответа и выводом сообщений.
- Адаптивная вёрстка с hover-эффектами и мобильной версией.

## Стек

- HTML5, CSS3
- JavaScript + jQuery 3.6
- REST API (Spring MVC)
- Apache Tomcat 9 (контейнер сервлетов)

## Требования

- JDK 8+
- Maven 3.6+
- Apache Tomcat 9.0.x

## Как запустить

1. Соберите проект: `mvn clean package`.
2. Деплойте WAR в Tomcat 9 (через IDE или копированием в `webapps/`).
3. Откройте в браузере: `http://localhost:8080/`.

## API endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/rest/players?pageNumber=N&pageSize=M` | Список аккаунтов (пагинация) |
| GET | `/rest/players/count` | Общее количество аккаунтов |
| POST | `/rest/players` | Создание аккаунта |
| POST | `/rest/players/{id}` | Обновление аккаунта |
| DELETE | `/rest/players/{id}` | Удаление аккаунта |
