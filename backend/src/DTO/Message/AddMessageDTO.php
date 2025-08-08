<?php

namespace App\DTO\Message;
use DateTime;
use Symfony\Component\Serializer\Annotation\Groups;
class AddMessageDTO
{
    #[Groups(['message:write'])]
    public string $CID;
    #[Groups(['message:write'])]
    public string $fromAddress;
    #[Groups(['message:write'])]
    public string $toAddress;
    #[Groups(['message:write'])]
    public DateTime $timestamp;
    

}