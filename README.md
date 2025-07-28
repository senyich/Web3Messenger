Команды для Doctrine
```bash
php bin/console doctrine:database:drop --force &&
php bin/console doctrine:database:create &&
php bin/console make:migration &&
php bin/console doctrine:migrations:migrate
```
Запуск проекта:
```bash
#в корне проекта
docker-compose up --build
docker-compose up -d 
```

API docs:

1) Регистрация нового пользователя
Request
```bash
curl -X POST http://localhost:8000/api/user/register \
-H "Content-Type: application/json" \
-d '{
  "username": "user1",
  "address": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
  "password": "password123"
}'

```
Responce
```json
{
   "authToken":"<JWT ТОКЕН>"
}
```
2) Авторизация пользователя
Request
```bash
curl -X POST http://localhost:8000/api/user/login \
-H "Content-Type: application/json" \
-d '{
  "address": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
  "password": "password123"
}'
```
Responce
```json
{
   "authToken":"<JWT ТОКЕН>"
}
```
3) Получение информации из токена
Request
```bash
curl -X GET http://localhost:8000/api/user/get \
 -H "Authorization: Bearer TOKEN HERE"
```
Responce
```json
{
   "id":10,
   "address":"0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
   "username":"exampleuser"
}
```

Request
```bash
curl -X GET \
  http://localhost:8001/api/message/get \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "ownerAddress": "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"
  }'

```
Responce
```json
[
   {
      "CID":"QmXYZ...123",
      "ownerAddress":"0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
      "timestamp":"2023-05-15T00:00:00+00:00"
   },
   {
      "CID":"QmXYZ...123",
      "ownerAddress":"0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
      "timestamp":"2023-05-15T00:00:00+00:00"
   },
]
```
Request
```bash
curl -X POST \
  http://localhost:8001/api/message/add \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "CID": "QmXYZ...123",
    "timestamp": "2023-05-15T12:00:00Z"
  }'
```
Responce
```bash
HTTP OK
```