<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\Query\Expr\Orx;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

class ArticleSearchQueryFilter extends AbstractFilter
{
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $qb,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = []
    ): void {
        if ($property !== 'searchQuery' || empty($value)) return;

        $alias = $qb->getRootAliases()[0];
        $keywords = array_filter(explode(' ', $value));

        // LEFT JOIN tags & category
        $qb->leftJoin("$alias.category", "c");

        $orConditions = [];
        $relevance = [];

        foreach ($keywords as $i => $word) {
            $param = "searchWord$i";
            $likeExpr = '%' . mb_strtolower($word) . '%';

            $orConditions[] = "LOWER($alias.title) LIKE :$param";
            $relevance[] = "CASE WHEN LOWER($alias.title) LIKE :$param THEN 10 ELSE 0 END";

            $orConditions[] = "LOWER($alias.content) LIKE :$param";
            $relevance[] = "CASE WHEN LOWER($alias.content) LIKE :$param THEN 6 ELSE 0 END";

            $orConditions[] = "LOWER(c.name) LIKE :$param";
            $relevance[] = "CASE WHEN LOWER(c.name) LIKE :$param THEN 2 ELSE 0 END";

            $qb->setParameter($param, $likeExpr);
        }

        $qb->andWhere(new Orx($orConditions));
        $qb->addSelect('(' . implode(' + ', $relevance) . ') AS HIDDEN relevance');
        $qb->addOrderBy('relevance', 'DESC');
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'searchQuery' => [
                'property' => 'searchQuery',
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Recherche avancée (titre, contenu, tags, catégorie)',
            ],
        ];
    }
}
