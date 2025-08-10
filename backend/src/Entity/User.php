<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Filter\UserSearchQueryFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'This email is already in use.', errorPath: 'email', groups: ['user:write'])]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['user:read']]),
        new GetCollection(normalizationContext: ['groups' => ['user:list']]),
        new Post(normalizationContext: ['groups' => ['user:read']], denormalizationContext: ['groups' => ['user:write']], validationContext: ['groups' => ['user:write']]),
        new Patch(normalizationContext: ['groups' => ['user:read']], denormalizationContext: ['groups' => ['user:patch']], validationContext: ['groups' => ['user:write']], security: "(object == user) or is_granted('ROLE_ADMIN')"),
        new Delete(security: "(object == user) or is_granted('ROLE_ADMIN')")
    ]
)]
#[ApiFilter(UserSearchQueryFilter::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:list', 'user:read', 'comment:list', 'comment:read', 'team:list', 'team:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['article:list', 'article:read', 'user:list', 'user:read', 'user:write', 'user:patch', 'comment:list', 'comment:read', 'team:list', 'team:read'])]
    private ?string $username = null;

    #[ORM\Column(length: 100, unique: true)]
    #[Groups(['user:list', 'user:read', 'user:write', 'user:patch', 'team:list', 'team:read'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:list', 'user:read', 'user:patch'])]
    #[Assert\All([
        new Assert\Choice(
            choices: ['ROLE_ADMIN', 'ROLE_LEADER', 'ROLE_MEMBER'],
            message: 'Invalid role "{{ value }}".',
        )
    ])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['user:write', 'user:patch',])]
    private ?string $password = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['article:list', 'article:read', 'user:list', 'user:read', 'user:write', 'user:patch', 'comment:list', 'comment:read', 'team:list', 'team:read'])]
    private ?string $picture = null;

    // changer ça si on peut supprimer un user avec des articles
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Article::class)]
    private Collection $articles;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Comment::class, orphanRemoval: true)]
    private Collection $comments;

    public function __construct()
    {
        $this->articles = new ArrayCollection();
        $this->comments = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    #[ORM\PrePersist]
    public function setRolesValue(): void
    {
        $this->roles[] = 'ROLE_USER';
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Article $article): static
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setUser($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): static
    {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getUser() === $this) {
                $article->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }
}
