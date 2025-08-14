<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class TeamInput
{
    #[Groups(['team:write'])]
    public ?string $name = null;

    #[Groups(['team:write'])]
    public ?string $leader = null; // IRI type "/api/users/1"

    /**
     * @var int[]|null
     */
    #[Groups(['team:write'])]
    #[Assert\All([new Assert\Type("integer")])]
    public ?array $membersInput = null;
}
