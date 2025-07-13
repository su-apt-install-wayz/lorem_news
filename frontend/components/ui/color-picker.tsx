'use client';

import type { PopoverContentProps } from '@radix-ui/react-popover';
import {
    type HexColor,
    hexToHsva,
    type HslaColor,
    hslaToHsva,
    type HsvaColor,
    hsvaToHex,
    hsvaToHsla,
    hsvaToHslString,
    hsvaToRgba,
    type RgbaColor,
    rgbaToHsva,
} from '@uiw/color-convert';
import Hue from '@uiw/react-color-hue';
import Saturation from '@uiw/react-color-saturation';
import React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function getColorAsHsva(color: `#${string}` | HsvaColor | HslaColor | RgbaColor): HsvaColor {
    if (typeof color === 'string') {
        return hexToHsva(color);
    } else if ('h' in color && 's' in color && 'v' in color) {
        return color;
    } else if ('r' in color) {
        return rgbaToHsva(color);
    } else {
        return hslaToHsva(color);
    }
}

type ColorPickerValue = {
    hex: string;
    hsl: HslaColor;
    rgb: RgbaColor;
};

type ColorPickerProps = {
    value?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
    type?: 'hsl' | 'rgb' | 'hex';
    swatches?: HexColor[];
    hideContrastRatio?: boolean;
    hideDefaultSwatches?: boolean;
    className?: string;
    onValueChange?: (value: ColorPickerValue) => void;
} & PopoverContentProps;

function ColorPicker({
    value,
    children,
    type = 'hsl',
    swatches = [],
    hideContrastRatio,
    hideDefaultSwatches,
    onValueChange,
    className,
    ...props
}: ColorPickerProps) {
    const [colorHsv, setColorHsv] = React.useState<HsvaColor>(value ? getColorAsHsva(value) : { h: 0, s: 0, v: 0, a: 1 });

    const handleValueChange = (color: HsvaColor) => {
        onValueChange?.({
            hex: hsvaToHex(colorHsv),
            hsl: hsvaToHsla(colorHsv),
            rgb: hsvaToRgba(colorHsv),
        });

        setColorHsv(color);
    };

    return (
        <Popover {...props}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className={cn('w-[350px] p-0', className)}
                {...props}
                style={
                    {
                        '--selected-color': hsvaToHslString(colorHsv),
                    } as React.CSSProperties
                }
            >
                <div className="space-y-2 p-4">
                    <Saturation
                        hsva={colorHsv}
                        onChange={(newColor) => {
                            handleValueChange(newColor);
                        }}
                        style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '4/2',
                            borderRadius: '0.3rem',
                        }}
                        className="border border-border"
                    />
                    <Hue
                        hue={colorHsv.h}
                        onChange={(newHue) => {
                            handleValueChange({ ...colorHsv, ...newHue });
                        }}
                        className="[&>div:first-child]:overflow-hidden [&>div:first-child]:!rounded"
                        style={
                            {
                                width: '100%',
                                height: '0.9rem',
                                borderRadius: '0.3rem',
                                '--alpha-pointer-background-color': 'hsl(var(--foreground))',
                            } as React.CSSProperties
                        }
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}

export { ColorPicker };
export type { ColorPickerProps, ColorPickerValue };
