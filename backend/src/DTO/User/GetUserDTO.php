<?php

namespace App\DTO\User;
use Symfony\Component\Serializer\Annotation\Groups;
class GetUserDTO
{
    #[Groups(['user:read'])]    
    private int $id;
    #[Groups(['user:read'])]
    private string $address;
    #[Groups(['user:read'])]
    
    private string $username;
    
    public function getId() : int {return $this->id;}
    public function getAddress() : string {return $this->address;}
    public function getUserName() : string {return $this->username;}
    public function setId(int $id) : void {$this->id = $id;}
    public function setUsername(string $username) : void {$this->username = $username;}
    public function setAddress(string $address) : void {$this->address = $address;}
}