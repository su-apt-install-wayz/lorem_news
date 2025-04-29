
const roleMap: { [key: string]: string } = {
  "ROLE_ADMIN": "admin",
  "ROLE_EDITOR": "editor",
  "ROLE_VIEWER": "viewer",
  "ROLE_LEADER": "chef d'équipe",
};

export function MultiRoleSelector({
  selectedRoles,
  setSelectedRoles,
  availableRoles, // Liste des rôles à afficher
}: {
  selectedRoles: string[];
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
  availableRoles: string[];
}) {
  const handleRoleChange = (role: string) => {
    if (selectedRoles.includes(role)) {
      // Si le rôle est déjà sélectionné, le désélectionner
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      // Sinon, ajouter le rôle à la sélection
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <div>
      {availableRoles.map((role) => (
        <label key={role} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRoles.includes(role)} // Pré-cocher si l'utilisateur a déjà ce rôle
            onChange={() => handleRoleChange(role)} // Mettre à jour l'état lors du changement
          />
          <span>{roleMap[role] || role}</span>
        </label>
      ))}
    </div>
  );
}
