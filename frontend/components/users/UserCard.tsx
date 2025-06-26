import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User } from "@/components/users/UsersList";
import { Badge } from "@/components/ui/badge";
import { SelectableLabelCheckbox } from "./SelectableLabelCheckbox";

interface UserCardProps {
    user: User;
    selected: boolean;
    onToggle: (userId: number, checked: boolean) => void;
}

const roleMap: Record<string, string> = {
    ROLE_USER: "Utilisateur",
    ROLE_MEMBER: "Rédacteur",
    ROLE_LEADER: "Rédacteur en chef",
    ROLE_ADMIN: "Administrateur",
};

export function UserCardSkeleton() {
    return (
        <Card className="p-4">
            <div className="flex items-center text-muted-foreground">
                <Skeleton className="w-24 h-4 rounded bg-muted" />
            </div>

            <div className="flex justify-center">
                <Skeleton className="w-15 h-15 rounded-full bg-muted" />
            </div>

            <CardHeader className="text-center p-0">
                <Skeleton className="h-6 w-6/12 mx-auto bg-muted" />
                <Skeleton className="h-5 w-7/12 mx-auto bg-muted" />
            </CardHeader>

            <CardContent className="flex justify-center flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full bg-muted" />
            </CardContent>

            <CardFooter className="p-0">
                <Skeleton className="w-full h-9 rounded bg-muted" />
            </CardFooter>
        </Card>
    );
}

export function UserCard({ user, selected, onToggle }: UserCardProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center text-muted-foreground">
                <SelectableLabelCheckbox
                    labelUnchecked="Sélectionner"
                    labelChecked="Désélectionner"
                    checked={selected}
                    onChange={(checked) => onToggle(user.id, checked)}
                />
            </div>

            {/* ajouter la team si dans une team */}

            <div className="flex justify-center">
                <Avatar className="w-15 h-15">
                    <AvatarImage src={user.picture ? `/assets/profile/${user.picture}` : `/assets/profile/Ander.png`} />
                    <span className="sr-only">Avatar de {user.username}</span>
                </Avatar>
            </div>

            <CardHeader className="text-center p-0">
                <CardTitle className="text-base">{user.username}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardHeader>

            {user.roles?.length > 0 && (
                <CardContent className="flex justify-center flex-wrap gap-2">
                    {user.roles.map((role, i) => (
                        <Badge key={i} variant={"outline"} className="text-xs px-2 py-0.5 rounded-full bg-accent border-muted">
                            {roleMap[role] ?? role}
                        </Badge>
                    ))}
                </CardContent>
            )}

            <CardFooter className="p-0">
                <Button className="w-full">Modifier</Button>
            </CardFooter>
        </Card>
    );
}
