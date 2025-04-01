<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\String\Slugger\SluggerInterface;

class ArticleFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(private SluggerInterface $slugger)
    {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        // Assurez-vous d'avoir des utilisateurs existants ou créez des utilisateurs factices ici
        $users = $manager->getRepository(User::class)->findAll();

        if (empty($users)) {
            throw new \RuntimeException('Aucun utilisateur disponible. Veuillez ajouter des utilisateurs avant de charger les articles.');
        }

        for ($i = 0; $i < 20; $i++) {
            // $article = new Article();
            // $article->setTitle($faker->sentence(6, true));
            // $article->setContent("Ceci est un contenu factice généré manuellement.");
            // $article->setSlug($faker->unique()->slug());
            // $article->setImage($faker->optional()->imageUrl(640, 480, 'articles'));
            // $article->setCreatedAt(new \DateTimeImmutable($faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s')));
            // $article->setEditedAt($faker->optional()->dateTimeThisYear());
            // $article->setPublishedAt($faker->optional()->dateTimeThisYear());
            // $article->setUser($faker->randomElement($users));

            // $article = new Article();
            // $title = "Article $i";
            // $slug = $this->slugger->slug($title)->lower();
            // $article->setTitle($title);
            // $article->setContent("Content $i");
            // $article->setSlug($slug);
            // $article->setImage(null);
            // $article->setCreatedAt(new \DateTimeImmutable('now'));
            // $article->setEditedAt(null);
            // $article->setPublishedAt(new \DateTimeImmutable('now'));
            // $article->setUser($users[0]);

            // $manager->persist($article);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [UserFixtures::class];
    }
}
