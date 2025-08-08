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

        // Nom
        if ($data->name !== null) {
            $team->setName($data->name);
        }

        // Leader
        if (!$data->leader) {
            throw new BadRequestHttpException("Aucun leader fourni.");
        }

        $leaderId = (int) basename($data->leader);
        $leader = $this->em->getRepository(User::class)->find($leaderId);

        if (!$leader) {
            throw new BadRequestHttpException("Leader avec l'ID $leaderId introuvable.");
        }

        $existingTeam = $this->em->getRepository(Team::class)->findOneBy(['leader' => $leader]);
        if ($existingTeam) {
            throw new BadRequestHttpException("Ce leader est déjà assigné à une autre équipe.");
        }

        // Relation principale
        $team->setLeader($leader); // 👈 Ici, pas d’inversion

        // Flush final
        $this->em->persist($team);
        $this->em->flush();

        // Membres
        if (is_array($data->membersInput)) {
            $memberIds = array_filter($data->membersInput, fn($id) => $id !== $leaderId);

            foreach ($memberIds as $userId) {
                $user = $this->em->getReference(User::class, $userId);
                $member = new TeamMembers();
                $member->setTeam($team);
                $member->setUser($user);
                $this->em->persist($member);
            }

            $this->em->flush();
        }

        return $team;
    }
}
