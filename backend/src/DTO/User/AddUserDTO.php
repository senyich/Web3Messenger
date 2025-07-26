<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;
class AddUserDTO
{
    #[Groups(['user:write'])]
    public string $username;
    #[Groups(['user:write'])]
    public string $address;
    #[Groups(['user:write'])]
    public string $password;

}