import { useState, useRef, useEffect } from 'react';
import { AlertCircle, User, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import Sidebar from './components/Sidebar';
import HeaderDate from './components/HeaderDate';
import { Combobox } from '@/components/ui/combobox';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

interface ReportsProps {
    onSignOut?: () => void;
    onPageChange?: (page: string) => void;
}

const trendData = [
    { week: "Week 1", rate: 91 },
    { week: "Week 2", rate: 94 },
    { week: "Week 3", rate: 89 },
    { week: "Week 4", rate: 95 },
    { week: "Week 5", rate: 91 },
    { week: "Week 6", rate: 96 },
    { week: "Week 7", rate: 93 },
    { week: "Week 8", rate: 90 },
    { week: "Week 9", rate: 95 },
    { week: "Week 10", rate: 92 },
    { week: "Week 11", rate: 96 },
    { week: "Week 12", rate: 94 },
];

const trendConfig = {
    rate: {
        label: "Attendance Rate",
        color: "#1F2937",
    },
} satisfies ChartConfig;

const reportTypeOptions = [
    { value: 'Attendance Summary', label: 'Attendance Summary' },
    { value: 'Absence Report', label: 'Absence Report' },
    { value: 'Late Report', label: 'Late Report' },
];

const dateRangeOptions = [
    { value: 'Last 7 Days', label: 'Last 7 Days' },
    { value: 'Last 30 Days', label: 'Last 30 Days' },
    { value: 'This Semester', label: 'This Semester' },
];

const chartClassOptions = [
    { value: 'All Classes', label: 'All Classes' },
    { value: 'CCPGLANG - COM232', label: 'CCPGLANG - COM232' },
    { value: 'CCINTHCI - COM233', label: 'CCINTHCI - COM233' },
    { value: 'CCDATRCL - COM242', label: 'CCDATRCL - COM242' },
    { value: 'CCAUTOMA - COM222', label: 'CCAUTOMA - COM222' },
];

const actionStudents = [
    {
        id: 1,
        name: 'Dela Rama, Rinoah Venedict',
        studentId: '2022-153678',
        subject: 'CCPGLANG - COM232',
        absenceRate: '35%',
        missedCount: '5 missed',
    },
    {
        id: 2,
        name: 'Talosig, Jay Arre',
        studentId: '2022-489348',
        subject: 'CCINTHCI - COM233',
        absenceRate: '25%',
        missedCount: '3 missed',
    },
];

export default function Reports({ onSignOut, onPageChange }: ReportsProps) {
    const [reportType, setReportType] = useState('Select Here');
    const [dateRange, setDateRange] = useState('Select Here');
    const [chartClassFilter, setChartClassFilter] = useState('All Classes');

    const chartScrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [chartPage, setChartPage] = useState<number>(0);
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [isDraggingTrack, setIsDraggingTrack] = useState<boolean>(false);
    const [isChartDragging, setIsChartDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [startScrollLeft, setStartScrollLeft] = useState<number>(0);

    const handleScroll = () => {
        if (chartScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = chartScrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll > 0) {
                const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll));
                setScrollProgress(progress);
                const currentPage = Math.round(scrollLeft / clientWidth);
                setChartPage(currentPage);
            }
        }
    };

    useEffect(() => {
        const el = chartScrollRef.current;
        if (el) {
            handleScroll();
            el.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
            return () => {
                el.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, []);

    const updateScrollFromPointer = (clientX: number) => {
        if (trackRef.current && chartScrollRef.current) {
            const rect = trackRef.current.getBoundingClientRect();
            const clickX = clientX - rect.left;
            const halfThumb = rect.width / 4;
            const clampedX = Math.max(halfThumb, Math.min(rect.width - halfThumb, clickX));
            const ratio = (clampedX - halfThumb) / (rect.width / 2);
            const maxScroll = chartScrollRef.current.scrollWidth - chartScrollRef.current.clientWidth;
            chartScrollRef.current.scrollLeft = ratio * maxScroll;
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDraggingTrack(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
        updateScrollFromPointer(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingTrack) {
            updateScrollFromPointer(e.clientX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingTrack) {
            setIsDraggingTrack(false);
            try {
                e.currentTarget.releasePointerCapture?.(e.pointerId);
            } catch {
                // ignore
            }
        }
    };

    const handleChartMouseDown = (e: React.MouseEvent) => {
        if (!chartScrollRef.current) return;
        setIsChartDragging(true);
        setStartX(e.clientX);
        setStartScrollLeft(chartScrollRef.current.scrollLeft);
    };

    const handleChartMouseMove = (e: React.MouseEvent) => {
        if (!isChartDragging || !chartScrollRef.current) return;
        e.preventDefault();
        const walk = (e.clientX - startX) * 1.5;
        chartScrollRef.current.scrollLeft = startScrollLeft - walk;
    };

    const handleChartMouseUpOrLeave = () => {
        setIsChartDragging(false);
    };

    const scrollToPage = (pageIndex: number) => {
        if (chartScrollRef.current) {
            const width = chartScrollRef.current.clientWidth;
            chartScrollRef.current.scrollTo({ left: pageIndex * width, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#FFFBF4] text-[#1F2328] font-sans overflow-hidden">
            <Sidebar onSignOut={onSignOut} activePage="Reports" onPageChange={onPageChange} />

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto flex flex-col gap-8 h-full">
                {/* Header & Title Group */}
                <div className="flex flex-col gap-1">
                    {/* Top Header Row */}
                    <header className="flex items-center justify-between">
                        <HeaderDate />
                    </header>

                    {/* Page Title & Action Button */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-[#1F2328] tracking-tight">
                                Reports & Analytics
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 font-medium">
                                View and export detailed class attendance summary.
                            </p>
                        </div>

                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1F2328] text-white text-sm font-medium rounded-2xl shadow-sm hover:bg-black transition-all cursor-pointer">
                            <Download size={16} />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>

                {/* Section 1: Summary Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
                        <span className="text-xs font-bold text-gray-500">Semester Average</span>
                        <div className="text-4xl font-bold text-[#1F2328]">93.2%</div>
                        <div className="text-xs font-medium text-gray-400">
                            <span className="text-emerald-600 font-bold">+1.2%</span> vs last week
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
                        <span className="text-xs font-bold text-gray-500">Total Absences</span>
                        <div className="text-4xl font-bold text-[#1F2328]">24</div>
                        <div className="text-xs font-medium text-gray-400">
                            <span className="text-rose-500 font-bold">-12</span> vs last week
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
                        <span className="text-xs font-bold text-gray-500">Lowest Performing Class</span>
                        <div className="text-2xl md:text-3xl font-bold text-[#1F2328] tracking-tight">CCPGLANG - COM232</div>
                        <div className="text-xs font-medium text-gray-400">88% average</div>
                    </div>
                </div>

                {/* Section 2: Filters Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 max-w-xl">
                    {/* Report Type */}
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Report Type</label>
                        <Combobox
                            options={reportTypeOptions}
                            value={reportType}
                            onChange={setReportType}
                            placeholder="Select Here"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date Range</label>
                        <Combobox
                            options={dateRangeOptions}
                            value={dateRange}
                            onChange={setDateRange}
                            placeholder="Select Here"
                        />
                    </div>
                </div>

                {/* Section 3: Attendance Trend Chart Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-serif font-bold text-[#1F2328]">Attendance Trend</h2>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                                Across all sections over the 12-week semester
                            </p>
                        </div>
                        <Combobox
                            options={chartClassOptions}
                            value={chartClassFilter}
                            onChange={setChartClassFilter}
                            placeholder="All Classes"
                            className="bg-gray-100/80 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 w-auto min-w-[140px]"
                            iconSize={13}
                        />
                    </div>

                    {/* Snap Scrollable Chart Container for Weeks 1-6 & Weeks 7-12 */}
                    <div
                        ref={chartScrollRef}
                        onMouseDown={handleChartMouseDown}
                        onMouseMove={handleChartMouseMove}
                        onMouseUp={handleChartMouseUpOrLeave}
                        onMouseLeave={handleChartMouseUpOrLeave}
                        className="flex overflow-x-auto snap-x snap-mandatory pb-2 select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {/* Slide 1: Weeks 1-6 */}
                        <div className="w-full shrink-0 snap-start">
                            <ChartContainer config={trendConfig} className="h-64 w-full [&_svg]:overflow-visible">
                                <AreaChart
                                    accessibilityLayer
                                    data={trendData.slice(0, 6)}
                                    margin={{ left: 0, right: 20, top: 10, bottom: 0 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis
                                        dataKey="week"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        interval={0}
                                        padding={{ left: 15, right: 25 }}
                                        tick={{ fontSize: 12, fill: '#6B7280' }}
                                    />
                                    <YAxis
                                        domain={[87, 98]}
                                        ticks={[87, 90, 93, 96, 98]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <defs>
                                        <linearGradient id="fillTrend1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1F2937" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#1F2937" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        dataKey="rate"
                                        type="natural"
                                        fill="url(#fillTrend1)"
                                        fillOpacity={0.3}
                                        stroke="#1F2937"
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 5, fill: "#1F2937" }}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>

                        {/* Slide 2: Weeks 7-12 */}
                        <div className="w-full shrink-0 snap-start">
                            <ChartContainer config={trendConfig} className="h-64 w-full [&_svg]:overflow-visible">
                                <AreaChart
                                    accessibilityLayer
                                    data={trendData.slice(6, 12)}
                                    margin={{ left: 0, right: 20, top: 10, bottom: 0 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis
                                        dataKey="week"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        interval={0}
                                        padding={{ left: 15, right: 25 }}
                                        tick={{ fontSize: 12, fill: '#6B7280' }}
                                    />
                                    <YAxis
                                        domain={[87, 98]}
                                        ticks={[87, 90, 93, 96, 98]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <defs>
                                        <linearGradient id="fillTrend2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1F2937" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#1F2937" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        dataKey="rate"
                                        type="natural"
                                        fill="url(#fillTrend2)"
                                        fillOpacity={0.3}
                                        stroke="#1F2937"
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 5, fill: "#1F2937" }}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Custom Horizontal Scrollbar Control with Left & Right Arrows */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => scrollToPage(0)}
                            disabled={chartPage === 0}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 rounded-md transition-all cursor-pointer shrink-0"
                            title="Weeks 1-6"
                            aria-label="Weeks 1-6"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div
                            ref={trackRef}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            className="flex-1 h-2.5 bg-gray-100 hover:bg-gray-200/70 rounded-full relative cursor-grab active:cursor-grabbing select-none py-0.5 transition-colors touch-none"
                        >
                            <div
                                className="h-full bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded-full transition-transform duration-75 ease-out shadow-sm"
                                style={{
                                    width: '50%',
                                    transform: `translateX(${scrollProgress * 100}%)`,
                                }}
                            />
                        </div>

                        <button
                            onClick={() => scrollToPage(1)}
                            disabled={chartPage === 1}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 rounded-md transition-all cursor-pointer shrink-0"
                            title="Weeks 7-12"
                            aria-label="Weeks 7-12"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Section 4: Action Required Section */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="text-red-500 stroke-[2]" size={18} />
                            <h2 className="text-xl font-serif font-bold text-[#1F2328]">Action Required</h2>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                            Students whose absence rate exceeds 20% across their enrolled sections.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {actionStudents.map((student) => (
                            <div
                                key={student.id}
                                className="bg-[#F9F8F4] p-2.5 px-3.5 rounded-xl flex items-center justify-between hover:bg-[#F5F2EC] transition-all"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#1F2328]">{student.name}</span>
                                        <span className="text-[11px] text-gray-400 font-mono mt-0.5">
                                            {student.studentId} • {student.subject}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-red-500">{student.absenceRate}</span>
                                    <span className="text-[11px] text-gray-400 font-normal">{student.missedCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="px-5 py-2 bg-[#F5F2EC] hover:bg-gray-200/80 text-[#1F2328] text-[11px] font-bold rounded-full transition-all text-center mx-auto block cursor-pointer">
                        View All Required Actions (5)
                    </button>
                </div>
            </main>
        </div>
    );
}
