<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\Query\Expr\Orx;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

final class UserSearchQueryFilter extends AbstractFilter
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

        $orConditions = [];
        $relevance = [];

        foreach ($keywords as $i => $word) {
            $param = "searchWord$i";
            $like = '%' . mb_strtolower($word) . '%';

            $orConditions[] = "LOWER($alias.username) LIKE :$param";
            $relevance[] = "CASE WHEN LOWER($alias.username) LIKE :$param THEN 10 ELSE 0 END";

            $orConditions[] = "LOWER($alias.email) LIKE :$param";
            $relevance[] = "CASE WHEN LOWER($alias.email) LIKE :$param THEN 6 ELSE 0 END";

            $qb->setParameter($param, $like);
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
                'description' => 'Recherche sur username ou email',
            ],
        ];
    }
}
