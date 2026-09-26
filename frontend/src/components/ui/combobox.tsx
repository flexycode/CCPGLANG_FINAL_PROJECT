import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from 'cn';

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    iconSize?: number;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = 'Select Here',
    className,
    iconSize = 14,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                        'w-full bg-[#F5F2EC] px-3.5 py-1.5 rounded-xl flex items-center justify-between text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all select-none',
                        className
                    )}
                >
                    <span className={selectedOption && selectedOption.value !== 'Select Here' ? 'text-[#1F2328] font-semibold' : 'text-gray-500'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown size={iconSize} className="text-gray-500 shrink-0 ml-2" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-1.5 bg-white border border-gray-200/80 shadow-xl rounded-2xl z-50 animate-in fade-in zoom-in-95 duration-150" align="start">
                <div className="max-h-56 overflow-y-auto flex flex-col gap-0.5">
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    'flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all text-left w-full cursor-pointer',
                                    isSelected
                                        ? 'bg-gray-100 text-[#1F2328] font-bold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                )}
                            >
                                <span>{option.label}</span>
                                {isSelected && <Check size={14} className="text-gray-800 shrink-0 ml-2" />}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
