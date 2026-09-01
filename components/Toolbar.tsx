
import React from 'react';
import { NodeType, ViewMode } from '../types';

interface ToolbarProps {
    onAddNode: (type: NodeType) => void;
    viewMode: ViewMode;
    onSetViewMode: (mode: ViewMode) => void;
    onExport: () => void;
    onSave: () => void;
    onLoad: () => void;
    onReset: () => void;
}

const nodeTypes = Object.values(NodeType);

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode, viewMode, onSetViewMode, onExport, onSave, onLoad, onReset }) => {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-brand-light p-2 rounded-xl shadow-lg flex items-center gap-4 border border-gray-200 z-30 flex-wrap justify-center">
            <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm mr-2 text-gray-600">Baustein hinzufügen:</span>
                {nodeTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => onAddNode(type)}
                        className="px-3 py-1.5 bg-brand-orange text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                        title={`${type} hinzufügen`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            
            <div className="h-8 border-l border-gray-300"></div>

            <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-gray-600">Ansicht:</span>
                <button
                    onClick={() => onSetViewMode('mindmap')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'mindmap' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Mindmap
                </button>
                <button
                    onClick={() => onSetViewMode('funnel')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'funnel' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Funnel
                </button>
            </div>
            
            <div className="h-8 border-l border-gray-300"></div>

            <div className="flex items-center space-x-2">
                 <button onClick={onSave} className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2" title="Aktuellen Zustand speichern">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-4 4-4-4zM12 3v10" /></svg>
                    <span>Speichern</span>
                </button>
                <button onClick={onLoad} className="px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors flex items-center space-x-2" title="Gespeicherten Zustand laden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span>Laden</span>
                </button>
                 <button onClick={onReset} className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2" title="Arbeitsfläche zurücksetzen">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M5.5 9.5a8.5 8.5 0 0113.6-2.4M20 20v-5h-5m-1.5-4.5a8.5 8.5 0 01-13.6 2.4" /></svg>
                    <span>Reset</span>
                </button>
            </div>

            <div className="h-8 border-l border-gray-300"></div>

            <button onClick={onExport} className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Exportieren</span>
            </button>
        </div>
    );
};

export default Toolbar;