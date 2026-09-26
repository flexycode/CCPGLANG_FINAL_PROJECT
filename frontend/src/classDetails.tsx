import { useState } from 'react';
import { Search, UserPlus, UserMinus, Trash2, FileDown, ChevronDown, Check, Users, CheckCircle2, UserX, Clock, FileText } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HeaderDate from './components/HeaderDate';
import { TimePicker } from '@/components/ui/time-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { showToast } from '@/components/ui/toast';

interface ClassDetailsProps {
    onSignOut?: () => void;
    onPageChange?: (page: string) => void;
    classCode?: string;
    classNameTitle?: string;
    fullCode?: string;
}

interface Student {
    no: string;
    name: string;
    studentId: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused' | 'Select status';
    checkIn: string;
    remarks: string;
}

const initialStudents: Student[] = [
    { no: '01', name: 'Castro, James Adrian', studentId: '2022-348291', status: 'Present', checkIn: '2:59 PM', remarks: '' },
    { no: '02', name: 'Cunanan, Marco Polo', studentId: '2022-348291', status: 'Select status', checkIn: '', remarks: '' },
    { no: '03', name: 'Dela Rama, Rinoah Venedict', studentId: '2022-348291', status: 'Select status', checkIn: '', remarks: '' },
    { no: '04', name: 'Glodo, Jannah Cleine', studentId: '2022-348291', status: 'Absent', checkIn: '', remarks: 'Sick' },
    { no: '05', name: 'Marisga, Jersey Mae', studentId: '2022-348291', status: 'Late', checkIn: '', remarks: 'Traffic' },
    { no: '06', name: 'Poserio, Jed Nathan', studentId: '2022-348291', status: 'Present', checkIn: '', remarks: '' },
    { no: '07', name: 'Talosig, Jay Arre', studentId: '2022-348291', status: 'Select status', checkIn: '', remarks: '' },
];

const initialPointData: Record<string, { lates: number; absences: number; status: 'Pass' | 'Warning' | 'Fail'; weeks: { dots: string[] }[] }> = {
    '01': {
        lates: 0,
        absences: 0,
        status: 'Pass',
        weeks: [
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
        ],
    },
    '02': {
        lates: 1,
        absences: 3,
        status: 'Pass',
        weeks: [
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'red'] }, { dots: ['green', 'red'] }, { dots: ['orange', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'red'] },
        ],
    },
    '03': {
        lates: 4,
        absences: 2,
        status: 'Pass',
        weeks: [
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'orange'] },
            { dots: ['green', 'orange'] }, { dots: ['red', 'green'] }, { dots: ['orange', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'orange'] },
            { dots: ['green', 'orange'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
        ],
    },
    '04': {
        lates: 0,
        absences: 1,
        status: 'Pass',
        weeks: [
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['red', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
        ],
    },
    '05': {
        lates: 7,
        absences: 3,
        status: 'Pass',
        weeks: [
            { dots: ['orange', 'orange'] }, { dots: ['orange', 'orange'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['red', 'green'] }, { dots: ['orange', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['orange', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'orange'] }, { dots: ['green', 'green'] },
        ],
    },
    '06': {
        lates: 0,
        absences: 0,
        status: 'Pass',
        weeks: [
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
        ],
    },
    '07': {
        lates: 8,
        absences: 2,
        status: 'Pass',
        weeks: [
            { dots: ['green', 'green'] }, { dots: ['green', 'orange'] }, { dots: ['green', 'green'] },
            { dots: ['orange', 'orange'] }, { dots: ['green', 'orange'] }, { dots: ['orange', 'green'] },
            { dots: ['green', 'green'] }, { dots: ['green', 'green'] }, { dots: ['green', 'green'] },
            { dots: ['green', 'orange'] }, { dots: ['orange', 'green'] }, { dots: ['orange', 'green'] },
        ],
    },
};

function StatusCombobox({
    value,
    onChange,
}: {
    value: Student['status'];
    onChange: (status: Student['status']) => void;
}) {
    const [open, setOpen] = useState(false);

    const getStatusStyle = (val: Student['status']) => {
        switch (val) {
            case 'Present':
                return 'bg-[#E5F5EA] text-[#1E7E34] border border-[#B7E4C7] font-semibold hover:bg-[#D4EEDC] hover:border-[#95D5B2] shadow-2xs';
            case 'Absent':
                return 'bg-[#FCE8E7] text-[#D93838] border border-[#F8C4C4] font-semibold hover:bg-[#FAD4D2] hover:border-[#F49292] shadow-2xs';
            case 'Late':
                return 'bg-[#F4EF94] text-[#7A6800] border border-[#E5E080] font-semibold hover:bg-[#EAE480] hover:border-[#DDD775] shadow-2xs';
            case 'Excused':
                return 'bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE] font-semibold hover:bg-[#DDD6FE] hover:border-[#C4B5FD] shadow-2xs';
            default:
                return 'bg-gray-100/80 text-gray-500 border border-gray-200/90 font-medium hover:bg-gray-200/80 hover:border-gray-300 shadow-2xs';
        }
    };

    const options: Student['status'][] = ['Present', 'Absent', 'Late', 'Excused', 'Select status'];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={`px-4 py-1.5 rounded-full text-xs cursor-pointer focus:outline-none transition-all flex items-center justify-between gap-1.5 select-none min-w-[115px] ${getStatusStyle(
                        value
                    )}`}
                >
                    <span>{value}</span>
                    <ChevronDown size={14} className="opacity-60 shrink-0 ml-0.5" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-36 p-1 bg-white border border-gray-200/80 shadow-xl rounded-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5"
            >
                {options.map((opt) => {
                    const isSelected = value === opt;
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-1.5 text-xs rounded-xl transition-all w-full cursor-pointer text-left ${opt === 'Present'
                                ? 'hover:bg-[#E5F5EA] text-[#1E7E34] font-semibold'
                                : opt === 'Absent'
                                    ? 'hover:bg-[#FCE8E7] text-[#D93838] font-semibold'
                                    : opt === 'Late'
                                        ? 'hover:bg-[#F4EF94] text-[#7A6800] font-semibold'
                                        : opt === 'Excused'
                                            ? 'hover:bg-[#EDE9FE] text-[#6D28D9] font-semibold'
                                            : 'hover:bg-gray-100 text-gray-500 font-medium'
                                } ${isSelected ? 'bg-gray-100 font-bold' : ''}`}
                        >
                            <span>{opt}</span>
                            {isSelected && <Check size={13} className="shrink-0 ml-1 text-gray-800" />}
                        </button>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}

export default function ClassDetails({
    onSignOut,
    onPageChange,
    classCode = 'CCPGLANG',
    classNameTitle = 'Programming Languages',
    fullCode,
}: ClassDetailsProps) {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'daily' | 'points'>('daily');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [removeSearchQuery, setRemoveSearchQuery] = useState('');
    const [studentPendingRemoval, setStudentPendingRemoval] = useState<{ index: number; name: string; studentId: string } | null>(null);
    const [activeCardModal, setActiveCardModal] = useState<'Enrolled' | 'Present' | 'Absent' | 'Late' | 'Excused' | null>(null);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentId, setNewStudentId] = useState('');

    // Dynamic counts calculation based on students list state
    const totalEnrolled = 40;
    const presentCount = students.filter(s => s.status === 'Present').length + 33;
    const absentCount = students.filter(s => s.status === 'Absent').length + 4;
    const lateCount = students.filter(s => s.status === 'Late').length + 2;
    const excusedCount = students.filter(s => s.status === 'Excused').length;

    const filteredStudents = students.filter(
        s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentId.includes(searchQuery)
    );

    const getModalStudents = () => {
        if (!activeCardModal) return [];
        if (activeCardModal === 'Enrolled') return students;
        return students.filter(s => s.status === activeCardModal);
    };

    const modalStudentsList = getModalStudents();

    const handleStatusChange = (index: number, newStatus: Student['status']) => {
        const updated = [...students];
        updated[index].status = newStatus;
        if (newStatus === 'Present' && !updated[index].checkIn) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            updated[index].checkIn = `${hours}:${minutes} ${ampm}`;
        }
        setStudents(updated);
    };

    const handleRemarksChange = (index: number, remarks: string) => {
        const updated = [...students];
        updated[index].remarks = remarks;
        setStudents(updated);
    };

    const handleFormattedTimeChange = (index: number, formattedTime: string) => {
        const updated = [...students];
        updated[index].checkIn = formattedTime;
        if (updated[index].status === 'Select status') {
            updated[index].status = 'Present';
        }
        setStudents(updated);
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentName.trim()) return;
        const newNo = (students.length + 1).toString().padStart(2, '0');
        const addedName = newStudentName.trim();
        setStudents([
            ...students,
            {
                no: newNo,
                name: addedName,
                studentId: newStudentId.trim() || '2022-348291',
                status: 'Select status',
                checkIn: '',
                remarks: '',
            },
        ]);
        setNewStudentName('');
        setNewStudentId('');
        setShowAddModal(false);
        showToast(`Student "${addedName}" added successfully!`);
    };

    const handleRemoveStudent = (index: number) => {
        const target = students[index];
        const updated = students.filter((_, i) => i !== index);
        setStudents(updated);
        if (target) {
            showToast(`Student "${target.name}" removed successfully!`, 'info');
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#FFFBF4] text-[#1F2328] font-sans overflow-hidden">
            <Sidebar onSignOut={onSignOut} activePage={classCode} onPageChange={onPageChange} />

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto flex flex-col gap-7 h-full">
                {/* Header & Title Group */}
                <div className="flex flex-col gap-1">
                    <header className="flex items-center justify-between">
                        <HeaderDate />
                    </header>

                    <div>
                        <h1 className="text-4xl font-serif font-bold text-[#1F2328] tracking-tight">
                            {activeTab === 'points' ? 'Attendance Point' : classNameTitle}
                        </h1>
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                            {activeTab === 'points'
                                ? 'Manage daily student attendance and track semester point.'
                                : fullCode || `${classCode} - COM232`}
                        </p>
                    </div>
                </div>

                {/* Section 1: Soft Pastel Stat Cards Grid (5 Square Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Stat Card 1: Enrolled */}
                    <div
                        onClick={() => setActiveCardModal('Enrolled')}
                        className="bg-[#DFE7F1] p-5 rounded-[20px] aspect-square flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
                    >
                        <Users size={38} className="text-[#2B4C7E] stroke-[2]" />
                        <span className="text-3xl sm:text-4xl font-bold text-[#2B4C7E] leading-none">{totalEnrolled}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#2B4C7E] mt-0.5">Enrolled</span>
                    </div>

                    {/* Stat Card 2: Present */}
                    <div
                        onClick={() => setActiveCardModal('Present')}
                        className="bg-[#E5F5EA] p-5 rounded-[20px] aspect-square flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
                    >
                        <CheckCircle2 size={38} className="text-[#1E7E34] stroke-[2]" />
                        <span className="text-3xl sm:text-4xl font-bold text-[#1E7E34] leading-none">{presentCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#1E7E34] mt-0.5">Present</span>
                    </div>

                    {/* Stat Card 3: Absent */}
                    <div
                        onClick={() => setActiveCardModal('Absent')}
                        className="bg-[#FCE8E7] p-5 rounded-[20px] aspect-square flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
                    >
                        <UserX size={38} className="text-[#D93838] stroke-[2]" />
                        <span className="text-3xl sm:text-4xl font-bold text-[#D93838] leading-none">{absentCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#D93838] mt-0.5">Absent</span>
                    </div>

                    {/* Stat Card 4: Late */}
                    <div
                        onClick={() => setActiveCardModal('Late')}
                        className="bg-[#F4EF94] p-5 rounded-[20px] aspect-square flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
                    >
                        <Clock size={38} className="text-[#7A6800] stroke-[2]" />
                        <span className="text-3xl sm:text-4xl font-bold text-[#7A6800] leading-none">{lateCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#7A6800] mt-0.5">Late</span>
                    </div>

                    {/* Stat Card 5: Excused */}
                    <div
                        onClick={() => setActiveCardModal('Excused')}
                        className="bg-[#EDE9FE] p-5 rounded-[20px] aspect-square flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
                    >
                        <FileText size={38} className="text-[#6D28D9] stroke-[2]" />
                        <span className="text-3xl sm:text-4xl font-bold text-[#6D28D9] leading-none">{excusedCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#6D28D9] mt-0.5">Excused</span>
                    </div>
                </div>

                {/* Section 2: Attendees Heading & Controls */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-serif font-bold text-[#1F2328]">
                        {activeTab === 'points' ? 'Attendance Point' : 'Attendees'}
                    </h2>

                    {/* Controls Row 1: Search & Action Buttons */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-xl">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Quick search a student"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-full text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-[120px] py-2.5 bg-white border border-gray-200/80 hover:bg-gray-50 text-[#1F2328] text-xs font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserPlus size={16} />
                                <span>Add</span>
                            </button>
                            <button
                                onClick={() => setShowRemoveModal(true)}
                                className="w-[120px] py-2.5 bg-white border border-gray-200/80 hover:bg-gray-50 text-[#1F2328] text-xs font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserMinus size={16} />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls Row 2: Tabs & Export Button */}
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-1 mt-1">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`pb-2 text-xs font-bold transition-all relative ${activeTab === 'daily'
                                    ? 'text-[#1F2328] border-b-2 border-[#1F2328]'
                                    : 'text-gray-400 hover:text-gray-600 font-medium'
                                    }`}
                            >
                                Daily Record
                            </button>
                            <button
                                onClick={() => setActiveTab('points')}
                                className={`pb-2 text-xs transition-all ${activeTab === 'points'
                                    ? 'text-[#1F2328] font-bold border-b-2 border-[#1F2328]'
                                    : 'text-gray-400 hover:text-gray-600 font-medium'
                                    }`}
                            >
                                Attendance Point
                            </button>
                        </div>

                        <button className="px-5 py-2 bg-white border border-gray-200/80 hover:bg-gray-50 text-[#1F2328] text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer mb-1">
                            <FileDown size={15} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Section 3: Attendees Table Card */}
                {activeTab === 'daily' ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-semibold text-gray-400 border-b border-gray-100 pb-3">
                                        <th className="py-3 px-2 font-medium w-14">No.</th>
                                        <th className="py-3 px-2 font-medium">Student</th>
                                        <th className="py-3 px-2 font-medium w-40">Status</th>
                                        <th className="py-3 px-2 font-medium w-32">Check in</th>
                                        <th className="py-3 px-2 font-medium">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.no + student.name} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-2 text-xs text-gray-400 font-medium">{student.no}</td>
                                            <td className="py-4 px-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-[#1F2328]">{student.name}</span>
                                                    <span className="text-[11px] text-gray-400 font-mono mt-0.5">{student.studentId}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <StatusCombobox
                                                    value={student.status}
                                                    onChange={(newStatus) => handleStatusChange(index, newStatus)}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-2">
                                                    {student.checkIn ? (
                                                        <span className="text-xs font-semibold text-[#1F2328]">{student.checkIn}</span>
                                                    ) : null}
                                                    <TimePicker
                                                        value={student.checkIn}
                                                        onChange={(formatted) => handleFormattedTimeChange(index, formatted)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="relative flex items-center justify-between gap-1 group">
                                                    <input
                                                        type="text"
                                                        placeholder="Add remarks..."
                                                        value={student.remarks}
                                                        onChange={(e) => handleRemarksChange(index, e.target.value)}
                                                        className="w-full text-xs font-medium text-gray-700 bg-transparent border-none placeholder-gray-300 focus:outline-none focus:ring-0 pr-2"
                                                    />
                                                    {student.remarks ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemarksChange(index, '')}
                                                            title="Delete remarks"
                                                            className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shrink-0 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-100 text-xs font-medium text-gray-400">
                            Total students: {totalEnrolled}
                        </div>
                    </div>
                ) : (
                    /* Attendance Point View Table */
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between mb-6 animate-in fade-in duration-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-semibold text-gray-400 border-b border-gray-100 pb-3">
                                        <th className="py-3 px-2 font-medium w-12">No.</th>
                                        <th className="py-3 px-2 font-medium min-w-[180px]">Student</th>
                                        <th className="py-3 px-2 font-medium text-center">
                                            <div className="flex items-center justify-between gap-1 px-1">
                                                {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((w) => (
                                                    <span key={w} className="w-8 text-center text-[11px] font-semibold text-gray-400">
                                                        {w}
                                                    </span>
                                                ))}
                                            </div>
                                        </th>
                                        <th className="py-3 px-2 font-medium text-center w-16">Lates</th>
                                        <th className="py-3 px-2 font-medium text-center w-24">Absences</th>
                                        <th className="py-3 px-2 font-medium text-center w-28">Grade Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.map((student) => {
                                        const pointData = initialPointData[student.no] || {
                                            lates: 0,
                                            absences: 0,
                                            status: 'Pass',
                                            weeks: Array.from({ length: 12 }, () => ({ dots: ['green', 'green'] })),
                                        };
                                        const totalAbsences = pointData.absences + Math.floor(pointData.lates / 3);
                                        const isFailed = totalAbsences > 3;
                                        const statusText = isFailed ? 'Failed' : 'Pass';

                                        return (
                                            <tr key={student.no + student.name} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-2 text-xs text-gray-400 font-medium">{student.no}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#1F2328]">{student.name}</span>
                                                        <span className="text-[11px] text-gray-400 font-mono mt-0.5">{student.studentId}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center justify-between gap-1 px-1">
                                                        {pointData.weeks.map((w, wIdx) => (
                                                            <div key={wIdx} className="flex items-center gap-1 w-8 justify-center shrink-0">
                                                                {w.dots.map((dotColor, dIdx) => (
                                                                    <span
                                                                        key={dIdx}
                                                                         className={`w-2 h-2 rounded-full shrink-0 ${dotColor === 'green'
                                                                            ? 'bg-[#22C55E]'
                                                                            : dotColor === 'red'
                                                                                ? 'bg-[#EF4444]'
                                                                                : dotColor === 'orange'
                                                                                    ? 'bg-[#FEF200]'
                                                                                    : 'bg-[#8B5CF6]'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-center text-xs font-bold text-[#1F2328]">
                                                    {pointData.lates}
                                                </td>
                                                <td className="py-4 px-2 text-center text-xs font-medium text-[#1F2328]">
                                                    <span className={`font-bold ${isFailed ? 'text-[#D93838]' : 'text-[#1F2328]'}`}>{totalAbsences}</span>
                                                    <span className="text-gray-400 font-normal"> / 3</span>
                                                </td>
                                                <td className="py-4 px-2 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${isFailed
                                                        ? 'bg-[#FCE8E7] text-[#D93838]'
                                                        : 'bg-[#E5F5EA] text-[#1E7E34]'
                                                        }`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend Footer */}
                        <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                            <div>
                                Showing <strong className="text-[#1F2328] font-bold">{filteredStudents.length}</strong> students
                            </div>

                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                                    <span>Present</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                                    <span>Absent</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FEF200]" />
                                    <span>Late</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                                    <span>Excuse</span>
                                </div>
                            </div>

                            <div className="text-gray-400 italic text-[11px]">
                                Note: 3 Lates = 1 Absence
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-serif font-bold text-[#1F2328]">Add Student</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-black text-xl font-bold"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500">Student Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Santos, Maria Clara"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500">Student ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2022-348291"
                                    value={newStudentId}
                                    onChange={(e) => setNewStudentId(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#1F2328] hover:bg-black rounded-xl shadow-sm cursor-pointer"
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Remove Student Selection Modal */}
            {showRemoveModal && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh]">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <UserMinus size={20} className="text-red-500" />
                                <h3 className="text-lg font-serif font-bold text-[#1F2328]">Remove Student</h3>
                            </div>
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="text-gray-400 hover:text-black text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 font-medium">
                            Select a student from the list below to remove them from this class subject.
                        </p>

                        {/* Search Bar inside Modal */}
                        <div className="relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search student to remove..."
                                value={removeSearchQuery}
                                onChange={(e) => setRemoveSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                        </div>

                        {/* Student selection list */}
                        <div className="overflow-y-auto max-h-[40vh] flex flex-col gap-2 pr-1 divide-y divide-gray-100">
                            {students.filter(s => s.name.toLowerCase().includes(removeSearchQuery.toLowerCase()) || s.studentId.includes(removeSearchQuery)).length > 0 ? (
                                students
                                    .filter(s => s.name.toLowerCase().includes(removeSearchQuery.toLowerCase()) || s.studentId.includes(removeSearchQuery))
                                    .map((student) => {
                                        const originalIndex = students.findIndex(s => s.studentId === student.studentId && s.name === student.name);
                                        return (
                                            <div key={student.no + student.name} className="pt-2.5 first:pt-0 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                                                        {student.no}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#1F2328]">{student.name}</span>
                                                        <span className="text-[11px] text-gray-400 font-mono">{student.studentId}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setStudentPendingRemoval({
                                                            index: originalIndex,
                                                            name: student.name,
                                                            studentId: student.studentId,
                                                        });
                                                    }}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="py-6 text-center text-xs text-gray-400 font-medium">
                                    No students found matching "{removeSearchQuery}".
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end border-t border-gray-100 pt-3">
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#1F2328] hover:bg-black rounded-xl shadow-sm cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog Modal for Removal */}
            {studentPendingRemoval && (
                <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-serif font-bold text-[#1F2328]">Confirm Removal</h3>
                                <p className="text-[11px] text-gray-400 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                            Are you sure you want to remove <strong className="text-[#1F2328] font-bold">{studentPendingRemoval.name}</strong> ({studentPendingRemoval.studentId}) from {classNameTitle}?
                        </p>

                        <div className="flex items-center justify-end gap-2 mt-1">
                            <button
                                onClick={() => setStudentPendingRemoval(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleRemoveStudent(studentPendingRemoval.index);
                                    setStudentPendingRemoval(null);
                                }}
                                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                                Confirm Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stat Card Summary Pop-out Modal */}
            {activeCardModal && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-5 max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${activeCardModal === 'Present' ? 'bg-[#E5F5EA] text-[#1E7E34]' :
                                    activeCardModal === 'Absent' ? 'bg-[#FCE8E7] text-[#D93838]' :
                                        activeCardModal === 'Late' ? 'bg-[#FEF200] text-[#7A6800]' :
                                            activeCardModal === 'Excused' ? 'bg-[#EDE9FE] text-[#6D28D9]' :
                                                'bg-[#DFE7F1] text-[#1F2328]'
                                    }`}>
                                    {activeCardModal}
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#1F2328]">
                                        {activeCardModal} Students Summary
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                                        {modalStudentsList.length} student{modalStudentsList.length === 1 ? '' : 's'} listed
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveCardModal(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black font-bold text-lg transition-colors cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Students List in Modal */}
                        <div className="overflow-y-auto max-h-[50vh] pr-1 flex flex-col gap-2.5 divide-y divide-gray-100">
                            {modalStudentsList.length > 0 ? (
                                modalStudentsList.map((student) => (
                                    <div key={student.no + student.name} className="pt-2.5 first:pt-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                                                {student.no}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#1F2328]">{student.name}</span>
                                                <span className="text-[11px] text-gray-400 font-mono">{student.studentId}</span>
                                            </div>
                                        </div>

                                        {activeCardModal !== 'Enrolled' && (
                                            <div className="flex items-center gap-4">
                                                <div className="text-right flex flex-col justify-center my-auto">
                                                    {student.checkIn && (
                                                        <span className="text-xs font-semibold text-[#1F2328] leading-tight">{student.checkIn}</span>
                                                    )}
                                                    {student.remarks && (
                                                        <span className="text-xs font-semibold text-gray-400 leading-tight">{student.remarks}</span>
                                                    )}
                                                </div>
                                                <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold min-w-[95px] text-center shrink-0 flex items-center justify-center ${student.status === 'Present' ? 'bg-[#E5F5EA] text-[#1E7E34]' :
                                                    student.status === 'Absent' ? 'bg-[#FCE8E7] text-[#D93838]' :
                                                        student.status === 'Late' ? 'bg-[#FEF200] text-[#7A6800]' :
                                                            student.status === 'Excused' ? 'bg-[#EDE9FE] text-[#6D28D9]' :
                                                                'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-xs text-gray-400 font-medium">
                                    No students currently marked as {activeCardModal}.
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                            <button
                                onClick={() => setActiveCardModal(null)}
                                className="px-5 py-2 bg-[#1F2328] hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
