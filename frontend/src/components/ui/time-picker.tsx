import * as React from 'react';
import { Clock } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from 'cn';

interface TimePickerProps {
    value?: string;
    onChange: (formattedTime: string) => void;
    className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Parse existing value or default to current time
    const parseTime = (timeStr?: string) => {
        if (!timeStr) {
            const now = new Date();
            let h = now.getHours();
            const m = Math.floor(now.getMinutes() / 5) * 5;
            const period = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return {
                hour: h.toString().padStart(2, '0'),
                minute: m.toString().padStart(2, '0'),
                period,
            };
        }

        const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (match) {
            return {
                hour: parseInt(match[1], 10).toString().padStart(2, '0'),
                minute: match[2],
                period: match[3].toUpperCase(),
            };
        }

        return { hour: '02', minute: '59', period: 'PM' };
    };

    const initial = parseTime(value);
    const [selectedHour, setSelectedHour] = React.useState(initial.hour);
    const [selectedMinute, setSelectedMinute] = React.useState(initial.minute);
    const [selectedPeriod, setSelectedPeriod] = React.useState(initial.period);

    React.useEffect(() => {
        if (open) {
            const current = parseTime(value);
            setSelectedHour(current.hour);
            setSelectedMinute(current.minute);
            setSelectedPeriod(current.period);
        }
    }, [open, value]);

    const handleApply = (h = selectedHour, m = selectedMinute, p = selectedPeriod) => {
        const hourNum = parseInt(h, 10);
        const formatted = `${hourNum}:${m} ${p}`;
        onChange(formatted);
        setOpen(false);
    };

    const handleNow = () => {
        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, '0');
        const period = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        handleApply(h.toString().padStart(2, '0'), m, period);
    };

    const handleClear = () => {
        onChange('');
        setOpen(false);
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    title="Select check-in time"
                    className={cn(
                        'p-1.5 rounded-lg text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600',
                        className
                    )}
                >
                    <Clock size={15} className={value ? 'text-gray-500 dark:text-gray-300' : 'text-gray-300 dark:text-gray-500 hover:text-black dark:hover:text-white'} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="center"
                side="bottom"
                className="w-64 p-3 bg-white dark:bg-[#16213e] border border-gray-200/80 dark:border-white/10 shadow-2xl rounded-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3"
            >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2">
                    <span className="text-xs font-bold text-[#1F2328] dark:text-white">Select Check-in Time</span>
                    <button
                        type="button"
                        onClick={handleNow}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                    >
                        Set to Now
                    </button>
                </div>

                {/* Time Selectors Row */}
                <div className="flex items-center justify-center gap-1.5">
                    {/* Hour Column */}
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Hour</span>
                        <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            className="bg-gray-50 dark:bg-[#1F2937] border border-gray-200 dark:border-white/10 rounded-xl px-2 py-1.5 text-xs font-bold text-[#1F2328] dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
                        >
                            {hours.map((h) => (
                                <option key={h} value={h} className="bg-white dark:bg-[#1F2937] text-gray-900 dark:text-white">
                                    {parseInt(h, 10)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="text-sm font-bold text-gray-400 mt-4">:</span>

                    {/* Minute Column */}
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Minute</span>
                        <select
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            className="bg-gray-50 dark:bg-[#1F2937] border border-gray-200 dark:border-white/10 rounded-xl px-2 py-1.5 text-xs font-bold text-[#1F2328] dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
                        >
                            {minutes.map((m) => (
                                <option key={m} value={m} className="bg-white dark:bg-[#1F2937] text-gray-900 dark:text-white">
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* AM/PM Toggle Buttons */}
                    <div className="flex flex-col gap-1 items-center ml-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Period</span>
                        <div className="flex bg-gray-100 dark:bg-[#1F2937] p-0.5 rounded-xl border border-gray-200 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => setSelectedPeriod('AM')}
                                className={cn(
                                    'px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                                    selectedPeriod === 'AM'
                                        ? 'bg-white dark:bg-[#0F172A] text-[#1F2328] dark:text-white shadow-xs'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                )}
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPeriod('PM')}
                                className={cn(
                                    'px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                                    selectedPeriod === 'PM'
                                        ? 'bg-white dark:bg-[#0F172A] text-[#1F2328] dark:text-white shadow-xs'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                )}
                            >
                                PM
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex-1 py-2 bg-[#FFEDD5] dark:bg-orange-950/40 hover:bg-[#FED7AA] dark:hover:bg-orange-950/60 text-[#C2410C] dark:text-orange-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApply()}
                        className="flex-1 py-2 bg-[#1F2328] dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
