<?php

namespace App\EntityListener;

use App\Entity\Team;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsEntityListener(event: Events::prePersist, entity: Team::class)]
class TeamEntityListener
{
    public function __construct(private SluggerInterface $slugger, private Security $security)
    {
        
    }

    public function prePersist(Team $team, LifecycleEventArgs $event): void
    {
        $team->setLeader($this->security->getUser());
    }
}
