<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\DTO\User\AddUserDTO;
use App\DTO\User\GetUserDTO;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
final class UserController extends AbstractController
{
    private UserService $userService;
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private SerializerInterface $serializer;
    public function __construct(
        UserService $userService,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer)
    {
        $this->userService = $userService;
        $this->serializer = $serializer; 
        $this->entityManager = $entityManager;
        $this->userRepository = $entityManager->getRepository(User::class);
    }
    #[Route('/api/addUser', name: 'user_add', methods: ['POST'])]
    public function addUser(Request $request): JsonResponse
    {
        $addUserDTO = null;
        try {
            $addUserDTO = $this->serializer->deserialize(
                $request->getContent(),
                AddUserDTO::class,
                'json',
                ['groups' => ['user:write']]
            );
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Ошибка десериализации, переданы некорректные данные',
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_BAD_REQUEST);
        }     
        try{
            $token = $this->userService->registerUser(dto: $addUserDTO);
            return new JsonResponse(["authToken"=>$token], JsonResponse::HTTP_CREATED);
        } catch(BadRequestException $ex){
            return new JsonResponse(["error"=>$ex->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
    #[Route('/api/getUser/{id}', name: 'user_get', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        $user = $this->userRepository->findUserById($id);
        if(!$user)
            return new JsonResponse(["error"=>"Ошибка получения пользователя"], JsonResponse::HTTP_BAD_REQUEST);

        $userDto = new GetUserDTO();
        $userDto->setId($user->getId());
        $userDto->setUsername($user->getUserName());
        $userDto->setEmail($user->getEmail());
        $jsonContent = $this->serializer->serialize($userDto, 'json', ['groups' => ['user:read']]);
        return JsonResponse::fromJsonString($jsonContent);
    }
}
