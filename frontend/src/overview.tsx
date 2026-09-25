import { useState, useRef, useEffect } from 'react';
import {
    Search,
    Clock,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import Sidebar from './components/Sidebar';
import HeaderDate from './components/HeaderDate';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

interface OverviewProps {
    onSignOut?: () => void;
    onPageChange?: (page: string) => void;
}

const attendanceData = [
    { week: "Week 1", attendance: 82 },
    { week: "Week 2", attendance: 90 },
    { week: "Week 3", attendance: 85 },
    { week: "Week 4", attendance: 95 },
    { week: "Week 5", attendance: 88 },
    { week: "Week 6", attendance: 92 },
    { week: "Week 7", attendance: 94 },
    { week: "Week 8", attendance: 89 },
    { week: "Week 9", attendance: 96 },
    { week: "Week 10", attendance: 91 },
    { week: "Week 11", attendance: 93 },
    { week: "Week 12", attendance: 97 },
];

const attendanceConfig = {
    attendance: {
        label: "Attendance Rate",
        color: "#3B82F6",
    },
} satisfies ChartConfig;

const attentionData = [
    { week: "Week 1", attention: 15 },
    { week: "Week 2", attention: 8 },
    { week: "Week 3", attention: 12 },
    { week: "Week 4", attention: 5 },
    { week: "Week 5", attention: 9 },
    { week: "Week 6", attention: 6 },
    { week: "Week 7", attention: 4 },
    { week: "Week 8", attention: 10 },
    { week: "Week 9", attention: 3 },
    { week: "Week 10", attention: 7 },
    { week: "Week 11", attention: 5 },
    { week: "Week 12", attention: 2 },
];

const attentionConfig = {
    attention: {
        label: "Flagged / Absences",
        color: "#1F2937",
    },
} satisfies ChartConfig;

const renderCustomAxisTick = ({ x, y, payload }: any) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                textAnchor="middle"
                className="text-[12px] fill-gray-500 font-medium"
            >
                {payload.value}
            </text>
        </g>
    );
};

export default function Overview({ onSignOut, onPageChange }: OverviewProps) {
    const [attendanceWeekPage, setAttendanceWeekPage] = useState<number>(0);
    const [attentionWeekPage, setAttentionWeekPage] = useState<number>(0);

    const visibleAttendanceData = attendanceData.slice(attendanceWeekPage * 6, (attendanceWeekPage + 1) * 6);
    const visibleAttentionData = attentionData.slice(attentionWeekPage * 6, (attentionWeekPage + 1) * 6);

    const scheduleRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = () => {
        if (scheduleRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scheduleRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scheduleRef.current;
        if (el) {
            updateScrollButtons();
            el.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
            return () => {
                el.removeEventListener('scroll', updateScrollButtons);
                window.removeEventListener('resize', updateScrollButtons);
            };
        }
    }, []);

    const scrollSchedule = (direction: 'left' | 'right') => {
        if (scheduleRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scheduleRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const todaySchedule = [
        { id: 1, code: 'CCPGLANG - COM232', pageKey: 'CCPGLANG', title: 'Programming Languages', time: '3:00 PM - 5:00 PM', checkedIn: 45, total: 50, hasDetails: true },
        { id: 2, code: 'CCAUTOMA - COM222', pageKey: 'CCAUTOMATA', title: 'Automata Theory', time: '5:00 PM - 7:00 PM', checkedIn: 32, total: 40, hasDetails: true },
        { id: 3, code: 'CCDATRCL - COM242', pageKey: 'CCDATRCL', title: 'Data Structure', time: '7:00 PM - 9:00 PM', checkedIn: 18, total: 40, hasDetails: true },
        { id: 4, code: 'CCNETWRK - COM252', pageKey: 'CCNETWRK', title: 'Computer Networks', time: '9:00 AM - 11:00 AM', checkedIn: 48, total: 50, hasDetails: false },
        { id: 5, code: 'CCSOFENG - COM262', pageKey: 'CCSOFENG', title: 'Software Engineering', time: '1:00 PM - 3:00 PM', checkedIn: 28, total: 40, hasDetails: false },
    ];

    return (
        <div className="flex h-screen w-full bg-[#FFFBF4] text-[#1F2328] font-sans overflow-hidden">
            <Sidebar onSignOut={onSignOut} activePage="Overview" onPageChange={onPageChange} />

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto flex flex-col gap-8 h-full">
                {/* Header & Greeting Group */}
                <div className="flex flex-col gap-1">
                    {/* Top Header Row */}
                    <header className="flex items-center justify-between">
                        <HeaderDate />
                    </header>

                    {/* Greeting Section */}
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-[#1F2328] tracking-tight">
                            Good morning, Prof. Caluya
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                            You have 3 classes scheduled today.
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xl">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Quick search a student or class"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/80 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm transition-all"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart 1: Overall Attendance */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[#1F2328]">Overall Attendance</h3>
                            <div className="flex items-center gap-3">
                                {/* Week Page Navigation Arrows */}
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/80 p-1 rounded-xl">
                                    <button
                                        onClick={() => setAttendanceWeekPage(0)}
                                        disabled={attendanceWeekPage === 0}
                                        className="p-1 rounded-lg text-gray-600 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        title="Weeks 1-6"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-[11px] font-bold text-gray-600 px-1 min-w-[50px] text-center">
                                        {attendanceWeekPage === 0 ? "W1–W6" : "W7–W12"}
                                    </span>
                                    <button
                                        onClick={() => setAttendanceWeekPage(1)}
                                        disabled={attendanceWeekPage === 1}
                                        className="p-1 rounded-lg text-gray-600 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        title="Weeks 7-12"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ChartContainer config={attendanceConfig} className="h-44 w-full">
                            <AreaChart
                                accessibilityLayer
                                data={visibleAttendanceData}
                                margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="week"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    interval={0}
                                    tick={renderCustomAxisTick}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <defs>
                                    <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="attendance"
                                    type="natural"
                                    fill="url(#fillAttendance)"
                                    fillOpacity={0.4}
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#FFFFFF", stroke: "#3B82F6", strokeWidth: 2.5 }}
                                    activeDot={{ r: 6, fill: "#3B82F6" }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>

                    {/* Chart 2: Requires Attention */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[#1F2328]">Requires Attention</h3>
                            <div className="flex items-center gap-3">
                                {/* Week Page Navigation Arrows */}
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/80 p-1 rounded-xl">
                                    <button
                                        onClick={() => setAttentionWeekPage(0)}
                                        disabled={attentionWeekPage === 0}
                                        className="p-1 rounded-lg text-gray-600 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        title="Weeks 1-6"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-[11px] font-bold text-gray-600 px-1 min-w-[50px] text-center">
                                        {attentionWeekPage === 0 ? "W1–W6" : "W7–W12"}
                                    </span>
                                    <button
                                        onClick={() => setAttentionWeekPage(1)}
                                        disabled={attentionWeekPage === 1}
                                        className="p-1 rounded-lg text-gray-600 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        title="Weeks 7-12"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ChartContainer config={attentionConfig} className="h-44 w-full">
                            <AreaChart
                                accessibilityLayer
                                data={visibleAttentionData}
                                margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="week"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    interval={0}
                                    tick={renderCustomAxisTick}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <defs>
                                    <linearGradient id="fillAttention" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1F2937" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#1F2937" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="attention"
                                    type="natural"
                                    fill="url(#fillAttention)"
                                    fillOpacity={0.4}
                                    stroke="#1F2937"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#FFFFFF", stroke: "#1F2937", strokeWidth: 2.5 }}
                                    activeDot={{ r: 6, fill: "#1F2937" }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Today's Schedule Section */}
                <div className="flex flex-col gap-4 mb-4">
                    <h2 className="text-2xl font-serif font-bold text-[#1F2328]">Today's Schedule</h2>

                    <div className="relative group">
                        {/* Left Scroll Arrow */}
                        {canScrollLeft && (
                            <button
                                onClick={() => scrollSchedule('left')}
                                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white border border-gray-200/80 rounded-full text-gray-700 hover:bg-gray-50 transition-all shadow-md active:scale-95 flex items-center justify-center animate-in fade-in duration-200"
                                aria-label="Scroll schedule left"
                                title="Scroll left"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}

                        {/* Right Scroll Arrow */}
                        {canScrollRight && (
                            <button
                                onClick={() => scrollSchedule('right')}
                                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white border border-gray-200/80 rounded-full text-gray-700 hover:bg-gray-50 transition-all shadow-md active:scale-95 flex items-center justify-center animate-in fade-in duration-200"
                                aria-label="Scroll schedule right"
                                title="Scroll right"
                            >
                                <ChevronRight size={18} />
                            </button>
                        )}

                        <div
                            ref={scheduleRef}
                            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                        {todaySchedule.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    if (item.hasDetails && onPageChange) {
                                        onPageChange(item.pageKey);
                                    }
                                }}
                                className={`w-[340px] shrink-0 snap-start bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-5 transition-all ${
                                    item.hasDetails
                                        ? 'hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                                        : 'cursor-default'
                                }`}
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">{item.code}</span>
                                            <button
                                                type="button"
                                                aria-label="View Details"
                                                onClick={(e) => {
                                                    if (item.hasDetails && onPageChange) {
                                                        e.stopPropagation();
                                                        onPageChange(item.pageKey);
                                                    }
                                                }}
                                                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1F2328] leading-tight">{item.title}</h3>
                                    </div>
                                    <div className="flex w-fit items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-100 py-1 px-2 rounded-lg">
                                        <Clock size={14} />
                                        <span>{item.time}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-[#1F2328]">Attendance Rate</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#1F2328] font-bold text-sm">{Math.round((item.checkedIn / item.total) * 100)}%</span>
                                            <span className="text-gray-400 font-normal">({item.checkedIn} / {item.total})</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`${item.checkedIn >= 40 ? 'bg-[#2D7A52]' : item.checkedIn >= 25 ? 'bg-[#EAB308]' : 'bg-[#DC2626]'} h-full rounded-full transition-all duration-300`}
                                            style={{ width: `${(item.checkedIn / item.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </main>
        </div>
    );
}
