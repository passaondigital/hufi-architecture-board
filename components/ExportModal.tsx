
import React from 'react';
import type { ExportFormat } from '../types';

interface ExportModalProps {
    onClose: () => void;
    onExport: (format: ExportFormat) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExport }) => {
    // FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
    const formats: { id: ExportFormat; name: string; desc: string; icon: React.ReactElement }[] = [
        { id: 'png', name: 'PNG', desc: 'Bilddatei, ideal für Präsentationen.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { id: 'pdf', name: 'PDF', desc: 'Dokument, gut zum Teilen und Drucken.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { id: 'json', name: 'JSON', desc: 'Rohdaten, zum Importieren oder für Entwickler.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
        { id: 'md', name: 'Markdown', desc: 'Text-Format, für Notizen und Dokumentation.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-4">Exportieren als...</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formats.map((format) => (
                        <div key={format.id} onClick={() => onExport(format.id)} className="p-4 border rounded-lg hover:bg-gray-100 hover:shadow-md cursor-pointer transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="text-brand-orange">{format.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-lg">{format.name}</h3>
                                    <p className="text-sm text-gray-500">{format.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
