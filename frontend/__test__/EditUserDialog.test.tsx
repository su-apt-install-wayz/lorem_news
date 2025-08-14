import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EditUserDialog } from '../components/hub/users/EditUserDialog'
import { User } from '../components/hub/users/UsersList'

// Création d'un faux utilisateur pour les tests
const mockUser: User = {
  id: 1,
  username: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  roles: ['ROLE_USER'],
}

describe('EditUserDialog', () => {
  // Test 1 : Vérifie que le bouton "Modifier" est visible
  it('affiche le bouton Modifier', () => {
    render(
      <EditUserDialog
        user={mockUser}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )
    expect(screen.getByText('Modifier')).toBeInTheDocument()
  })

  // Test 2 : Vérifie que la boîte de dialogue s’ouvre
  it('ouvre le dialogue au clic sur le bouton', async () => {
    render(
      <EditUserDialog
        user={mockUser}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Modifier'))
    expect(await screen.findByText("Modifier l'utilisateur")).toBeInTheDocument()
    expect(screen.getByDisplayValue('Jean Dupont')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jean.dupont@example.com')).toBeInTheDocument()
  })

  // Test 3 : Vérifie qu’on peut changer le nom d’utilisateur et soumettre
  it('met à jour les champs et soumet les modifications', async () => {
    const updateUser = vi.fn().mockResolvedValue(true)
    const onOptimisticUpdate = vi.fn()

    render(
      <EditUserDialog
        user={mockUser}
        updateUser={updateUser}
        onOptimisticUpdate={onOptimisticUpdate}
      />
    )

    fireEvent.click(screen.getByText('Modifier'))

    // Attendre que la boîte de dialogue s’ouvre
    await screen.findByText("Modifier l'utilisateur")

    const usernameInput = screen.getByLabelText("Nom d'utilisateur")
    const emailInput = screen.getByLabelText('Email')

    // Modifier les valeurs
    fireEvent.change(usernameInput, { target: { value: 'Jean M.' } })
    fireEvent.change(emailInput, { target: { value: 'jean.m@example.com' } })

    // Cliquer sur "Sauvegarder"
    fireEvent.click(screen.getByText('Sauvegarder'))

    // Vérifier que updateUser et onOptimisticUpdate ont été appelés
    await waitFor(() => {
      expect(onOptimisticUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'Jean M.',
          email: 'jean.m@example.com',
        })
      )
      expect(updateUser).toHaveBeenCalledWith(1, {
        username: 'Jean M.',
        email: 'jean.m@example.com',
        roles: ['ROLE_USER'],
      })
    })
  })

  // Test 4 : Vérifie que ROLE_USER est bien désactivé
  it('désactive le rôle ROLE_USER', async () => {
    render(
      <EditUserDialog
        user={mockUser}
        updateUser={vi.fn()}
        onOptimisticUpdate={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Modifier'))
    await screen.findByText("Modifier l'utilisateur")

    // Le bouton ROLE_USER est désactivé
    const roleButton = screen.getByText('Utilisateur')
    expect(roleButton).toBeDisabled()
  })
})
