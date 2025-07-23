<?php

namespace App\Service;

use App\DTO\User\AddUserDTO;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class GoogleOAuthService
{
    private ClientRegistry $clientRegistry;
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;


    public function __construct(
        EntityManagerInterface $entityManager,
        SecurityService $securityService,
        UserService $userService
    ) {
        $this->entityManager = $entityManager;
        $this->securityService = $securityService;
        $this->userService = $userService;
        $this->userRepository = $entityManager->getRepository(User::class);
    }

    public function handleGoogleUser(GoogleUser $googleUser): string
    {
        $email = $googleUser->getEmail();
        
        $user = $this->userRepository->findUserByEmail($email);

        if (!$user) {
            $dto = new AddUserDTO();
            $dto->username = $googleUser->getName() ?? $googleUser->getEmail();
            $dto->email = $email;
            $dto->password = bin2hex(random_bytes(16)); 
            
            $token = $this->userService->registerUser($dto);
        } else {
            $token = $this->securityService->generateToken(
                $user->getId(),
                $user->getUserName(),
                $user->getEmail()
            );
        }
        return $token;
    }
}