<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use App\Repository\TeamMembersRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TeamMembersRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['team_members:read']]),
        new GetCollection(normalizationContext: ['groups' => ['team_members:list']]),
        new Post(normalizationContext: ['groups' => ['team_members:read']], denormalizationContext: ['groups' => ['team_members:write']], security: "is_granted('ROLE_LEADER')"),
        new Patch(normalizationContext: ['groups' => ['team_members:read']], denormalizationContext: ['groups' => ['team_members:write']], security: "(object.getLeader() == user) and is_granted('ROLE_LEADER')"),
        new Delete(security: "((object.getLeader() == user) and is_granted('ROLE_LEADER')) or is_granted('ROLE_ADMIN')")
    ]
)]
class TeamMembers
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'teamMembers')]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Team $team = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(?Team $team): static
    {
        $this->team = $team;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
