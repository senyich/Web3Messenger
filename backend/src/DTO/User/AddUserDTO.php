<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;
class AddUserDTO
{
    #[Groups(['user:write'])]
    public string $userName;
    #[Groups(['user:write'])]
    public string $email;
    #[Groups(['user:write'])]
    public string $password;

}