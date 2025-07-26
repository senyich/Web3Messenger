<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }
    /**
    * @return User
    */
    public function findUserById($id): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.id = :val')
            ->setParameter('val', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
     /**
    * @return User
    */
    public function findUserByUsername($userName): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.userName = :val')
            ->setParameter('val', $userName)
            ->getQuery()
            ->getOneOrNullResult();
    }
     /**
    * @return User
    */
    public function findUserByAddress($address): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.address = :val')
            ->setParameter('val', $address)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
