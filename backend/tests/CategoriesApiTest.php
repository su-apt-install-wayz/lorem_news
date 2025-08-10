<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

class CategoriesApiTest extends WebTestCase {
    private function logIn(KernelBrowser $client): string {
        $client->request('POST', '/api/users', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ], json_encode([
            'username' => 'test_cat',
            'email' => 'test_cat@example.com',
            'roles' => ['ROLE_ADMIN'],
            'password' => 'root'
        ]));

        // Ignore l'erreur 409 si l'utilisateur existe déjà
        if (!in_array($client->getResponse()->getStatusCode(), [201, 409])) {
            throw new \RuntimeException('Impossible de créer l’utilisateur de test.');
        }

        // Authentifie et récupère le token
        $client->request('POST', '/api/login', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'email' => 'test_cat@example.com',
            'password' => 'root',
        ]));

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        return $data['token'];
    }

    // Post
    public function testCreateCategory(): void {
        $client = static::createClient();
        $token = $this->logIn($client);

        $client->request('POST', '/api/categories', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ], json_encode([
            'name' => 'Catégorie Test',
            'color' => '#ff0000'
        ]));

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('id', $data);
        $this->assertEquals('Catégorie Test', $data['name']);
        $this->assertEquals('#ff0000', $data['color']);
    }

    // Patch
    public function testPatchCategory(): void {
        $client = static::createClient();
        $token = $this->logIn($client);

        $client->request('POST', '/api/categories', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ], json_encode([
            'name' => 'Catégorie à modifier',
            'color' => '#00ff00'
        ]));

        $this->assertResponseStatusCodeSame(201);
        $created = json_decode($client->getResponse()->getContent(), true);
        $categoryId = $created['id'];

        $client->request('PATCH', '/api/categories/' . $categoryId, [], [], [
            'CONTENT_TYPE' => 'application/merge-patch+json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ], json_encode([
            'name' => 'Catégorie Modifiée',
            'color' => '#0000ff'
        ]));

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals('Catégorie Modifiée', $data['name']);
        $this->assertEquals('#0000ff', $data['color']);
    }

    // Get + Get{id} + Delete
    public function testGetAndDeleteCategory(): void {
        $client = static::createClient();
        $token = $this->logIn($client);

        // Get all
        $client->request('GET', '/api/categories', [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseFormatSame('json');

        $categories = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($categories);
        $this->assertNotEmpty($categories, 'La liste des catégories ne doit pas être vide.');

        $category = $categories[0];
        $this->assertArrayHasKey('id', $category);
        $this->assertArrayHasKey('name', $category);
        $this->assertArrayHasKey('color', $category);
        $categoryId = $category['id'];

        // Get{id}
        $client->request('GET', '/api/categories/' . $categoryId, [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseFormatSame('json');
        $categoryData = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals($categoryId, $categoryData['id']);
        $this->assertArrayHasKey('name', $categoryData);
        $this->assertArrayHasKey('color', $categoryData);

        // Delete
        $client->request('DELETE', '/api/categories/' . $categoryId, [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $this->assertResponseStatusCodeSame(204); // Category deleted
    }
}
