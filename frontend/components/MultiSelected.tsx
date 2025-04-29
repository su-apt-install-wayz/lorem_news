
interface MultiRoleSelectorProps {
    selectedRoles: string[];
    setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
    roles: string[];
  }
  
  export function MultiRoleSelector({
    selectedRoles,
    setSelectedRoles,
    roles,
  }: MultiRoleSelectorProps) {
  
    const handleRoleChange = (role: string) => {
      if (selectedRoles.includes(role)) {
        setSelectedRoles(selectedRoles.filter((r) => r !== role)); // Désélectionner
      } else {
        setSelectedRoles([...selectedRoles, role]); // Sélectionner
      }
    }
  
    return (
      <div>
        {roles.map((role) => (
          <label key={role}>
            <input
              type="checkbox"
              checked={selectedRoles.includes(role)}
              onChange={() => handleRoleChange(role)}
            />
            {role}
          </label>
        ))}
      </div>
    )
  }
  
