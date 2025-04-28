import { Badge } from "@/components/ui/badge";

function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

function getTextColor(rgb: [number, number, number]): string {
    const [r, g, b] = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'var(--color-primary)' : 'var(--color-primary-foreground)';
}

interface CategoryBadgeProps {
    bgColor: string;
    categoryName: string;
}

export default function CategoryBadge({ bgColor, categoryName }: CategoryBadgeProps) {
    const rgbColor = hexToRgb(bgColor);
    const textColor = getTextColor(rgbColor);

    return (
        <Badge
            className="rounded-xs capitalize"
            variant={"outline"}
            style={{
                backgroundColor: `rgba(${rgbColor.join(", ")}, 0.15)`,
                borderColor: `rgba(${rgbColor.join(", ")}, 0.3)`,
                color: textColor,
            }}
        >
            {categoryName}
        </Badge>
    );
}
