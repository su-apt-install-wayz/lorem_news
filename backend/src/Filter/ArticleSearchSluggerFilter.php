<?php

namespace App\ApiFilter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

final class ArticleSearchSluggerFilter extends AbstractFilter
{
    private SluggerInterface $slugger;

    public function __construct(
        ManagerRegistry $managerRegistry,
        LoggerInterface $logger,
        SluggerInterface $slugger,
        ?array $properties = null
    ) {
        parent::__construct($managerRegistry, $logger, $properties);
        $this->slugger = $slugger;
    }

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        if ($property !== 'title' || null === $value) {
            return;
        }

        $slug = strtolower($this->slugger->slug($value));
        $alias = $queryBuilder->getRootAliases()[0];
        $parameterName = $queryNameGenerator->generateParameterName('slug');

        $queryBuilder
            ->andWhere(sprintf('%s.slug = :%s', $alias, $parameterName))
            ->setParameter($parameterName, $slug);
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'title' => [
                'property' => 'title',
                'type' => 'string',
                'required' => false,
                'swagger' => [
                    'description' => 'Filtre par titre transformé en slug',
                ],
            ],
        ];
    }
}
