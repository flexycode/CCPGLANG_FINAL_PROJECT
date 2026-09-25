import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const event = new CustomEvent('app-toast', {
        detail: { message, type, id: Math.random().toString() },
    });
    window.dispatchEvent(event);
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const handleToast = (e: Event) => {
            const customEvent = e as CustomEvent<ToastMessage>;
            const newToast = customEvent.detail;
            setToasts((prev) => [...prev, newToast]);

            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
            }, 3500);
        };

        window.addEventListener('app-toast', handleToast);
        return () => window.removeEventListener('app-toast', handleToast);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-[#1F2328] text-white rounded-2xl shadow-2xl border border-white/10 text-xs font-semibold animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto"
                >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        {toast.type === 'error' ? (
                            <AlertCircle className="text-red-400 shrink-0 stroke-[2.5]" size={18} />
                        ) : toast.type === 'info' ? (
                            <Info className="text-blue-400 shrink-0 stroke-[2.5]" size={18} />
                        ) : (
                            <CheckCircle2 className="text-emerald-400 shrink-0 stroke-[2.5]" size={18} />
                        )}
                        <span className="truncate">{toast.message}</span>
                    </div>

                    <button
                        onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                        className="p-1 text-gray-400 hover:text-white rounded-md transition-colors shrink-0 cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
