import { useState } from 'react';
import { Search, UserPlus, UserMinus, Trash2, FileDown, ChevronDown, Check, Users, CheckCircle2, UserX, Clock, FileText } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HeaderDate from './components/HeaderDate';
import { TimePicker } from '@/components/ui/time-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { showToast } from '@/components/ui/toast';
import { addNotification } from './utils/notifications';

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

const initialStudentsByClass: Record<string, Student[]> = {
    CCPGLANG: [
        { no: '01', name: 'Castro, James Adrian', studentId: '2022-348291', status: 'Present', checkIn: '2:59 PM', remarks: '' },
        { no: '02', name: 'Cunanan, Marco Polo', studentId: '2022-340291', status: 'Select status', checkIn: '', remarks: '' },
        { no: '03', name: 'Dela Rama, Rinoah Venedict', studentId: '2022-348291', status: 'Select status', checkIn: '', remarks: '' },
        { no: '04', name: 'Glodo, Jannah Cleine', studentId: '2022-348291', status: 'Absent', checkIn: '', remarks: 'Sick' },
        { no: '05', name: 'Marisga, Jersey Mae', studentId: '2022-348291', status: 'Late', checkIn: '', remarks: 'Traffic' },
        { no: '06', name: 'Poserio, Jed Nathan', studentId: '2022-340291', status: 'Present', checkIn: '', remarks: '' },
        { no: '07', name: 'Talosig, Jay Arre', studentId: '2022-340291', status: 'Select status', checkIn: '', remarks: '' },
    ],
    CCINTHCI: [
        { no: '01', name: 'Castro, James Adrian', studentId: '2022-348291', status: 'Present', checkIn: '8:05 AM', remarks: '' },
        { no: '02', name: 'Cunanan, Marco Polo', studentId: '2022-340291', status: 'Present', checkIn: '8:10 AM', remarks: '' },
        { no: '03', name: 'Dela Rama, Rinoah Venedict', studentId: '2022-348291', status: 'Absent', checkIn: '', remarks: 'Family emergency' },
        { no: '04', name: 'Glodo, Jannah Cleine', studentId: '2022-348291', status: 'Present', checkIn: '8:02 AM', remarks: '' },
        { no: '05', name: 'Marisga, Jersey Mae', studentId: '2022-348291', status: 'Late', checkIn: '8:35 AM', remarks: 'Bus delay' },
        { no: '06', name: 'Poserio, Jed Nathan', studentId: '2022-340291', status: 'Present', checkIn: '8:00 AM', remarks: '' },
        { no: '07', name: 'Talosig, Jay Arre', studentId: '2022-340291', status: 'Excused', checkIn: '', remarks: 'Student council meeting' },
    ],
    CCAUTOMATA: [
        { no: '01', name: 'Castro, James Adrian', studentId: '2022-348291', status: 'Present', checkIn: '10:00 AM', remarks: '' },
        { no: '02', name: 'Cunanan, Marco Polo', studentId: '2022-340291', status: 'Late', checkIn: '10:25 AM', remarks: 'Heavy traffic' },
        { no: '03', name: 'Dela Rama, Rinoah Venedict', studentId: '2022-348291', status: 'Present', checkIn: '10:02 AM', remarks: '' },
        { no: '04', name: 'Glodo, Jannah Cleine', studentId: '2022-348291', status: 'Present', checkIn: '10:05 AM', remarks: '' },
        { no: '05', name: 'Marisga, Jersey Mae', studentId: '2022-348291', status: 'Absent', checkIn: '', remarks: 'Medical checkup' },
        { no: '06', name: 'Poserio, Jed Nathan', studentId: '2022-340291', status: 'Present', checkIn: '10:01 AM', remarks: '' },
        { no: '07', name: 'Talosig, Jay Arre', studentId: '2022-340291', status: 'Present', checkIn: '10:12 AM', remarks: '' },
    ],
    CCDATRCL: [
        { no: '01', name: 'Castro, James Adrian', studentId: '2022-348291', status: 'Present', checkIn: '1:00 PM', remarks: '' },
        { no: '02', name: 'Cunanan, Marco Polo', studentId: '2022-340291', status: 'Present', checkIn: '1:05 PM', remarks: '' },
        { no: '03', name: 'Dela Rama, Rinoah Venedict', studentId: '2022-348291', status: 'Present', checkIn: '1:03 PM', remarks: '' },
        { no: '04', name: 'Glodo, Jannah Cleine', studentId: '2022-348291', status: 'Absent', checkIn: '', remarks: 'Fever' },
        { no: '05', name: 'Marisga, Jersey Mae', studentId: '2022-348291', status: 'Late', checkIn: '1:20 PM', remarks: 'Train delay' },
        { no: '06', name: 'Poserio, Jed Nathan', studentId: '2022-340291', status: 'Present', checkIn: '1:01 PM', remarks: '' },
        { no: '07', name: 'Talosig, Jay Arre', studentId: '2022-340291', status: 'Present', checkIn: '1:08 PM', remarks: '' },
    ],
};

const getInitialStudentsForClass = (code: string): Student[] => {
    const normalized = code === 'CCAUTOMA' ? 'CCAUTOMATA' : code;
    try {
        const saved = localStorage.getItem(`checkmate_students_${normalized}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // fallback to defaults
    }
    return initialStudentsByClass[normalized] || initialStudentsByClass['CCPGLANG'];
};

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
                return 'bg-[#E5F5EA] dark:bg-[#132E1D] text-[#1E7E34] dark:text-[#86EFAC] border border-[#B7E4C7] dark:border-[#1E7E34]/50 font-semibold hover:bg-[#D4EEDC] dark:hover:bg-[#1A3D27] shadow-2xs';
            case 'Absent':
                return 'bg-[#FCE8E7] dark:bg-[#341619] text-[#D93838] dark:text-[#FCA5A5] border border-[#F8C4C4] dark:border-[#D93838]/50 font-semibold hover:bg-[#FAD4D2] dark:hover:bg-[#451C20] shadow-2xs';
            case 'Late':
                return 'bg-[#F4EF94] dark:bg-[#322A0C] text-[#7A6800] dark:text-[#FDE047] border border-[#E5E080] dark:border-[#EAB308]/50 font-semibold hover:bg-[#EAE480] dark:hover:bg-[#453A10] shadow-2xs';
            case 'Excused':
                return 'bg-[#EDE9FE] dark:bg-[#271945] text-[#6D28D9] dark:text-[#D8B4FE] border border-[#DDD6FE] dark:border-[#8B5CF6]/50 font-semibold hover:bg-[#DDD6FE] dark:hover:bg-[#35225E] shadow-2xs';
            default:
                return 'bg-gray-100/80 dark:bg-white/10 text-gray-500 dark:text-gray-300 border border-gray-200/90 dark:border-white/10 font-medium hover:bg-gray-200/80 dark:hover:bg-white/15 shadow-2xs';
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
                className="w-36 p-1 bg-white dark:bg-[#16213e] border border-gray-200/80 dark:border-white/10 shadow-xl rounded-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5 text-gray-900 dark:text-gray-100"
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
                                ? 'hover:bg-[#E5F5EA] dark:hover:bg-emerald-950/50 text-[#1E7E34] dark:text-emerald-400 font-semibold'
                                : opt === 'Absent'
                                    ? 'hover:bg-[#FCE8E7] dark:hover:bg-red-950/50 text-[#D93838] dark:text-red-400 font-semibold'
                                    : opt === 'Late'
                                        ? 'hover:bg-[#F4EF94] dark:hover:bg-amber-950/50 text-[#7A6800] dark:text-yellow-400 font-semibold'
                                        : opt === 'Excused'
                                            ? 'hover:bg-[#EDE9FE] dark:hover:bg-purple-950/50 text-[#6D28D9] dark:text-purple-400 font-semibold'
                                            : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 font-medium'
                                } ${isSelected ? 'bg-gray-100 dark:bg-white/15 font-bold' : ''}`}
                        >
                            <span>{opt}</span>
                            {isSelected && <Check size={13} className="shrink-0 ml-1 text-gray-800 dark:text-white" />}
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
    const normalizedCode = classCode === 'CCAUTOMA' ? 'CCAUTOMATA' : classCode;
    const [students, setStudents] = useState<Student[]>(() => getInitialStudentsForClass(normalizedCode));
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'daily' | 'points'>('daily');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [removeSearchQuery, setRemoveSearchQuery] = useState('');
    const [studentPendingRemoval, setStudentPendingRemoval] = useState<{ no: string; name: string; studentId: string } | null>(null);
    const [activeCardModal, setActiveCardModal] = useState<'Enrolled' | 'Present' | 'Absent' | 'Late' | 'Excused' | null>(null);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentId, setNewStudentId] = useState('');

    const saveClassStudents = (updated: Student[]) => {
        try {
            localStorage.setItem(`checkmate_students_${normalizedCode}`, JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    // Truly dynamic counts calculation synchronized with the class's enrolled students list
    const totalEnrolled = students.length;
    const presentCount = students.filter(s => s.status === 'Present').length;
    const absentCount = students.filter(s => s.status === 'Absent').length;
    const lateCount = students.filter(s => s.status === 'Late').length;
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

    const handleStatusChange = (studentNo: string, newStatus: Student['status']) => {
        const updated = students.map(s => {
            if (s.no === studentNo) {
                const sCopy = { ...s, status: newStatus };
                if (newStatus === 'Present' && !sCopy.checkIn) {
                    const now = new Date();
                    let hours = now.getHours();
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    sCopy.checkIn = `${hours}:${minutes} ${ampm}`;
                }
                return sCopy;
            }
            return s;
        });
        setStudents(updated);
        saveClassStudents(updated);
    };

    const handleRemarksChange = (studentNo: string, remarks: string) => {
        const updated = students.map(s => s.no === studentNo ? { ...s, remarks } : s);
        setStudents(updated);
        saveClassStudents(updated);
    };

    const handleFormattedTimeChange = (studentNo: string, formattedTime: string) => {
        const updated = students.map(s => {
            if (s.no === studentNo) {
                const sCopy = { ...s, checkIn: formattedTime };
                if (sCopy.status === 'Select status') {
                    sCopy.status = 'Present';
                }
                return sCopy;
            }
            return s;
        });
        setStudents(updated);
        saveClassStudents(updated);
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentName.trim()) return;
        const newNo = (students.length + 1).toString().padStart(2, '0');
        const addedName = newStudentName.trim();
        const newStudent: Student = {
            no: newNo,
            name: addedName,
            studentId: newStudentId.trim() || '2022-348291',
            status: 'Select status',
            checkIn: '',
            remarks: '',
        };
        const updated = [...students, newStudent];
        setStudents(updated);
        saveClassStudents(updated);
        setNewStudentName('');
        setNewStudentId('');
        setShowAddModal(false);
        showToast(`Student "${addedName}" added successfully!`);
        addNotification(
            'New Student Enrolled',
            `Student "${addedName}" (${newStudent.studentId}) was enrolled into ${classNameTitle}.`,
            'student'
        );
    };

    const handleRemoveStudent = (studentNo: string) => {
        const target = students.find(s => s.no === studentNo);
        const updated = students
            .filter(s => s.no !== studentNo)
            .map((s, idx) => ({ ...s, no: (idx + 1).toString().padStart(2, '0') }));
        setStudents(updated);
        saveClassStudents(updated);
        if (target) {
            showToast(`Student "${target.name}" removed successfully!`, 'info');
            addNotification(
                'Student Removed',
                `Student "${target.name}" (${target.studentId}) was removed from ${classNameTitle}.`,
                'warning'
            );
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#FFFBF4] dark:bg-[#0B132B] text-[#1F2328] dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
            <Sidebar onSignOut={onSignOut} activePage={classCode} onPageChange={onPageChange} />

            {/* Main Content Area - Fluid & Widespread for all devices */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 pt-16 md:pt-8 overflow-y-auto w-full max-w-[1700px] 2xl:max-w-[1920px] mx-auto flex flex-col gap-6 md:gap-7 h-full">
                {/* Header & Title Group */}
                <div className="flex flex-col gap-2">
                    <header className="flex items-center justify-between w-full">
                        <HeaderDate />
                    </header>

                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1F2328] dark:text-white tracking-tight">
                            {activeTab === 'points' ? 'Attendance Point' : classNameTitle}
                        </h1>
                        <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
                            {activeTab === 'points'
                                ? 'Manage daily student attendance and track semester point.'
                                : fullCode || `${classCode} - COM232`}
                        </p>
                    </div>
                </div>

                {/* Section 1: Soft Pastel Stat Cards Grid (5 Responsive Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
                    {/* Stat Card 1: Enrolled */}
                    <div
                        onClick={() => setActiveCardModal('Enrolled')}
                        className="bg-[#DFE7F1] dark:bg-[#192740] dark:border dark:border-[#2B4C7E]/40 p-4 sm:p-5 rounded-[22px] flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none min-h-[115px] sm:min-h-[130px]"
                    >
                        <Users className="w-8 h-8 sm:w-9 sm:h-9 text-[#2B4C7E] dark:text-[#93C5FD] stroke-[2]" />
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B4C7E] dark:text-[#93C5FD] leading-none">{totalEnrolled}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#2B4C7E] dark:text-[#93C5FD] mt-0.5">Enrolled</span>
                    </div>

                    {/* Stat Card 2: Present */}
                    <div
                        onClick={() => setActiveCardModal('Present')}
                        className="bg-[#E5F5EA] dark:bg-[#132E1D] dark:border dark:border-[#1E7E34]/40 p-4 sm:p-5 rounded-[22px] flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none min-h-[115px] sm:min-h-[130px]"
                    >
                        <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-[#1E7E34] dark:text-[#86EFAC] stroke-[2]" />
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E7E34] dark:text-[#86EFAC] leading-none">{presentCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#1E7E34] dark:text-[#86EFAC] mt-0.5">Present</span>
                    </div>

                    {/* Stat Card 3: Absent */}
                    <div
                        onClick={() => setActiveCardModal('Absent')}
                        className="bg-[#FCE8E7] dark:bg-[#341619] dark:border dark:border-[#D93838]/40 p-4 sm:p-5 rounded-[22px] flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none min-h-[115px] sm:min-h-[130px]"
                    >
                        <UserX className="w-8 h-8 sm:w-9 sm:h-9 text-[#D93838] dark:text-[#FCA5A5] stroke-[2]" />
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D93838] dark:text-[#FCA5A5] leading-none">{absentCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#D93838] dark:text-[#FCA5A5] mt-0.5">Absent</span>
                    </div>

                    {/* Stat Card 4: Late */}
                    <div
                        onClick={() => setActiveCardModal('Late')}
                        className="bg-[#F4EF94] dark:bg-[#322A0C] dark:border dark:border-[#EAB308]/40 p-4 sm:p-5 rounded-[22px] flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none min-h-[115px] sm:min-h-[130px]"
                    >
                        <Clock className="w-8 h-8 sm:w-9 sm:h-9 text-[#7A6800] dark:text-[#FDE047] stroke-[2]" />
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7A6800] dark:text-[#FDE047] leading-none">{lateCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#7A6800] dark:text-[#FDE047] mt-0.5">Late</span>
                    </div>

                    {/* Stat Card 5: Excused */}
                    <div
                        onClick={() => setActiveCardModal('Excused')}
                        className="col-span-2 sm:col-span-1 bg-[#EDE9FE] dark:bg-[#271945] dark:border dark:border-[#8B5CF6]/40 p-4 sm:p-5 rounded-[22px] flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none min-h-[115px] sm:min-h-[130px]"
                    >
                        <FileText className="w-8 h-8 sm:w-9 sm:h-9 text-[#6D28D9] dark:text-[#D8B4FE] stroke-[2]" />
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6D28D9] dark:text-[#D8B4FE] leading-none">{excusedCount}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#6D28D9] dark:text-[#D8B4FE] mt-0.5">Excused</span>
                    </div>
                </div>

                {/* Section 2: Attendees Heading & Controls */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-serif font-bold text-[#1F2328] dark:text-white">
                        {activeTab === 'points' ? 'Attendance Point' : 'Attendees'}
                    </h2>

                    {/* Controls Row 1: Search & Action Buttons */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-xl">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Quick search a student"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#151D2A] border border-gray-200/80 dark:border-white/10 rounded-full text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-blue-500 shadow-sm transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-[120px] py-2.5 bg-white dark:bg-[#151D2A] border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1E293B] text-[#1F2328] dark:text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserPlus size={16} />
                                <span>Add</span>
                            </button>
                            <button
                                onClick={() => setShowRemoveModal(true)}
                                className="w-[120px] py-2.5 bg-white dark:bg-[#151D2A] border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1E293B] text-[#1F2328] dark:text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserMinus size={16} />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls Row 2: Tabs & Export Button */}
                    <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-white/10 pb-1 mt-1">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`pb-2 text-xs font-bold transition-all relative cursor-pointer ${activeTab === 'daily'
                                    ? 'text-[#1F2328] dark:text-white border-b-2 border-[#1F2328] dark:border-blue-400'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium'
                                    }`}
                            >
                                Daily Record
                            </button>
                            <button
                                onClick={() => setActiveTab('points')}
                                className={`pb-2 text-xs transition-all cursor-pointer ${activeTab === 'points'
                                    ? 'text-[#1F2328] dark:text-white font-bold border-b-2 border-[#1F2328] dark:border-blue-400'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium'
                                    }`}
                            >
                                Attendance Point
                            </button>
                        </div>

                        <button className="px-5 py-2 bg-white dark:bg-[#151D2A] border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1E293B] text-[#1F2328] dark:text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer mb-1">
                            <FileDown size={15} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Section 3: Attendees Table Card */}
                {activeTab === 'daily' ? (
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-4 sm:p-6 flex flex-col justify-between mb-6">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[580px] text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 border-b border-gray-100 dark:border-white/10 pb-3">
                                        <th className="py-3 px-2 font-medium w-14">No.</th>
                                        <th className="py-3 px-2 font-medium">Student</th>
                                        <th className="py-3 px-2 font-medium w-40">Status</th>
                                        <th className="py-3 px-2 font-medium w-32">Check in</th>
                                        <th className="py-3 px-2 font-medium">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.no + student.name} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-2 text-xs text-gray-400 dark:text-gray-500 font-medium">{student.no}</td>
                                            <td className="py-4 px-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-[#1F2328] dark:text-white">{student.name}</span>
                                                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{student.studentId}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <StatusCombobox
                                                    value={student.status}
                                                    onChange={(newStatus) => handleStatusChange(student.no, newStatus)}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-2">
                                                    {student.checkIn ? (
                                                        <span className="text-xs font-semibold text-[#1F2328] dark:text-gray-200">{student.checkIn}</span>
                                                    ) : null}
                                                    <TimePicker
                                                        value={student.checkIn}
                                                        onChange={(formatted) => handleFormattedTimeChange(student.no, formatted)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="relative flex items-center justify-between gap-1 group">
                                                    <input
                                                        type="text"
                                                        placeholder="Add remarks..."
                                                        value={student.remarks}
                                                        onChange={(e) => handleRemarksChange(student.no, e.target.value)}
                                                        className="w-full text-xs font-medium text-gray-700 dark:text-gray-200 bg-transparent border-none placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-0 pr-2"
                                                    />
                                                    {student.remarks ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemarksChange(student.no, '')}
                                                            title="Delete remarks"
                                                            className="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer shrink-0 flex items-center gap-1"
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

                        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10 text-xs font-medium text-gray-400 dark:text-gray-500">
                            Total students: {totalEnrolled}
                        </div>
                    </div>
                ) : (
                    /* Attendance Point View Table */
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-4 sm:p-6 flex flex-col justify-between mb-6 animate-in fade-in duration-200">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[760px] text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 border-b border-gray-100 dark:border-white/10 pb-3">
                                        <th className="py-3 px-2 font-medium w-12">No.</th>
                                        <th className="py-3 px-2 font-medium min-w-[180px]">Student</th>
                                        <th className="py-3 px-2 font-medium text-center">
                                            <div className="flex items-center justify-between gap-1 px-1">
                                                {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((w) => (
                                                    <span key={w} className="w-8 text-center text-[11px] font-semibold text-gray-400 dark:text-gray-400">
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
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
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
                                            <tr key={student.no + student.name} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-2 text-xs text-gray-400 dark:text-gray-500 font-medium">{student.no}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#1F2328] dark:text-white">{student.name}</span>
                                                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{student.studentId}</span>
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
                                                <td className="py-4 px-2 text-center text-xs font-bold text-[#1F2328] dark:text-white">
                                                    {pointData.lates}
                                                </td>
                                                <td className="py-4 px-2 text-center text-xs font-medium text-[#1F2328] dark:text-white">
                                                    <span className={`font-bold ${isFailed ? 'text-[#D93838] dark:text-red-400' : 'text-[#1F2328] dark:text-white'}`}>{totalAbsences}</span>
                                                    <span className="text-gray-400 dark:text-gray-500 font-normal"> / 3</span>
                                                </td>
                                                <td className="py-4 px-2 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${isFailed
                                                        ? 'bg-[#FCE8E7] dark:bg-red-950/50 text-[#D93838] dark:text-red-400'
                                                        : 'bg-[#E5F5EA] dark:bg-emerald-950/50 text-[#1E7E34] dark:text-emerald-400'
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
                        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div>
                                Showing <strong className="text-[#1F2328] dark:text-white font-bold">{filteredStudents.length}</strong> students
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

                            <div className="text-gray-400 dark:text-gray-500 italic text-[11px]">
                                Note: 3 Lates = 1 Absence
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-serif font-bold text-[#1F2328] dark:text-white">Add Student</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Student Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Santos, Maria Clara"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Student ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2022-348291"
                                    value={newStudentId}
                                    onChange={(e) => setNewStudentId(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#1F2328] dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
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
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] border border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                            <div className="flex items-center gap-2.5">
                                <UserMinus size={20} className="text-red-500" />
                                <h3 className="text-lg font-serif font-bold text-[#1F2328] dark:text-white">Remove Student</h3>
                            </div>
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-blue-500"
                            />
                        </div>

                        {/* Student selection list */}
                        <div className="overflow-y-auto max-h-[40vh] flex flex-col gap-2 pr-1 divide-y divide-gray-100 dark:divide-white/5">
                            {students.filter(s => s.name.toLowerCase().includes(removeSearchQuery.toLowerCase()) || s.studentId.includes(removeSearchQuery)).length > 0 ? (
                                students
                                    .filter(s => s.name.toLowerCase().includes(removeSearchQuery.toLowerCase()) || s.studentId.includes(removeSearchQuery))
                                    .map((student) => {
                                        return (
                                            <div key={student.no + student.name} className="pt-2.5 first:pt-0 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-xs shrink-0">
                                                        {student.no}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#1F2328] dark:text-white">{student.name}</span>
                                                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">{student.studentId}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setStudentPendingRemoval({
                                                            no: student.no,
                                                            name: student.name,
                                                            studentId: student.studentId,
                                                        });
                                                    }}
                                                    className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
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

                        <div className="flex items-center justify-end border-t border-gray-100 dark:border-white/10 pt-3">
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#1F2328] dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
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
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 border border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-serif font-bold text-[#1F2328] dark:text-white">Confirm Removal</h3>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/10">
                            Are you sure you want to remove <strong className="text-[#1F2328] dark:text-white font-bold">{studentPendingRemoval.name}</strong> ({studentPendingRemoval.studentId}) from {classNameTitle}?
                        </p>

                        <div className="flex items-center justify-end gap-2 mt-1">
                            <button
                                onClick={() => setStudentPendingRemoval(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleRemoveStudent(studentPendingRemoval.no);
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
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-5 max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${activeCardModal === 'Present' ? 'bg-[#E5F5EA] dark:bg-emerald-950/50 text-[#1E7E34] dark:text-emerald-400' :
                                    activeCardModal === 'Absent' ? 'bg-[#FCE8E7] dark:bg-red-950/50 text-[#D93838] dark:text-red-400' :
                                        activeCardModal === 'Late' ? 'bg-[#FEF200] dark:bg-amber-950/50 text-[#7A6800] dark:text-yellow-400' :
                                            activeCardModal === 'Excused' ? 'bg-[#EDE9FE] dark:bg-purple-950/50 text-[#6D28D9] dark:text-purple-400' :
                                                'bg-[#DFE7F1] dark:bg-blue-950/50 text-[#1F2328] dark:text-blue-300'
                                    }`}>
                                    {activeCardModal}
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#1F2328] dark:text-white">
                                        {activeCardModal} Students Summary
                                    </h3>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                                        {modalStudentsList.length} student{modalStudentsList.length === 1 ? '' : 's'} listed
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveCardModal(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold text-lg transition-colors cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Students List in Modal */}
                        <div className="overflow-y-auto max-h-[50vh] pr-1 flex flex-col gap-2.5 divide-y divide-gray-100 dark:divide-white/5">
                            {modalStudentsList.length > 0 ? (
                                modalStudentsList.map((student) => (
                                    <div key={student.no + student.name} className="pt-2.5 first:pt-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-xs shrink-0">
                                                {student.no}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#1F2328] dark:text-white">{student.name}</span>
                                                <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">{student.studentId}</span>
                                            </div>
                                        </div>

                                        {activeCardModal !== 'Enrolled' && (
                                            <div className="flex items-center gap-4">
                                                <div className="text-right flex flex-col justify-center my-auto">
                                                    {student.checkIn && (
                                                        <span className="text-xs font-semibold text-[#1F2328] dark:text-gray-200 leading-tight">{student.checkIn}</span>
                                                    )}
                                                    {student.remarks && (
                                                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-tight">{student.remarks}</span>
                                                    )}
                                                </div>
                                                <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold min-w-[95px] text-center shrink-0 flex items-center justify-center ${student.status === 'Present' ? 'bg-[#E5F5EA] dark:bg-emerald-950/50 text-[#1E7E34] dark:text-emerald-400' :
                                                    student.status === 'Absent' ? 'bg-[#FCE8E7] dark:bg-red-950/50 text-[#D93838] dark:text-red-400' :
                                                        student.status === 'Late' ? 'bg-[#FEF200] dark:bg-amber-950/50 text-[#7A6800] dark:text-yellow-400' :
                                                            student.status === 'Excused' ? 'bg-[#EDE9FE] dark:bg-purple-950/50 text-[#6D28D9] dark:text-purple-400' :
                                                                'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300'
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

                        <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-end">
                            <button
                                onClick={() => setActiveCardModal(null)}
                                className="px-5 py-2 bg-[#1F2328] dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
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
