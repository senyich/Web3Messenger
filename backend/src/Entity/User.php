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

    #[ORM\Column(length: 255)]
    private ?string $passwordHash = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;
    #[ORM\Column(length: 255, nullable: true, unique: true)]
    private ?string $googleId = null; 

    public function getId(): ?int {return $this->id;}
    public function getUserName(): ?string {return $this->userName;}
    public function getEmail(): ?string {return $this->email;}
    public function getPasswordHash(): ?string {return $this->passwordHash;}
    public function getGoogleId(): ?string {return $this->googleId;}
    public function setGoogleId(string $googleId): static
    {
        $this->googleId = $googleId;
    }
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
    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }
}
