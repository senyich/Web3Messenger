<?php

namespace App\Service;

use App\DTO\User\AddUserDTO;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class UserService
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    public function __construct(
        EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $entityManager->getRepository(User::class);
    }
    public function registerUser(AddUserDTO $dto): int
    {
        if (empty($dto->userName) || empty($dto->password)) {
            throw new BadRequestException('Отсутствует пароль или логин');
        }
        $passwordHash = password_hash($dto->password);
        $user = new User;
        $user->setUserName($dto->userName);
        $user->setPasswordHash($passwordHash);
        $user->setEmail($dto->email);

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
            return $user->getId();
        } catch (\Exception $e) {
            throw new \RuntimeException('Ошибка регистрации пользователя');
        }
    }
}