'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NameTagModalProps {
    speciesName: string;
    onClose: () => void;
    onSubmit: (nameOnTag: string) => void;
    initialName?: string;
}

export default function NameTagModal({ speciesName, onClose, onSubmit, initialName = '' }: NameTagModalProps) {
    const [name, setName] = useState(initialName);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Nama ukiran tidak boleh kosong.');
            return;
        }
        if (name.length > 30) {
            setError('Maksimal 30 karakter.');
            return;
        }
        onSubmit(name.trim());
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-1 uppercase tracking-widest font-sans font-medium">Langkah 1 dari 2</p>
                    <h2 className="text-2xl font-bold text-gray-900 font-tilt mb-2">Ukir Nama Pohon</h2>
                    <p className="text-sm text-gray-600 font-sans">
                        Adopsi pohon <span className="font-semibold text-[#1A581E]">{speciesName}</span> Anda. Nama ini akan diukir pada tag kayu eksklusif pohon Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="nameOnTag" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Nama di Tag Kayu
                        </label>
                        <input
                            type="text"
                            id="nameOnTag"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Contoh: Keluarga John Doe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A581E] focus:border-transparent transition-all font-sans text-gray-900"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs mt-2 font-sans">{error}</p>}
                        <p className="text-xs text-gray-400 mt-2 text-right">Maks. 30 karakter</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1A581E] hover:bg-[#154617] text-white font-bold py-3.5 px-4 rounded-xl font-inria tracking-wide shadow-lg shadow-[#1A581E]/20 transition-all focus:ring-4 focus:ring-[#1A581E]/30"
                    >
                        Lanjut ke Pembayaran
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 italic">
                        Sistem mengamankan slot pohon Anda selama proses pembayaran.
                    </p>
                </div>
            </div>
        </div>
    );
}
