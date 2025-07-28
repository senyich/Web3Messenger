<?php

namespace App\Controller;

use App\DTO\Message\AddMessageDTO;
use App\DTO\Message\GetMessageDTO;
use App\DTO\User\AddUserDTO;
use App\Entity\Message;
use App\Repository\MessageRepository;
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

#[Route('/api/message')]
final class IPFSMessagesController extends AbstractController
{
    private SerializerInterface $serializer;
    private EntityManagerInterface $entityManager;
    private MessageRepository $messageRepository;
    private SecurityService $securityService;
    private UserService $userService;
    public function __construct(
        EntityManagerInterface $entityManager,
        SecurityService $securityService,
        UserService $userService,
        SerializerInterface $serializer
    )
    {
        $this->serializer = $serializer;
        $this->securityService = $securityService;
        $this->userService = $userService;
        $this->entityManager = $entityManager;
        $this->messageRepository = $entityManager->getRepository(Message::class);
    }
    #[Route('/get', name: 'get_messages', methods: ['GET', 'OPTIONS'])]
    public function get(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Токен не предоставлен'], 401);
        }
        $token = $matches[1];
        try{
            $userData = $this->securityService->parseToken($token);            
            $messages = $this->messageRepository->findMessagesByOwnerAddress($userData->getAddress());
            $retMessages = array_map(function (Message $message): GetMessageDTO {
                $dto = new GetMessageDTO();
                $dto->CID = $message->getCID();
                $dto->ownerAddress = $message->getSenderAddress(); 
                $dto->timestamp = $message->getTimestamp();
                return $dto;
            }, $messages);
            $jsonContent = $this->serializer->serialize($retMessages, 'json', ['groups' => ['message:read']]);
            return JsonResponse::fromJsonString($jsonContent);
        }
        catch(Exception $ex){
            return new JsonResponse(["error"=>$ex->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
    #[Route('/add', name: 'add_message', methods: ['POST', 'OPTIONS'])]
    public function add(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Токен не предоставлен'], 401);
        }
        $token = $matches[1];
        $addMessageDTO = null;
        try{
            $userData = $this->securityService->parseToken($token);
            $addMessageDTO = $this->serializer->deserialize(
                $request->getContent(),
                AddMessageDTO::class,
                'json',
                ['groups' => ['message:write']]
            );
            } catch (Exception $e) {
                return new JsonResponse([
                    'error' => 'Ошибка десериализации, переданы некорректные данные',
                ], JsonResponse::HTTP_BAD_REQUEST);
            }    
        $message = new Message();
        $message->setCID($addMessageDTO->CID);
        $message->setTimestamp($addMessageDTO->timestamp);
        $message->setSenderAddress($userData->getAddress());
        $this->entityManager->persist($message);
        $this->entityManager->flush();
        return new JsonResponse();
    }
}

