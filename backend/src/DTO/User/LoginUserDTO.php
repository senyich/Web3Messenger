<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;

class LoginUserDTO
{
    #[Groups(['user:write'])]
    public string $address;
    #[Groups(['user:write'])]
    public string $password;

    public function getAddress() : string {return $this->address;}
    public function getPassword() : string {return $this->password;}
}