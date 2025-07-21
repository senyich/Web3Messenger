<?php

namespace App\Service;

use App\DTO\User\AddUserDTO;
use App\DTO\User\LoginUserDTO;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class UserService
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private SecurityService $securityService;
    public function __construct(
        EntityManagerInterface $entityManager,
        SecurityService $securityService)
    {
        $this->entityManager = $entityManager;
        $this->securityService = $securityService;
        $this->userRepository = $entityManager->getRepository(User::class);
    }
    public function registerUser(AddUserDTO $dto): string
    {
        if (empty($dto->username) || empty($dto->password)) {
            throw new BadRequestException('Отсутствует пароль или логин');
        }
        $passwordHash = password_hash($dto->password, PASSWORD_DEFAULT);

        $user = new User;
        $user->setUserName($dto->username);
        $user->setPasswordHash($passwordHash);
        $user->setEmail($dto->email);
        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $token = $this
                ->securityService
                ->generateToken(
                    $user->getId(), 
                    $user->getUserName(), 
                    $user->getEmail());
            return $token;
        } catch (\Exception $e) {
            throw new \RuntimeException('Ошибка регистрации пользователя');
        }
    }
    public function loginUser(LoginUserDTO $dto): string
    {
        if (empty($dto->username) || empty($dto->password)) {
            throw new BadRequestException('Отсутствует пароль или логин');
        }
        $user = $this->userRepository->findUserByUsername($dto->username);
        if(!$user)
            throw new BadRequestException('Пользователя с таким именем не существует');
        $passwordHash = $user->getPasswordHash();
        if (!password_verify($dto->password, $passwordHash))
             throw new BadRequestException('Пароли не совпадают');
        $token = $this->securityService->generateToken(
            $user->getId(),
            $user->getUserName(),
            $user->getEmail());
        return $token;
    }
}