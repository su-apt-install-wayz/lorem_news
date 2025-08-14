<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

class UserApiTest extends WebTestCase {
    // Post
    public function testCreateUser(): void {
        $client = static::createClient();
        $data = [
            "username" => "test_user",
            "email" => "test@example.com",
            "roles" => ["ROLE_ADMIN"],
            "password" => "root"
        ];

        $client->request('POST', '/api/users', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ], json_encode($data));

        $this->assertResponseStatusCodeSame(201);
    }

    // Get token
    private function logIn(KernelBrowser $client): string {
        $client->request('POST', '/api/login', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'email' => 'test@example.com',
            'password' => 'root',
        ]));

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        return $data['token'];
    }

    // Patch
    public function testPatchUser(): void {
        $client = static::createClient();
        $token = $this->logIn($client);

        $client->request('POST', '/api/users', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ], json_encode([
            'username' => 'user_patch',
            'email' => 'userpatch@example.com',
            'roles' => ['ROLE_USER'],
            'password' => 'secret'
        ]));

        $this->assertResponseStatusCodeSame(201);
        $createdUser = json_decode($client->getResponse()->getContent(), true);
        $userId = $createdUser['id'];
        
        $client->request('PATCH', '/api/users/' . $userId, [], [], [
            'CONTENT_TYPE' => 'application/merge-patch+json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ], json_encode([
            'username' => 'patched_user',
            'email' => 'patched@example.com',
            'roles' => ['ROLE_ADMIN'],
            'password' => 'newpassword'
        ]));

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals('patched_user', $data['username']);
        $this->assertEquals('patched@example.com', $data['email']);
        $this->assertContains('ROLE_ADMIN', $data['roles']);
    }

    // Get + Get{id} + Delete
    public function testGetAndDeleteUser(): void {
        $client = static::createClient();
        $token = $this->logIn($client);

        // Get
        $client->request('GET', '/api/users', [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseFormatSame('json');
        
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertNotEmpty($data, 'La liste des utilisateurs ne doit pas être vide.');

        // On prend le premier utilisateur pour les tests suivants
        $user = $data[0];
        $this->assertArrayHasKey('id', $user);
        $this->assertArrayHasKey('username', $user);
        $this->assertArrayHasKey('email', $user);
        $this->assertArrayHasKey('roles', $user);
        $id = $user['id'];

        // Get{id}
        $client->request('GET', '/api/users/' . $id, [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseFormatSame('json');
        $userData = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals($id, $userData['id']);
        $this->assertArrayHasKey('username', $userData);
        $this->assertArrayHasKey('email', $userData);
        $this->assertArrayHasKey('roles', $userData);

        // Delete
        $client->request('DELETE', '/api/users/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $this->assertResponseStatusCodeSame(204); // User deleted successfully
    }
}
