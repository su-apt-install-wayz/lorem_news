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

        if ($data->name !== null) {
            $team->setName($data->name);
        }

        // Gestion du leader
        if ($data->leader !== null) {
            $leaderId = (int) basename($data->leader);
            $leader = $this->em->getRepository(User::class)->find($leaderId);

            // Vérifie si ce leader est déjà assigné à une autre équipe
            $existingTeam = $this->em->getRepository(Team::class)->findOneBy(['leader' => $leader]);
            if ($existingTeam) {
                throw new BadRequestHttpException('Ce leader est déjà assigné à une autre équipe.');
            }

            $team->setLeader($leader);
        }

        $this->em->persist($team);
        $this->em->flush();

        // Ajout des membres
        if (is_array($data->membersInput)) {
            $memberIds = array_filter($data->membersInput, fn($id) => $id !== $team->getLeader()?->getId());

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
