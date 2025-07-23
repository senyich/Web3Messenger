<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\GoogleOAuthService;
use App\Service\SecurityService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class GoogleOAuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private SecurityService $securityService;
    public function __construct(EntityManagerInterface $entityManager, SecurityService $securityService) 
    {
        $this->securityService = $securityService;
        $this->entityManager = $entityManager;
        $this->userRepository = $this->entityManager->getRepository(User::class);
    }

    #[Route('/connect/google', name: 'connect_google')]
    public function connectGoogle(ClientRegistry $clientRegistry): RedirectResponse
    {
         return $clientRegistry
            ->getClient('google')
            ->redirect([
                'email',  
                'profile' 
            ]);
    }
    #[Route('/connect/google/check', name: 'connect_google_check')]
    public function connectGoogleCheck(Request $request, ClientRegistry $clientRegistry)
    {
        try {
            $client = $clientRegistry->getClient('google');
            $googleUser = $client->fetchUser();
            
            $googleData = $googleUser->toArray();
            
            if (empty($googleData['email'])) {
                throw new BadRequestException('Google не предоставил email');
            }
            
            $email = $googleData['email'];
            $username = $googleData['name'] ?? explode('@', $email)[0];
            $googleId = $googleData['sub']; 
            
            $user = $this->userRepository->findOneBy(['email' => $email]);
            
            if (!$user) {
                $user = new User();
                $user->setEmail($email);
                $user->setUserName($username);
                $user->setGoogleId($googleId); 
                $user->setPasswordHash(null);
                
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            } else {
                $user->setGoogleId($googleId);
                $this->entityManager->flush();
            }
            
            $token = $this->securityService->generateToken(
                $user->getId(),
                $user->getUserName(),
                $user->getEmail());
            $response = $this->redirectToRoute('/');
            $response->headers->setCookie(
                new Cookie(
                    'AUTH_TOKEN',
                    $token,    
                    time() + 3600 * 24 * 7, 
                    '/',
                    null,         
                    false,         
                    true,    
                    false,      
                    'lax'       
                )
            );
            return $response;
    
        } catch (IdentityProviderException $e) {
            $this->addFlash('error', 'Ошибка аутентификации через Google: ' . $e->getMessage());
            return $this->redirectToRoute('app_login');
        }
        
        return $this->redirectToRoute('app_home');
    }
}