<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TeamRepository;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['team:read']]),
        new GetCollection(normalizationContext: ['groups' => ['team:list']]),
        new Post(normalizationContext: ['groups' => ['team:read']], denormalizationContext: ['groups' => ['team:write']], security: "is_granted('ROLE_LEADER') or is granted('ROLE_ADMIN')"),
        new Patch(normalizationContext: ['groups' => ['team:read']], denormalizationContext: ['groups' => ['team:write']], security: "((object.getLeader() == user) and is_granted('ROLE_LEADER')) or is_granted('ROLE_ADMIN')"),
        new Delete(security: "((object.getLeader() == user) and is_granted('ROLE_LEADER')) or is_granted('ROLE_ADMIN')")
    ]
)]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['team:list', 'team:read', 'team:write'])]
    private ?string $name = null;

    #[ORM\OneToOne(inversedBy: 'team', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['team:list', 'team:read'])]
    private ?User $leader = null;

    #[ORM\OneToMany(mappedBy: 'team', targetEntity: TeamMembers::class, orphanRemoval: true)]
    private Collection $teamMembers;

    public function __construct()
    {
        $this->teamMembers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLeader(): ?User
    {
        return $this->leader;
    }

    public function setLeader(User $leader): static
    {
        $this->leader = $leader;

        return $this;
    }

    /**
     * @return Collection<int, TeamMembers>
     */
    public function getTeamMembers(): Collection
    {
        return $this->teamMembers;
    }

    public function addTeamMember(TeamMembers $teamMember): static
    {
        if (!$this->teamMembers->contains($teamMember)) {
            $this->teamMembers->add($teamMember);
            $teamMember->setTeam($this);
        }

        return $this;
    }

    public function removeTeamMember(TeamMembers $teamMember): static
    {
        if ($this->teamMembers->removeElement($teamMember)) {
            // set the owning side to null (unless already changed)
            if ($teamMember->getTeam() === $this) {
                $teamMember->setTeam(null);
            }
        }

        return $this;
    }
}
