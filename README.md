# 📘 Документация проекта

## ⚙️ Doctrine команды

```bash
php bin/console doctrine:database:drop --force &&
php bin/console doctrine:database:create &&
php bin/console make:migration &&
php bin/console doctrine:migrations:migrate
```

## 🚀 Запуск проекта

```bash
# В корне проекта
docker-compose up --build       # Сборка и запуск
docker-compose up -d            # Запуск в фоновом режиме
```

---

## 📡 API Документация

### 🔐 1. Регистрация нового пользователя

**Request**
```bash
curl -X POST http://localhost:8000/api/user/register \
-H "Content-Type: application/json" \
-d '{
  "username": "user1",
  "address": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
  "password": "password123"
}'
```

**Response**
```json
{
  "authToken": "<JWT ТОКЕН>"
}
```

---

### 🔓 2. Авторизация пользователя

**Request**
```bash
curl -X POST http://localhost:8000/api/user/login \
-H "Content-Type: application/json" \
-d '{
  "address": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
  "password": "password123"
}'
```

**Response**
```json
{
  "authToken": "<JWT ТОКЕН>"
}
```

---

### 👤 3. Получение информации о пользователе

**Request**
```bash
curl -X GET http://localhost:8000/api/user/get \
-H "Authorization: Bearer <JWT ТОКЕН>"
```

**Response**
```json
{
  "id": 10,
  "address": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
  "username": "exampleuser"
}
```

---

## 💬 Работа с сообщениями

### 📥 1. Получение сообщений по адресу пользователя

**Request**
```bash
curl -X GET http://localhost:8001/api/message/get \
-H "Authorization: <JWT ТОКЕН>" \
-H "Content-Type: application/json" \
-d '{
  "ownerAddress": "0xaDC608b7932633e3a277a61BeA5e27464421788a"
}'
```

**Response**
```json
[
  {
    "CID": "QmXYZ...123",
    "ownerAddress": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    "timestamp": "2023-05-15T00:00:00+00:00"
  },
  {
    "CID": "QmXYZ...123",
    "ownerAddress": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    "timestamp": "2023-05-15T00:00:00+00:00"
  }
]
```

---

### 📝 2. Запись CID сообщения

**Request**
```bash
curl -X POST http://localhost:8001/api/message/add \
-H "Authorization: Bearer <JWT ТОКЕН>" \
-H "Content-Type: application/json" \
-d '{
  "CID": "QmXYZ...123",
  "timestamp": "2023-05-15T12:00:00Z"
}'
```

**Response**
```bash
HTTP OK
```

---
## 🔗 Блокчейн API

### 🌐 TRON

#### 📊 Получение баланса TRX

**Request**
```bash
curl -X GET http://localhost:8000/trx/balance/TXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

#### 💵 Получение баланса USDT (TRC-20)

**Request**
```bash
curl -X GET http://localhost:8000/trx/usdt/balance/TXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

#### 📃 Информация о контракте USDT

**Request**
```bash
curl -X GET http://localhost:8000/trx/usdt/info
```

---

#### 🧾 Получение всех балансов (TRX + USDT)

**Request**
```bash
curl -X GET http://localhost:8000/trx/balances/TXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

### 🌐 Ethereum

#### 📊 Получение баланса ETH

**Request**
```bash
curl -X GET http://localhost:8000/eth/balance/0xXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

#### 💰 Получение баланса токена ERC-20

**Request**
```bash
curl -X GET http://localhost:8000/eth/balance/token/0xTokenAddress/0xUserAddress
```

---

## 🧾 Примечания

- Адреса должны быть валидными (Ethereum — `0x...`, TRON — `T...`).
- Все запросы к `trx` и `eth` не требуют токена, если в контроллере не стоит защита `@UseGuards(AuthGuard)`. Если есть — добавляй:
```bash
-H "Authorization: Bearer <JWT ТОКЕН>"
```

## 🧾 Примечания

- Все запросы требуют корректного JWT токена в заголовке `Authorization`.
- Адреса пользователей — это Ethereum-совместимые адреса (начинаются с `0x`).
