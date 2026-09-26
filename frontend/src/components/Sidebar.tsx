import { useState, useEffect } from 'react';
import { LayoutGrid, FileText, BookOpen, Plus, LogOut, ChevronLeft, Trash2 } from 'lucide-react';
import { showToast } from './ui/toast';
import logo from '../assets/checkmate_logo.jpg';

interface SidebarProps {
    onSignOut?: () => void;
    activePage?: string;
    onPageChange?: (pageName: string) => void;
}

export default function Sidebar({ onSignOut, activePage = 'Overview', onPageChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState(activePage);
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newClassCode, setNewClassCode] = useState('');
    const [classPendingRemoval, setClassPendingRemoval] = useState<{ index: number; name: string; code: string } | null>(null);

    const [avatarUrl, setAvatarUrl] = useState<string>(
        () => localStorage.getItem('userAvatar') || '/images/teacher.png'
    );

    useEffect(() => {
        const syncAvatar = () => {
            const saved = localStorage.getItem('userAvatar');
            if (saved) {
                setAvatarUrl(saved);
            }
        };

        window.addEventListener('userAvatarUpdated', syncAvatar);
        window.addEventListener('storage', syncAvatar);
        return () => {
            window.removeEventListener('userAvatarUpdated', syncAvatar);
            window.removeEventListener('storage', syncAvatar);
        };
    }, []);

    const [classList, setClassList] = useState([
        { name: 'Programming Languages', code: 'CCPGLANG' },
        { name: 'Human Computer Interact...', code: 'CCINTHCI' },
        { name: 'Automata Theory', code: 'CCAUTOMATA' },
        { name: 'Data Structure', code: 'CCDATRCL' },
    ]);

    const handleTabClick = (pageName: string) => {
        setActiveTab(pageName);
        if (onPageChange) {
            onPageChange(pageName);
        }
    };

    const handleAddClassSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClassName.trim() || !newClassCode.trim()) return;

        const newClass = {
            name: newClassName.trim(),
            code: newClassCode.trim().toUpperCase(),
        };

        setClassList([...classList, newClass]);
        handleTabClick(newClass.code);
        setNewClassName('');
        setNewClassCode('');
        setShowAddClassModal(false);
        showToast(`Class "${newClass.code}" added successfully!`);
    };

    const handleRemoveClass = (index: number) => {
        const target = classList[index];
        const updated = classList.filter((_, i) => i !== index);
        setClassList(updated);
        if (activeTab === target.code || activeTab === target.name) {
            handleTabClick('Overview');
        }
        setClassPendingRemoval(null);
        if (target) {
            showToast(`Class "${target.code}" removed successfully!`, 'info');
        }
    };

    return (
        <aside
            className={`bg-[linear-gradient(180deg,#E6D0C1_0%,#FFFAF6_34.13%,#EEE9E4_100%)] flex flex-col justify-between shrink-0 border-r border-black/5 transition-all duration-300 ease-in-out h-screen sticky top-0 z-40 ${isCollapsed ? 'w-20 px-2 py-4' : 'w-72 p-6'
                }`}
        >
            {/* Scrollable Navigation Area */}
            <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto pr-1">
                {/* Logo Header & Toggle Button */}
                <div className="flex items-center justify-between gap-1 relative z-10 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <div
                            className={`shrink-0 flex items-center justify-center rounded-xl shadow-sm overflow-hidden transition-all ${isCollapsed ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'
                                }`}
                        >
                            <img src={logo} alt="Checkmate Logo" className="w-full h-full object-cover" />
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap min-w-0">
                                <h2 className="text-xl font-bold font-serif leading-tight text-[#1F2328]">Checkmate</h2>
                                <p className="text-[9px] font-bold text-gray-500 tracking-wider uppercase">ATTENDANCE MONITORING</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        className="p-1.5 text-gray-600 hover:bg-black/10 rounded-lg transition-all shrink-0 relative z-20 hover:text-black"
                    >
                        <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-col gap-2 mt-2">
                    <button
                        onClick={() => handleTabClick('Overview')}
                        title="Overview"
                        className={`flex items-center gap-3 py-3 rounded-xl transition-all text-sm ${activeTab === 'Overview'
                                ? 'bg-white shadow-sm font-semibold text-[#1F2328]'
                                : 'font-medium text-gray-600 hover:bg-black/5'
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <LayoutGrid size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Overview</span>}
                    </button>
                    <button
                        onClick={() => handleTabClick('Reports')}
                        title="Reports"
                        className={`flex items-center gap-3 py-3 rounded-xl transition-all text-sm ${activeTab === 'Reports'
                                ? 'bg-white shadow-sm font-semibold text-[#1F2328]'
                                : 'font-medium text-gray-600 hover:bg-black/5'
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <FileText size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Reports</span>}
                    </button>
                </nav>

                {/* Classes Section */}
                <div className="flex flex-col gap-3 mt-2">
                    {!isCollapsed ? (
                        <div className="flex items-center justify-between text-xs font-bold tracking-wider text-gray-500 uppercase px-1">
                            <span>Your Classes</span>
                            <button
                                aria-label="Add Class"
                                onClick={() => setShowAddClassModal(true)}
                                className="p-1 hover:bg-black/10 rounded text-gray-600 transition-colors cursor-pointer"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button
                                aria-label="Add Class"
                                title="Add Class"
                                onClick={() => setShowAddClassModal(true)}
                                className="p-1.5 hover:bg-black/10 rounded-lg text-gray-600 transition-colors cursor-pointer"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        {classList.map((c, i) => {
                            const isActive = activeTab === c.code || activeTab === c.name;
                            return (
                                <div key={i} className="relative group/class flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleTabClick(c.code)}
                                        title={`${c.name} (${c.code})`}
                                        className={`flex items-center gap-3 rounded-xl text-left transition-all w-full ${isActive
                                                ? 'bg-white shadow-sm font-semibold text-[#1F2328]'
                                                : 'hover:bg-black/5 font-medium text-gray-600'
                                            } ${isCollapsed ? 'justify-center p-2.5' : 'p-2.5 pr-8'}`}
                                    >
                                        <BookOpen
                                            size={18}
                                            className={`shrink-0 ${isActive ? 'text-[#1F2328]' : 'text-gray-500'}`}
                                        />
                                        {!isCollapsed && (
                                            <div className="overflow-hidden whitespace-nowrap min-w-0">
                                                <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#1F2328]' : 'text-gray-800'}`}>
                                                    {c.name}
                                                </p>
                                                <p className={`text-[10px] font-bold tracking-wider ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    {c.code}
                                                </p>
                                            </div>
                                        )}
                                    </button>
                                    {!isCollapsed && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setClassPendingRemoval({ index: i, name: c.name, code: c.code });
                                            }}
                                            title={`Remove ${c.name}`}
                                            className="absolute right-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/class:opacity-100 cursor-pointer"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* User Profile Card (Fixed at bottom) */}
            <div
                className={`mt-4 pt-4 border-t border-black/5 flex items-center bg-white rounded-2xl shadow-sm shrink-0 transition-all ${isCollapsed ? 'flex-col gap-3 p-2 justify-center' : 'justify-between p-3'
                    }`}
            >
                <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
                    <div
                        title="Prof. Susan Caluya"
                        className="w-9 h-9 rounded-full bg-pink-100 overflow-hidden border border-gray-200/80 flex items-center justify-center shrink-0 shadow-xs"
                    >
                        <img
                            src={avatarUrl}
                            alt="Prof. Susan Caluya"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <p className="text-xs font-bold text-[#1F2328] truncate">Prof. Susan Caluya</p>
                            <p className="text-[10px] text-gray-500 truncate">Computer Science</p>
                        </div>
                    )}
                </div>
                {onSignOut && (
                    <button
                        onClick={onSignOut}
                        title="Sign Out"
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                    </button>
                )}
            </div>

            {/* Add Class Confirmation Modal */}
            {showAddClassModal && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                                    <BookOpen size={16} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-[#1F2328]">Add New Class</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddClassModal(false)}
                                className="text-gray-400 hover:text-black text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 font-medium">
                            Enter the class details below to add a new subject to your schedule.
                        </p>

                        <form onSubmit={handleAddClassSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600">Class Name / Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Computer Networks"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600">Class Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CCNETWRK"
                                    value={newClassCode}
                                    onChange={(e) => setNewClassCode(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium uppercase focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddClassModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#1F2328] hover:bg-black rounded-xl shadow-sm transition-all cursor-pointer"
                                >
                                    Confirm & Add Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Remove Class Confirmation Modal */}
            {classPendingRemoval && (
                <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-serif font-bold text-[#1F2328]">Remove Class</h3>
                                <p className="text-[11px] text-gray-400 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                            Are you sure you want to remove <strong className="text-[#1F2328] font-bold">{classPendingRemoval.name}</strong> ({classPendingRemoval.code}) from your classes list?
                        </p>

                        <div className="flex items-center justify-end gap-2 mt-1">
                            <button
                                type="button"
                                onClick={() => setClassPendingRemoval(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveClass(classPendingRemoval.index)}
                                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                                Confirm Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

