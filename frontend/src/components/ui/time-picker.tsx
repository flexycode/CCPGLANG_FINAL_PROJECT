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
                        'p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all flex items-center justify-center cursor-pointer outline-none focus:ring-2 focus:ring-gray-300',
                        className
                    )}
                >
                    <Clock size={15} className={value ? 'text-gray-500' : 'text-gray-300 hover:text-black'} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="center"
                side="bottom"
                className="w-64 p-3 bg-white border border-gray-200/80 shadow-2xl rounded-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3"
            >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-[#1F2328]">Select Check-in Time</span>
                    <button
                        type="button"
                        onClick={handleNow}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md transition-all cursor-pointer"
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
                            className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-[#1F2328] focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                        >
                            {hours.map((h) => (
                                <option key={h} value={h}>
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
                            className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-[#1F2328] focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                        >
                            {minutes.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* AM/PM Toggle Buttons */}
                    <div className="flex flex-col gap-1 items-center ml-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Period</span>
                        <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                            <button
                                type="button"
                                onClick={() => setSelectedPeriod('AM')}
                                className={cn(
                                    'px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                                    selectedPeriod === 'AM'
                                        ? 'bg-white text-[#1F2328] shadow-xs'
                                        : 'text-gray-500 hover:text-black'
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
                                        ? 'bg-white text-[#1F2328] shadow-xs'
                                        : 'text-gray-500 hover:text-black'
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
                        className="flex-1 py-2 bg-[#FFEDD5] hover:bg-[#FED7AA] text-[#C2410C] text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApply()}
                        className="flex-1 py-2 bg-[#1F2328] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
