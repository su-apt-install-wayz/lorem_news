<?php

namespace App\EntityListener;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Bundle\SecurityBundle\Security;

#[AsEntityListener(event: Events::prePersist, entity: Comment::class)]
class CommentEntityListener
{
    public function __construct(private Security $security)
    {
        
    }

    public function prePersist(Comment $comment, LifecycleEventArgs $event): void
    {
        $comment->setUser($this->security->getUser());
    }
}