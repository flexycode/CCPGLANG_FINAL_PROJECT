import { useState, useEffect } from 'react';
import { LayoutGrid, FileText, BookOpen, Plus, LogOut, ChevronLeft, Trash2, Menu, X } from 'lucide-react';
import { showToast } from './ui/toast';
import { useTheme } from '../utils/theme';
import { getCurrentUser, type UserProfile } from '../utils/user';
import { addNotification } from '../utils/notifications';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/checkmate_logo.jpg';

interface SidebarProps {
    onSignOut?: () => void;
    activePage?: string;
    onPageChange?: (pageName: string) => void;
}

export default function Sidebar({ onSignOut, activePage = 'Overview', onPageChange }: SidebarProps) {
    const { isDark } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(activePage);
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newClassCode, setNewClassCode] = useState('');
    const [classPendingRemoval, setClassPendingRemoval] = useState<{ index: number; name: string; code: string } | null>(null);

    const [avatarUrl, setAvatarUrl] = useState<string>(
        () => localStorage.getItem('userAvatar') || '/images/teacher.png'
    );
    const [currentUser, setCurrentUserState] = useState<UserProfile>(getCurrentUser);

    useEffect(() => {
        const syncAvatar = () => {
            const saved = localStorage.getItem('userAvatar');
            if (saved) {
                setAvatarUrl(saved);
            }
        };

        const syncUser = () => {
            setCurrentUserState(getCurrentUser());
        };

        window.addEventListener('userAvatarUpdated', syncAvatar);
        window.addEventListener('storage', syncAvatar);
        window.addEventListener('checkmate_user_updated', syncUser);
        window.addEventListener('storage', syncUser);

        return () => {
            window.removeEventListener('userAvatarUpdated', syncAvatar);
            window.removeEventListener('storage', syncAvatar);
            window.removeEventListener('checkmate_user_updated', syncUser);
            window.removeEventListener('storage', syncUser);
        };
    }, []);

    const [classList, setClassList] = useState([
        { name: 'Programming Languages', code: 'CCPGLANG' },
        { name: 'Human Computer Interaction', code: 'CCINTHCI' },
        { name: 'Automata Theory', code: 'CCAUTOMATA' },
        { name: 'Data Structure', code: 'CCDATRCL' },
    ]);

    const handleTabClick = (pageName: string) => {
        setActiveTab(pageName);
        setIsMobileOpen(false);
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
        addNotification(
            'New Class Created',
            `Class "${newClass.name}" (${newClass.code}) was created and added to the roster.`,
            'class'
        );
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
            addNotification(
                'Class Removed',
                `Class "${target.name}" (${target.code}) was removed from your schedule.`,
                'warning'
            );
        }
    };

    return (
        <>
            {/* Mobile Hamburger Trigger Button (Visible only on < md screens) */}
            <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-3 left-3 z-40 p-2.5 rounded-2xl bg-white/95 dark:bg-[#151D2A]/95 border border-gray-200/80 dark:border-white/10 shadow-lg text-gray-700 dark:text-gray-200 backdrop-blur-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                aria-label="Open Navigation Menu"
                title="Open Menu"
            >
                <Menu size={20} />
            </button>

            {/* Mobile Backdrop Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
                />
            )}

            <aside
                className={`fixed md:sticky top-0 left-0 z-50 md:z-40 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 border-r ${
                    isMobileOpen ? 'translate-x-0 shadow-2xl w-72 sm:w-80 p-5' : '-translate-x-full md:translate-x-0'
                } ${
                    isCollapsed ? 'md:w-20 md:px-2 md:py-4' : 'md:w-72 lg:w-76 xl:w-80 md:p-5'
                } ${
                    isDark
                        ? 'bg-[linear-gradient(180deg,#1a1a2e_0%,#16213e_34.13%,#0f3460_100%)] border-white/10'
                        : 'bg-[linear-gradient(180deg,#E6D0C1_0%,#FFFAF6_34.13%,#EEE9E4_100%)] border-black/5'
                }`}
            >
                {/* Scrollable Navigation Area */}
                <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto pr-1">
                    {/* Logo Header & Toggle Button */}
                    <div className="flex items-center justify-between gap-1 relative z-10 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <div
                                className={`shrink-0 flex items-center justify-center rounded-xl shadow-sm overflow-hidden transition-all ${
                                    isCollapsed ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'
                                }`}
                            >
                                <img src={logo} alt="Checkmate Logo" className="w-full h-full object-cover" />
                            </div>
                            {!isCollapsed && (
                                <div className="overflow-hidden whitespace-nowrap min-w-0">
                                    <h2 className={`text-xl font-bold font-serif leading-tight ${isDark ? 'text-white' : 'text-[#1F2328]'}`}>Checkmate</h2>
                                    <p className={`text-[9px] font-bold tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ATTENDANCE MONITORING</p>
                                </div>
                            )}
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            type="button"
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>

                        {/* Desktop Collapse Toggle Button */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                            className={`hidden md:flex p-1.5 rounded-lg transition-all shrink-0 relative z-20 cursor-pointer ${
                                isDark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/10 hover:text-black'
                            }`}
                        >
                            <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                {/* Main Navigation */}
                <nav className="flex flex-col gap-2 mt-2">
                    <button
                        onClick={() => handleTabClick('Overview')}
                        title="Overview"
                        className={`flex items-center gap-3 py-3 rounded-xl transition-all text-sm cursor-pointer ${activeTab === 'Overview'
                                ? (isDark ? 'bg-white/10 shadow-sm font-semibold text-white' : 'bg-white shadow-sm font-semibold text-[#1F2328]')
                                : (isDark ? 'font-medium text-gray-400 hover:bg-white/5' : 'font-medium text-gray-600 hover:bg-black/5')
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <LayoutGrid size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Overview</span>}
                    </button>
                    <button
                        onClick={() => handleTabClick('Reports')}
                        title="Reports"
                        className={`flex items-center gap-3 py-3 rounded-xl transition-all text-sm cursor-pointer ${activeTab === 'Reports'
                                ? (isDark ? 'bg-white/10 shadow-sm font-semibold text-white' : 'bg-white shadow-sm font-semibold text-[#1F2328]')
                                : (isDark ? 'font-medium text-gray-400 hover:bg-white/5' : 'font-medium text-gray-600 hover:bg-black/5')
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <FileText size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Reports</span>}
                    </button>
                </nav>

                {/* Classes Section */}
                <div className="flex flex-col gap-3 mt-2">
                    {!isCollapsed ? (
                        <div className={`flex items-center justify-between text-xs font-bold tracking-wider uppercase px-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>Your Classes</span>
                            <button
                                aria-label="Add Class"
                                onClick={() => setShowAddClassModal(true)}
                                className={`p-1 rounded transition-colors cursor-pointer ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-black/10'}`}
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
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-black/10'}`}
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
                                        className={`flex items-center gap-3 rounded-xl text-left transition-all w-full cursor-pointer ${isActive
                                                ? (isDark ? 'bg-white/10 shadow-sm font-semibold text-white' : 'bg-white shadow-sm font-semibold text-[#1F2328]')
                                                : (isDark ? 'hover:bg-white/5 font-medium text-gray-400' : 'hover:bg-black/5 font-medium text-gray-600')
                                            } ${isCollapsed ? 'justify-center p-2.5' : 'p-2.5 pr-8'}`}
                                    >
                                        <BookOpen
                                            size={18}
                                            className={`shrink-0 ${isActive ? (isDark ? 'text-white' : 'text-[#1F2328]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
                                        />
                                        {!isCollapsed && (
                                            <div className="overflow-hidden whitespace-nowrap min-w-0">
                                                <p className={`text-xs font-semibold truncate ${isActive ? (isDark ? 'text-white' : 'text-[#1F2328]') : (isDark ? 'text-gray-300' : 'text-gray-800')}`}>
                                                    {c.name}
                                                </p>
                                                <p className={`text-[10px] font-bold tracking-wider ${isActive ? (isDark ? 'text-gray-400' : 'text-gray-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
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
                                            className={`absolute right-2 p-1 rounded-lg transition-all opacity-0 group-hover/class:opacity-100 cursor-pointer ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
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

            {/* User Profile Card (Fixed at bottom) - Full Name Display without truncation */}
            <div
                className={`mt-4 pt-3 border-t rounded-2xl shadow-sm shrink-0 transition-all ${
                    isCollapsed ? 'flex flex-col items-center gap-2.5 p-2' : 'flex flex-col gap-2.5 p-3'
                } ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white'}`}
            >
                {isCollapsed ? (
                    <>
                        <div
                            title={currentUser.displayName}
                            className="w-9 h-9 rounded-full bg-pink-100 overflow-hidden border border-gray-200/80 flex items-center justify-center shrink-0 shadow-xs"
                        >
                            <img
                                src={avatarUrl}
                                alt={currentUser.displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <DarkModeToggle className="w-8 h-8" />
                        {onSignOut && (
                            <button
                                onClick={onSignOut}
                                title="Sign Out"
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {/* Full Professor Profile Details - Completely Full Name, Never Truncated */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                title={currentUser.displayName}
                                className="w-10 h-10 rounded-full bg-pink-100 overflow-hidden border border-gray-200/80 flex items-center justify-center shrink-0 shadow-xs"
                            >
                                <img
                                    src={avatarUrl}
                                    alt={currentUser.displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-xs sm:text-sm font-bold leading-tight break-words ${isDark ? 'text-white' : 'text-[#1F2328]'}`}
                                    title={currentUser.displayName}
                                >
                                    {currentUser.displayName}
                                </p>
                                <p className={`text-[10px] mt-0.5 leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {currentUser.department}
                                </p>
                            </div>
                        </div>

                        {/* Account Actions Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                                Account
                            </span>
                            <div className="flex items-center gap-1.5">
                                <DarkModeToggle className="w-7 h-7" />
                                {onSignOut && (
                                    <button
                                        onClick={onSignOut}
                                        title="Sign Out"
                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                            isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <LogOut size={15} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add Class Confirmation Modal */}
            {showAddClassModal && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold">
                                    <BookOpen size={16} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-[#1F2328] dark:text-white">Add New Class</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddClassModal(false)}
                                className="text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Enter the class details below to add a new subject to your schedule.
                        </p>

                        <form onSubmit={handleAddClassSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Class Name / Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Computer Networks"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Class Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CCNETWRK"
                                    value={newClassCode}
                                    onChange={(e) => setNewClassCode(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium uppercase text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowAddClassModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#1F2328] dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 rounded-xl shadow-sm transition-all cursor-pointer"
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
                    <div className="bg-white dark:bg-[#151D2A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 border border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-serif font-bold text-[#1F2328] dark:text-white">Remove Class</h3>
                                <p className="text-[11px] text-gray-400 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/10">
                            Are you sure you want to remove <strong className="text-[#1F2328] dark:text-white font-bold">{classPendingRemoval.name}</strong> ({classPendingRemoval.code}) from your classes list?
                        </p>

                        <div className="flex items-center justify-end gap-2 mt-1">
                            <button
                                type="button"
                                onClick={() => setClassPendingRemoval(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
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
    </>
    );
}

