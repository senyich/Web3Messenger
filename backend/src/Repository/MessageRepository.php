<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

       /**
        * @return Message[] Returns an array of Message objects
        */
        public function findMessagesByOwnerAddress(string $senderAddress): array
       {
           return $this->createQueryBuilder('m')
               ->andWhere('m.senderAddress = :val')
               ->setParameter('val', $senderAddress)
               ->getQuery()
               ->getResult()
           ;
       }

       public function findMessageByCID(string $cid): ?Message
       {
           return $this->createQueryBuilder('m')
               ->andWhere('m.CID = :val')
               ->setParameter('val', $cid)
               ->getQuery()
               ->getOneOrNullResult()
           ;
       }
}
