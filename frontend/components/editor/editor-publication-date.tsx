import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CardDateSelectorProps {
    value: Date | undefined | null;
    onChange: (date: Date | undefined) => void;
    clearDate: () => void;
    setToday: () => void;
    required?: boolean;
}

export function CardDateSelector({ value, onChange, clearDate, setToday, required }: CardDateSelectorProps) {
    return (
        <Card className="w-full min-w-xs max-w-lg max-lg:max-w-none rounded-md shadow-none">
            <CardHeader>
                <CardTitle>
                    <span>Date de publication</span>
                    {required && <span className="text-destructive">{" "}*</span>}
                </CardTitle>
                <CardDescription>Sélectionnez une date de publication de l'article.</CardDescription>
            </CardHeader>
            <CardContent>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className={value ? '' : 'text-muted-foreground'}>
                                {value ? format(value, "PPP", { locale: fr }) : "Date de publication"}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={value ?? undefined} onSelect={onChange} initialFocus locale={fr} />
                        <div className="flex justify-between items-center p-2">
                            <Button variant="ghost" onClick={clearDate} className="text-destructive">Effacer</Button>
                            <Button variant="ghost" onClick={setToday} className="text-secondary">Aujourd'hui</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}
