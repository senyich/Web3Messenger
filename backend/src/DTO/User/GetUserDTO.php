<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;
class GetUserDTO
{
    #[Groups(['user:read'])]    
    private int $id;
    #[Groups(['user:read'])]
    private string $email;
    #[Groups(['user:read'])]
    
    private string $userName;
    
    public function getId() : int {return $this->id;}
    public function getEmail() : string {return $this->email;}
    public function getUserName() : string {return $this->userName;}
    public function setId(int $id) : void {$this->id = $id;}
    public function setUsername(string $userName) : void {$this->userName = $userName;}
    public function setEmail(string $email) : void {$this->email = $email;}

}