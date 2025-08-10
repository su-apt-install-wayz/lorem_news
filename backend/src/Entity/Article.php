<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Filter\ArticleSearchQueryFilter;
use App\Filter\ArticleSearchSluggerFilter;
use App\Repository\ArticleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\String\Slugger\SluggerInterface;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[UniqueEntity('slug')]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['article:read']], security: "is_granted('PUBLIC_ACCESS')"),
        new Get(uriTemplate: '/articles/slug/{slug}', uriVariables: ['slug' => new Link(fromClass: Article::class, identifiers: ['slug'])], normalizationContext: ['groups' => ['article:read']], security: "is_granted('PUBLIC_ACCESS')"),
        new GetCollection(normalizationContext: ['groups' => ['article:list']]),
        new Post(normalizationContext: ['groups' => ['article:read']], denormalizationContext: ['groups' => ['article:write']]),
        new Patch(normalizationContext: ['groups' => ['article:read']], denormalizationContext: ['groups' => ['article:write']], security: "(object.getUser() == user) or is_granted('ROLE_LEADER')"),
        new Delete(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_LEADER')")
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'partial', 'category' => 'exact'])]
#[ApiFilter(ArticleSearchQueryFilter::class)]
#[ApiFilter(ArticleSearchSluggerFilter::class)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:list', 'article:read', 'comment:list', 'comment:read', 'comment:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?string $title = null;

    #[ORM\Column(length: 100)]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?string $content = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['article:list', 'article:read'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?string $image = null;

    #[ORM\Column]
    #[Groups(['article:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:read'])]
    #[ApiProperty(readable: true)]
    private ?\DateTimeImmutable $edited_at = null;

    #[ORM\Column]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    #[ApiProperty(readable: true, writable: true)]
    private ?\DateTimeImmutable $published_at = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:list', 'article:read'])]
    private ?User $user = null;

    #[ORM\Column(length: 1, options: ["default" => "0"])]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?string $status = "0";

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?Category $category = null;

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: Comment::class, orphanRemoval: true)]
    private Collection $comments;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:list', 'article:read', 'article:write'])]
    private ?array $tags = null;


    public function __construct()
    {
        $this->comments = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedValue(): void
    {
        $this->created_at = new \DateTimeImmutable();
    }

    public function computeSlug(SluggerInterface $slugger): void
    {
        $this->slug = $slugger->slug($this)->lower();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getEditedAt(): ?\DateTimeImmutable
    {
        return $this->edited_at;
    }

    public function setEditedAt(?\DateTimeImmutable $edited_at): static
    {
        $this->edited_at = $edited_at;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->published_at;
    }

    public function setPublishedAt(?\DateTimeImmutable $published_at): static
    {
        $this->published_at = $published_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function __toString(): string
    {
        return $this->title;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

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
            $comment->setArticle($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getArticle() === $this) {
                $comment->setArticle(null);
            }
        }

        return $this;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function setTags(?array $tags): static
    {
        $this->tags = $tags;

        return $this;
    }
}
