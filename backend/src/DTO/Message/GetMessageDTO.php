<?php

namespace App\DTO\Message;
use DateTime;
use Symfony\Component\Serializer\Annotation\Groups;
class GetMessageDTO
{
    #[Groups(['message:read'])]
    public string $CID;
    #[Groups(['message:read'])]
    public string $fromAddress;
     #[Groups(['message:read'])]
    public string $toAddress;
    #[Groups(['message:read'])]
    public DateTime $timestamp;
}