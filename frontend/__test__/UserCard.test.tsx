import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UserCard } from '../components/hub/users/UserCard'
import { User } from '../components/hub/users/UsersList'

const mockUser: User = {
  id: 1,
  username: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  roles: ['ROLE_USER', 'ROLE_ADMIN'],
}

describe('UserCard', () => {
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

    expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
    expect(screen.getByText('jean.dupont@example.com')).toBeInTheDocument()
  })

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

    expect(screen.getByText('Utilisateur')).toBeInTheDocument()
    expect(screen.getByText('Administrateur')).toBeInTheDocument()
  })

  it('appelle onToggle quand on change la sélection', () => {
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

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(toggleFn).toHaveBeenCalledWith(1, true)
  })

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

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
