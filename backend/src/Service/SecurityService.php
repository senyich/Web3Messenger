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
    public function generateToken(int $id, string $userName, string $address): string
    {
        $issuedAt   = time();
        $expire     = $issuedAt + 3600;
        $payload = [
            'iss' => 'your_issuer',       
            'sub' => $id, 
            'username' => $userName, 
            'address' => $address,
            'iat' => $issuedAt,            
            'exp' => $expire,               
            'role' => 'user'];
        $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        return $jwt;
    }
    public function parseToken(string $token) : GetUserDTO
    {
        if(!$this->isTokenValid($token))
            throw new BadRequestException(message: 'Токен невалиден');

        $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));

        $userId = $decoded->sub;
        $username = $decoded->username;
        $address = $decoded->address;

        $dto = new GetUserDTO();
        $dto->setId($userId);
        $dto->setUsername($username);
        $dto->setAddress($address);
        
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