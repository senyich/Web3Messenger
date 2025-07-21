<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;

class LoginUserDTO
{
    #[Groups(['user:write'])]
    public string $userName;
    #[Groups(['user:write'])]
    public string $password;
}