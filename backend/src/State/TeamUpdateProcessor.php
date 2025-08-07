<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\TeamInput;
use App\Entity\Team;
use App\Entity\TeamMembers;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

final class TeamUpdateProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Team
    {
        if (!$data instanceof TeamInput) {
            throw new \InvalidArgumentException('Invalid input type');
        }

        /** @var Team $team */
        $team = $this->em->getRepository(Team::class)->find($uriVariables['id']);
        if (!$team) {
            throw new \RuntimeException('Team not found');
        }

        // Update name
        if ($data->name !== null) {
            $team->setName($data->name);
        }

        // Update leader
        if ($data->leader !== null) {
            $leaderId = (int) basename($data->leader); // extract ID from IRI
            $leader = $this->em->getReference(User::class, $leaderId);
            $team->setLeader($leader);
        }

        if (is_array($data->membersInput)) {
            // IDs des membres à conserver (ceux reçus depuis le front)
            $newMemberIds = array_filter($data->membersInput, fn($id) => $id !== $team->getLeader()?->getId());

            // Membres actuels
            $currentMembers = $team->getTeamMembers();

            foreach ($currentMembers as $member) {
                $userId = $member->getUser()->getId();

                if (!in_array($userId, $newMemberIds, true)) {
                    // L'utilisateur n'est plus dans la liste => on le retire
                    $this->em->remove($member);
                }
            }

            // Ajouter les nouveaux membres manquants
            $existingIds = array_map(
                fn(TeamMembers $tm) => $tm->getUser()->getId(),
                $team->getTeamMembers()->toArray()
            );

            foreach ($newMemberIds as $userId) {
                if (!in_array($userId, $existingIds, true)) {
                    $user = $this->em->getReference(User::class, $userId);
                    $member = new TeamMembers();
                    $member->setTeam($team);
                    $member->setUser($user);
                    $this->em->persist($member);
                }
            }
        }

        $this->em->flush();

        return $team;
    }
}
