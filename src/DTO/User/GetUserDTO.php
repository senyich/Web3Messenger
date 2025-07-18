<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;
class GetUserDTO
{
    #[Groups(['user:read'])]    
    public int $id;
    #[Groups(['user:read'])]
    public string $email;
    #[Groups(['user:read'])]
    
    public string $userName;
}