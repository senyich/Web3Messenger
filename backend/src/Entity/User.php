<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    private ?string $userName = null;
    #[ORM\Column(length: 50, unique: true)]
    private ?string $address = null;
    #[ORM\Column(length: 350)]
    private ?string $passwordHash = null;
    public function getId(): ?int {return $this->id;}
    public function getUserName(): ?string {return $this->userName;}
    public function getPasswordHash(): ?string {return $this->passwordHash;}
    public function getAddress(): ?string {return $this->address;}
    public function setUserName(string $userName): static
    {
        $this->userName = $userName;
        return $this;
    }
    public function setPasswordHash(string $passwordHash): static
    {
        $this->passwordHash = $passwordHash;
        return $this;
    }
    public function setAddress(string $address): static
    {
        $this->address = $address;
        return $this;
    }
}
