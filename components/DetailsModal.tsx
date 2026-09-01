
import React, { useState, useEffect } from 'react';
import type { NodeData } from '../types';

interface DetailsModalProps {
    node: NodeData | null;
    onClose: () => void;
    onSave: (id: string, details: Partial<NodeData>) => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ node, onClose, onSave }) => {
    const [description, setDescription] = useState('');
    const [bulletPoints, setBulletPoints] = useState('');
    const [links, setLinks] = useState('');

    useEffect(() => {
        if (node) {
            setDescription(node.description || '');
            setBulletPoints(node.bulletPoints?.join('\n') || '');
            setLinks(node.links?.join('\n') || '');
        }
    }, [node]);

    if (!node) return null;

    const handleSave = () => {
        onSave(node.id, {
            description,
            bulletPoints: bulletPoints.split('\n').filter(bp => bp.trim() !== ''),
            links: links.split('\n').filter(l => l.trim() !== ''),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4">Details für "{node.text}"</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Kurzbeschreibung</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="bulletPoints" className="block text-sm font-medium text-gray-700">Stichpunkte (einer pro Zeile)</label>
                        <textarea
                            id="bulletPoints"
                            value={bulletPoints}
                            onChange={(e) => setBulletPoints(e.target.value)}
                            rows={5}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="links" className="block text-sm font-medium text-gray-700">Links (einer pro Zeile)</label>
                        <textarea
                            id="links"
                            value={links}
                            onChange={(e) => setLinks(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Abbrechen
                    </button>
                    <button onClick={handleSave} type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
