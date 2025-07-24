<?php

namespace App\Controller;

use App\Service\TonService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/wallet')]
final class TonWalletController extends AbstractController
{
    private TonService $tonService;
    
    public function __construct(TonService $tonService) {
        $this->tonService = $tonService;
    }
    
    #[Route('/balance', name: 'get_balance', methods: ['GET'])]
    public function getBalance(Request $request): JsonResponse
    {
        $address = $request->getContent();
        
        if (empty($address)) {
            return new JsonResponse(
                ['error' => 'Wallet address is required'], 
                JsonResponse::HTTP_BAD_REQUEST
            );
        }
        
        try {
            $balance = $this->tonService->getWalletBalance($address);
            return new JsonResponse(['balance' => (string)$balance]);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' =>  $e->getMessage()], 
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}