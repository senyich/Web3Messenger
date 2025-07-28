<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 350)]
    private ?string $CID = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $timestamp = null;

    #[ORM\Column(length: 255)]
    private ?string $senderAddress = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCID(): ?string
    {
        return $this->CID;
    }

    public function setCID(string $CID): static
    {
        $this->CID = $CID;

        return $this;
    }

    public function getTimestamp(): ?\DateTime
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTime $timestamp): static
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getSenderAddress(): ?string
    {
        return $this->senderAddress;
    }

    public function setSenderAddress(string $senderAddress): static
    {
        $this->senderAddress = $senderAddress;

        return $this;
    }
}
