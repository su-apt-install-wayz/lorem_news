
const roleMap: { [key: string]: string } = {
  "ROLE_ADMIN": "Admin",
  "ROLE_EDITOR": "Editor",
  "ROLE_USER": "Utilisateur",
  "ROLE_LEADER": "Chef d'équipe",
};

export function MultiRoleSelector({
  selectedRoles,
  setSelectedRoles,
  availableRoles, // List of roles to be displayed
}: {
  selectedRoles: string[];
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
  availableRoles: string[];
}) {
  const handleRoleChange = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <div>
      {availableRoles.map((role) => (
        <label key={role} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRoles.includes(role)} // Pre-check if the user already has this role
            onChange={() => handleRoleChange(role)} // Update status on changeover
          />
          <span>{roleMap[role] || role}</span>
        </label>
      ))}
    </div>
  );
}
