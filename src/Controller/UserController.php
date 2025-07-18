<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\DTO\User\AddUserDTO;
use App\DTO\User\GetUserDTO;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
final class UserController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private SerializerInterface $serializer;
    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer)
    {
        $this->serializer = $serializer; 
        $this->entityManager = $entityManager;
        $this->userRepository = $entityManager->getRepository(User::class);
    }
    #[Route('/api/addUser', name: 'user_add', methods: ['POST'])]
    public function addUser(Request $request): JsonResponse
    {
        $addUserDTO = $this->serializer->deserialize(
            $request->getContent(),
            AddUserDTO::class,
            'json',
            ['groups' => ['user:write']]
        );
        if (empty($addUserDTO->userName) || empty($addUserDTO->password)) {
            return new JsonResponse(['error' => 'Отсутствует пароль или логин'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setUserName($addUserDTO->userName);
        $user->setPasswordHash($addUserDTO->password);
        $user->setEmail($addUserDTO->email);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(["id"=>$user->getId()], JsonResponse::HTTP_CREATED);
    }
    #[Route('/api/getUser/{id}', name: 'user_get', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        $user = $this->userRepository->findUserById($id);
        if(!$user)
            return new JsonResponse(["error"=>"Ошибка получения пользователя"], JsonResponse::HTTP_BAD_REQUEST);

        $userDto = new GetUserDTO();
        $userDto->id = $user->getId();
        $userDto->userName = $user->getUserName();
        $userDto->userName = $user->getEmail();
        $jsonContent = $this->serializer->serialize($userDto, 'json', ['groups' => ['user:read']]);
        return JsonResponse::fromJsonString($jsonContent);
    }
}
