<?php

namespace App\DataPersister;

use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Team;
use App\Entity\TeamMembers;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator(decorates: 'api_platform.doctrine.orm.state.persist_processor')]
class TeamDataPersister implements ProcessorInterface
{
    public function __construct(private readonly ProcessorInterface $inner, private readonly EntityManagerInterface $em) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Team) {
            return $this->inner->process($data, $operation, $uriVariables, $context);
        }

        $result = $this->inner->process($data, $operation, $uriVariables, $context);

        $membersInput = $data->getMembersInput();

        if (is_array($membersInput)) {
            foreach ($membersInput as $userId) {
                $user = $this->em->getReference(\App\Entity\User::class, $userId);

                // skip si leader
                if ($userId === $data->getLeader()?->getId()) {
                    continue;
                }

                $member = new TeamMembers();
                $member->setTeam($data);
                $member->setUser($user);
                $this->em->persist($member);
            }

            $this->em->flush();
        }

        return $result;
    }
}
