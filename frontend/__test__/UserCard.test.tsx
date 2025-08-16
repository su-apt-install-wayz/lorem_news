import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UserCard } from '@/components/hub/users/UserCard'
import { User } from '@/components/hub/users/UsersList'

// Création d'un faux utilisateur pour les tests
const mockUser: User = {
  id: 1,
  username: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  roles: ['ROLE_USER', 'ROLE_ADMIN'],
}

describe('UserCard', () => {
  // Test 1 : Vérifie que les infos principales s'affichent correctement
  it('affiche le nom, email et image de profil', () => {
    render(
      <UserCard
        user={mockUser}
        selected={false}
        onToggle={() => {}}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )

    // Vérifie que le nom et e-mail son présent
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
    expect(screen.getByText('jean.dupont@example.com')).toBeInTheDocument()
  })

  // Test 2 : Vérifie que les rôles sont affichés avec leur label
  it('affiche les rôles avec le bon label', () => {
    render(
      <UserCard
        user={mockUser}
        selected={false}
        onToggle={() => {}}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )

    // Vérificaiton du bon affichage des roles
    expect(screen.getByText('Utilisateur')).toBeInTheDocument()
    expect(screen.getByText('Administrateur')).toBeInTheDocument()
  })

  // Test 3 : Vérifie que onToggle est appelé quand on coche/décoche
  it('appelle onToggle quand on change la sélection', () => {
    // Création d'une fonction espion (mock) pour vérifier si elle est appelée
    const toggleFn = vi.fn()

    render(
      <UserCard
        user={mockUser}
        selected={false}
        onToggle={toggleFn}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )

    // Récupèration de la checkbox
    const checkbox = screen.getByRole('checkbox')
    // Simulation un clic dessus
    fireEvent.click(checkbox)
    // Vérification que la fonction onToggle est appelée avec le bon userId et checked = true
    expect(toggleFn).toHaveBeenCalledWith(1, true)
  })

  // Test 4 : Vérifie que le bouton pour modifier (EditUserDialog) est bien présent
  it('affiche le bouton d’édition', () => {
    render(
      <UserCard
        user={mockUser}
        selected={false}
        onToggle={() => {}}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )

    // Vérification qu'au moins un bouton est présent
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})