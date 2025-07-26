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
        if (empty($dto->username)  || empty($dto->address) || empty($dto->password)) 
            throw new BadRequestException('Отсутствует логин или адрес');
        if($this->userRepository->findUserByUsername($dto->username) 
            || $this->userRepository->findUserByAddress($dto->address))
            throw new BadRequestException('Пользователь уже существует, перейдите на страницу авторизации');
        $passwordHash = password_hash($dto->password, PASSWORD_DEFAULT);
        $user = new User;
        $user->setUserName($dto->username);
        $user->setAddress($dto->address);
        $user->setPasswordHash($passwordHash);
        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
            $token = $this
                ->securityService
                ->generateToken(
                    $user->getId(), 
                    $user->getUserName(), 
                    $user->getAddress());
            return $token;
        } catch (\Exception $e) {
            throw new \RuntimeException('Ошибка регистрации пользователя'.$e->getMessage());
        }
    }
    public function loginUser(LoginUserDTO $dto): string
    {
        if (empty($dto->address) || empty($dto->password)) {
            throw new BadRequestException('Отсутствует пароль или идентификатор блокчейна');
        }
        $user = $this->userRepository->findUserByAddress($dto->address);
        if(!$user)
            throw new BadRequestException('Пользователь не зарегистрирован');
        $passwordHash = $user->getPasswordHash();
        if (!password_verify($dto->password, $passwordHash))
             throw new BadRequestException('Неверный пароль');
        $token = $this->securityService->generateToken(
            $user->getId(),
            $user->getUserName(),
            $user->getAddress());
        return $token;
    }
}