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
    "username": "exampleuser",
    "email": "user@example.com",
    "password": "secretpassword"
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
    "username": "exampleuser",
    "password": "secretpassword"
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
 -H "Authorization: Bearer <ВАШ_ТОКЕН>"
```
Responce
```json
{
   "id":10,
   "email":"user@example.com",
   "username":"exampleuser"
}
```