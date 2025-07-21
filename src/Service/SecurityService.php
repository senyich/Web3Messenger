<?php

namespace App\Service;
use App\DTO\User\GetUserDTO;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
class SecurityService
{
    private string $secretKey;
    public function __construct(string $secretKey)
    {
        $this->secretKey = $secretKey;
    }
    public function generateToken(int $id, string $userName, string $email): string
    {
        $issuedAt   = time();
        $expire     = $issuedAt + 3600;
        $payload = [
            'iss' => 'your_issuer',       
            'sub' => $id, 
            'username' => $userName, 
            'email' => $email,
            'iat' => $issuedAt,            
            'exp' => $expire,               
            'role' => 'user'];
        $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        return $jwt;
    }
    public function parseToken(string $token) : GetUserDTO
    {
        if(!$this->isTokenValid($token))
            throw new BadRequestException('Токен невалиден');

        $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));

        $userId = $decoded->sub;
        $userName = $decoded->userName;
        $email = $decoded->email;

        $dto = new GetUserDTO();
        $dto->setId($userId);
        $dto->setUsername($userName);
        $dto->setEmail($email);
        
        return $dto;
    }
    public function isTokenValid(string $token) :bool
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return true; 
        } catch (ExpiredException $e) {
            return false;
        } catch (SignatureInvalidException $e) {
            return false;
        } catch (BeforeValidException $e) {
            return false;
        } catch (\Exception $e) {
            return false;
        }        
    }
    
}