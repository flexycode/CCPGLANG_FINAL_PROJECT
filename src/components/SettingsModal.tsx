import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Plus } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { showToast } from './ui/toast';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: { fullName: string; email: string; role: string; avatarUrl: string }) => void;
}

const DEFAULT_AVATAR = '/images/teacher.png';

const AVATAR_PRESETS = [
    '/images/teacher.png',
    '/images/teacher2.png',
    '/images/teacher3.png',
    '/images/teacher4.png',
    '/images/teacher5.png',
    '/images/teacher6.png',
];

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
    const [fullName, setFullName] = useState('Susan S. Caluya');
    const [email, setEmail] = useState('sscaluya@national-u.edu.ph');
    const [role, setRole] = useState('Faculty');
    const [avatarUrl, setAvatarUrl] = useState(
        () => localStorage.getItem('userAvatar') || DEFAULT_AVATAR
    );
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleAvatarSelect = (newUrl: string) => {
        setAvatarUrl(newUrl);
        localStorage.setItem('userAvatar', newUrl);
        window.dispatchEvent(new Event('userAvatarUpdated'));
        setShowAvatarPicker(false);
        showToast('Avatar updated successfully!');
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                if (uploadEvent.target?.result) {
                    const dataUrl = uploadEvent.target.result as string;
                    handleAvatarSelect(dataUrl);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('userAvatar', avatarUrl);
        window.dispatchEvent(new Event('userAvatarUpdated'));
        if (onSave) {
            onSave({ fullName, email, role, avatarUrl });
        }
        onClose();
        showToast('Account settings saved successfully!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Click backdrop to close */}
            <div className="fixed inset-0" onClick={onClose}></div>

            {/* Settings Modal Card */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#1F2328]">Account Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Close settings"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body / Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {/* Centered Avatar Section with Plus Badge */}
                    <div className="flex flex-col items-center justify-center gap-3 py-1">
                        <div className="relative w-20 h-20">
                            <div className="w-20 h-20 rounded-full bg-pink-100 overflow-hidden border-2 border-white shadow-md flex items-center justify-center">
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Plus (+) Action Button Badge at Lower Right */}
                            <Popover open={showMenu} onOpenChange={setShowMenu}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        title="Change avatar or upload photo"
                                        className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[#1F2328] hover:bg-black text-white flex items-center justify-center shadow-md transition-all cursor-pointer border-2 border-white hover:scale-110 active:scale-95"
                                    >
                                        <Plus size={15} className="stroke-[3]" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1.5 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 flex flex-col gap-1" align="center" side="bottom">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMenu(false);
                                            fileInputRef.current?.click();
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors w-full text-left cursor-pointer"
                                    >
                                        <Upload size={14} className="text-gray-500" />
                                        <span>Upload Photo</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowAvatarPicker(!showAvatarPicker);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors w-full text-left cursor-pointer"
                                    >
                                        <Sparkles size={14} className="text-gray-500" />
                                        <span>Choose Avatar</span>
                                    </button>
                                </PopoverContent>
                            </Popover>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Preset Avatars Selector Drawer Grid */}
                        {showAvatarPicker && (
                            <div className="w-full p-3 bg-gray-50/80 border border-gray-200/80 rounded-2xl flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150 mt-1">
                                <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                                    <span>Select Avatar Icon</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowAvatarPicker(false)}
                                        className="text-gray-400 hover:text-gray-600 text-[11px] cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="grid grid-cols-6 gap-2 pt-1 justify-items-center">
                                    {AVATAR_PRESETS.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleAvatarSelect(url)}
                                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all p-0.5 hover:scale-110 cursor-pointer ${avatarUrl === url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover rounded-full" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input 1: Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#1F2328]">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#1F2328] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                        />
                    </div>

                    {/* Input 2: Email Address */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#1F2328]">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#1F2328] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                        />
                    </div>

                    {/* Input 3: Role / Department */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#1F2328]">Role / Department</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#1F2328] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
