<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['category:list']]),
        new Get(normalizationContext: ['groups' => ['category:read']]),
        new Post(normalizationContext: ['groups' => ['category:read']], denormalizationContext: ['groups' => ['category:write']], security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_LEADER')"),
        new Patch(normalizationContext: ['groups' => ['category:read']], denormalizationContext: ['groups' => ['category:write']], security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_LEADER')"),
        new Delete(security: "(is_granted('ROLE_ADMIN') or is_granted('ROLE_LEADER')) and object.getArticles()|length == 0", securityMessage: 'You cannot delete a category that has articles associated with it.'),
    ]
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['category:list', 'category:read', 'article:list', 'article:read', 'article:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 150, unique: true)]
    #[Groups(['category:list', 'category:read', 'category:write', 'article:list', 'article:read'])]
    private ?string $name = null; // peut-être un slug du nom de la catégorie

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['category:list', 'category:read', 'category:write', 'article:list', 'article:read'])]
    private ?string $color = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Article::class)]
    private Collection $articles;

    public function __construct()
    {
        $this->articles = new ArrayCollection();
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
        $this->name = ucfirst(strtolower($name));
        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): static
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    #[Groups(['category:list', 'category:read'])]
    public function getArticleCount(): int
    {
        return $this->articles->count();
    }

    public function addArticle(Article $article): static
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setCategory($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): static
    {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getCategory() === $this) {
                $article->setCategory(null);
            }
        }

        return $this;
    }
}
