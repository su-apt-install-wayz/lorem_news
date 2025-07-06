"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
    labelUnchecked: string;
    labelChecked: string;
    onChange?: (checked: boolean) => void;
    checked?: boolean;
    disabled?:boolean;
    defaultChecked?: boolean;
    id?: string;
}

export function SelectableLabelCheckbox({
    labelUnchecked,
    labelChecked,
    checked,
    disabled,
    defaultChecked = false,
    id,
    onChange,
}: Props) {
    const checkboxId = id ?? useId();
    const isControlled = checked !== undefined;

    return (
        <div className="flex items-center text-muted-foreground">
            <Checkbox
                id={checkboxId}
                className="bg-accent border-muted w-5 h-5 cursor-pointer"
                checked={checked}
                disabled={disabled}
                defaultChecked={isControlled ? undefined : defaultChecked}
                onCheckedChange={onChange}
            />
            <Label htmlFor={checkboxId} className="text-xs cursor-pointer pl-2 py-1">
                {checked ? labelChecked : labelUnchecked}
            </Label>
        </div>
    );
}
