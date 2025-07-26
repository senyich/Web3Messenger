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
 -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5b3VyX2lzc3VlciIsInN1YiI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImFkZHJlc3MiOiIweDMyQmUzNDNCOTRmODYwMTI0ZEM0ZkVlMjc4RkRDQkQzOEMxMDJEODgiLCJpYXQiOjE3NTM1Mjc4NTIsImV4cCI6MTc1MzUzMTQ1Miwicm9sZSI6InVzZXIifQ.8-Wejfg8CPov5CkRbtNomFmce2YTXwlBylhQM4h8ACQ"
```
Responce
```json
{
   "id":10,
   "address":"0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
   "username":"exampleuser"
}
```
