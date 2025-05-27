import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const roleMap: { [key: string]: string } = {
  "ROLE_ADMIN": "Admin",
  "ROLE_MEMBER": "Membre",
  "ROLE_USER": "Utilisateur",
  "ROLE_LEADER": "Chef d'équipe",
}

export function MultiRoleSelector({
  selectedRoles,
  setSelectedRoles,
  availableRoles,
}: {
  selectedRoles: string[]
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>
  availableRoles: string[]
}) {
  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role])
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {availableRoles.map((role) => (
        <div key={role} className="flex items-center space-x-2">
          <Checkbox
            id={role}
            checked={selectedRoles.includes(role)}
            onCheckedChange={(checked) => handleRoleChange(role, checked === true)}
          />
          <Label htmlFor={role}>{roleMap[role] || role}</Label>
        </div>
      ))}
    </div>
  )
}
