<?php

namespace App\Controller;

use App\DTO\User\LoginUserDTO;
use App\Entity\User;
use App\Repository\UserRepository;
use App\DTO\User\AddUserDTO;
use App\DTO\User\GetUserDTO;
use App\Service\SecurityService;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user')]
final class UserController extends AbstractController
{
    private UserService $userService;
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private SerializerInterface $serializer;
    private SecurityService $securityService;
    public function __construct(
        SecurityService $securityService,
        UserService $userService,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer)
    {
        $this->securityService = $securityService;
        $this->userService = $userService;
        $this->serializer = $serializer; 
        $this->entityManager = $entityManager;
        $this->userRepository = $entityManager->getRepository(User::class);
    }
    #[Route('/register', name: 'user_add', methods: ['POST', 'OPTIONS'])]
    public function register(Request $request): JsonResponse
    {
        $addUserDTO = null;
        try {
            $addUserDTO = $this->serializer->deserialize(
                $request->getContent(),
                AddUserDTO::class,
                'json', 
                ['groups' => ['user:write']]
            );

        } catch (Exception $e) {
            return new JsonResponse([
                'error' => 'Ошибка десериализации, переданы некорректные данные',
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_BAD_REQUEST);
        }     
        try{
            $token = $this->userService->registerUser($addUserDTO);
            return new JsonResponse(["authToken"=>$token], JsonResponse::HTTP_CREATED);
        } catch(BadRequestException $ex){
            return new JsonResponse(["error"=>$ex->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
    #[Route('/login', name: 'user_auth', methods: ['POST', 'OPTIONS'])]
    public function login(Request $request): JsonResponse
    {
        $loginUserDTO = null;
        try {
            $loginUserDTO = $this->serializer->deserialize(
                $request->getContent(),
                LoginUserDTO::class,
                'json',
                ['groups' => ['user:write']]
            );
        } catch (Exception $e) {
            return new JsonResponse([
                'error' => 'Ошибка десериализации, переданы некорректные данные',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }     
        try{
            $token = $this->userService->loginUser(dto: $loginUserDTO);
            return new JsonResponse(["authToken"=>$token], JsonResponse::HTTP_CREATED);
        } catch(BadRequestException $ex){
            return new JsonResponse(["error"=>$ex->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
    #[Route('/get', name: 'user_get', methods: ['GET', 'OPTIONS'])]
    public function getByToken(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Токен не предоставлен'], 401);
        }
        $token = $matches[1];
        try{
            $userData = $this->securityService->parseToken($token);
            $jsonContent = $this->serializer->serialize($userData, 'json', ['groups' => ['user:read']]);
            return JsonResponse::fromJsonString($jsonContent);
        } catch(BadRequestException $ex){
            return new JsonResponse(["error"=>$ex->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
        
    }
    #[Route('/validate', name: 'user_validate', methods: ['GET', 'OPTIONS'])]
    public function validateUser(Request $request) : JsonResponse 
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Токен не предоставлен'], 401);
        }
        $token = $matches[1];
        try{
            $isValid = $this->securityService->isTokenValid($token);
            if($isValid)
                return new JsonResponse();
            else
                return new JsonResponse(["error"=>"Токен невалиден"], JsonResponse::HTTP_BAD_REQUEST);
        }
        catch(Exception $ex){
            return new JsonResponse(["error"=>$ex->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}
