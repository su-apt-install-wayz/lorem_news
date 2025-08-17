<?php

namespace App\EntityListener;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsEntityListener(event: Events::prePersist, entity: User::class)]
#[AsEntityListener(event: Events::preUpdate, entity: User::class)]
class UserEntityListener
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher) {}

    private array $defaultPictures = [
        'Ander.png',
        'Bento.png',
        'Bill.png',
        'Oiseau.png',
        'Birb.png',
        'Blip.png',
        'Boomer.png',
        'Camie.png',
        'Cap.png',
        'Cat.png',
    ];

    public function prePersist(User $user, LifecycleEventArgs $event): void
    {
        $this->hashPassword($user);

        if (empty($user->getPicture())) {
            $filename = $this->defaultPictures[array_rand($this->defaultPictures)];
            $user->setPicture($filename);
        }
    }

    public function preUpdate(User $user, PreUpdateEventArgs $event): void
    {
        if (!$event->hasChangedField('password')) {
            return;
        }

        $newPassword = $event->getNewValue('password');

        if (empty($newPassword)) {
            return;
        }

        $hashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($hashedPassword);
    }

    private function hashPassword(User $user): void
    {
        if (!empty($user->getPassword())) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $user->getPassword()));
        }
    }
}
