<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;

class LoginUserDTO
{
    #[Groups(['user:write'])]
    public string $email;
    #[Groups(['user:write'])]
    public string $password;

    public function getEmail() : string {return $this->email;}
    public function getPassword() : string {return $this->password;}
}