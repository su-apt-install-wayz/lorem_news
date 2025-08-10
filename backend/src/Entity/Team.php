<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TeamRepository;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Dto\TeamInput;
use App\State\TeamCreateProcessor;
use App\State\TeamUpdateProcessor;
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
        new Post(input: TeamInput::class, processor: TeamCreateProcessor::class, normalizationContext: ['groups' => ['team:read']], denormalizationContext: ['groups' => ['team:write']], security: "is_granted('ROLE_LEADER') or is_granted('ROLE_ADMIN')"),
        new Patch(input: TeamInput::class, processor: TeamUpdateProcessor::class, normalizationContext: ['groups' => ['team:read']], denormalizationContext: ['groups' => ['team:write']], security: "((object.getLeader() == user) and is_granted('ROLE_LEADER')) or is_granted('ROLE_ADMIN')"),
        new Delete(security: "((object.getLeader() == user) and is_granted('ROLE_LEADER')) or is_granted('ROLE_ADMIN')")
    ]
)]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['team:list', 'team:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['team:list', 'team:read', 'team:write'])]
    private ?string $name = null;

    #[ORM\OneToOne(cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['team:list', 'team:read'])]
    private ?User $leader = null;

    /**
     * @var Collection<int, TeamMembers>
     */
    #[ORM\OneToMany(targetEntity: TeamMembers::class, mappedBy: 'team', cascade: ['persist','remove'], orphanRemoval: true)]
    #[Groups(['team:list', 'team:read'])]
    private Collection $members;

    public function __construct()
    {
        $this->members = new ArrayCollection();
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
    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function addMember(TeamMembers $member): static
    {
        if (!$this->members->contains($member)) {
            $this->members->add($member);
            $member->setTeam($this);
        }

        return $this;
    }

    public function removeMember(TeamMembers $member): static
    {
        if ($this->members->removeElement($member)) {
            // set the owning side to null (unless already changed)
            if ($member->getTeam() === $this) {
                $member->setTeam(null);
            }
        }

        return $this;
    }
}
