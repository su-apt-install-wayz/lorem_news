<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\TeamInput;
use App\Entity\Team;
use App\Entity\TeamMembers;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class TeamCreateProcessor implements ProcessorInterface
{
    public function __construct(private readonly EntityManagerInterface $em) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Team
    {
        if (!$data instanceof TeamInput) {
            throw new \InvalidArgumentException('Invalid input type');
        }

        $team = new Team();

        // Name
        if ($data->name !== null) {
            $team->setName($data->name);
        }

        // Leader (obligatoire)
        if ($data->leader === null) {
            throw new BadRequestHttpException('Leader manquant.');
        }

        $leaderId = (int) basename($data->leader);
        if ($leaderId <= 0) {
            throw new BadRequestHttpException('Leader invalide.');
        }

        $leader = $this->em->getReference(User::class, $leaderId);
        $team->setLeader($leader);

        // Members (exclure le leader, éviter doublons)
        if (is_array($data->membersInput)) {
            $memberIds = array_values(array_unique(array_filter(
                $data->membersInput,
                fn ($id) => is_int($id) && $id !== $leaderId
            )));

            foreach ($memberIds as $userId) {
                $userRef = $this->em->getReference(User::class, $userId);
                $member = new TeamMembers();
                $member->setTeam($team);
                $member->setUser($userRef);
                $this->em->persist($member);
            }
        }

        $this->em->persist($team);
        $this->em->flush();

        return $team;
    }
}
