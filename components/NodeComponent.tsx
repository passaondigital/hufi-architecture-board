
import React, { useState, useRef, useEffect } from 'react';
import { type NodeData, type NodeColor, NodeType } from '../types';
import { COLORS } from '../constants';

interface NodeComponentProps {
    node: NodeData;
    onMove: (id: string, x: number, y: number) => void;
    onUpdateText: (id:string, text: string) => void;
    onDelete: (id: string) => void;
    onStartConnection: (id: string, e: React.MouseEvent) => void;
    onEndConnection: (id: string) => void;
    onOpenDetails: (id: string) => void;
    onUpdateColor: (id: string, color: NodeColor) => void;
    isSelected: boolean;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ 
    node, 
    onMove, 
    onUpdateText,
    onDelete, 
    onStartConnection, 
    onEndConnection, 
    onOpenDetails,
    onUpdateColor,
    isSelected
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(node.text);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    
    const nodeRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isEditing) return;
        // Only drag with left click
        if (e.button !== 0) return;
        setIsDragging(true);
        const offset = {
            x: e.clientX - node.x,
            y: e.clientY - node.y,
        };

        const handleMouseMove = (e: MouseEvent) => {
            onMove(node.id, e.clientX - offset.x, e.clientY - offset.y);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleTextBlur = () => {
        onUpdateText(node.id, text);
        setIsEditing(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTextBlur();
        }
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);
    
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowContextMenu(true);
        setContextMenuPos({ x: e.pageX, y: e.pageY });
    };

    useEffect(() => {
        const handleClickOutside = () => setShowContextMenu(false);
        if (showContextMenu) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showContextMenu]);


    const color = COLORS[node.color];
    const hasDetails = (node.description && node.description.trim().length > 0) || (node.bulletPoints && node.bulletPoints.length > 0);
    
    const isPhase = node.type === NodeType.Phase;
    const isText = node.type === NodeType.Text;

    return (
        <>
            <div
                ref={nodeRef}
                className={`absolute p-4 rounded-lg shadow-md flex flex-col justify-center items-center cursor-move select-none transition-all duration-150 ${color.bg} ${color.text} ${isSelected ? 'ring-4 ring-blue-500' : ''} ${isPhase ? '!border-dashed !border-2' : ''} ${isText ? '!shadow-sm' : ''}`}
                style={{
                    left: node.x,
                    top: node.y,
                    width: '180px',
                    minHeight: '60px',
                    border: isPhase ? `2px dashed ${COLORS[node.color].border.replace('border-', '')}` : `1px solid ${COLORS[node.color].border}`,
                }}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleContextMenu}
            >
                {!isText && (
                    <div className="text-xs font-semibold uppercase opacity-70 mb-1">{node.type}</div>
                )}
                
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        onBlur={handleTextBlur}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent text-center w-full border border-dashed border-gray-400 rounded focus:outline-none"
                    />
                ) : (
                    <div className={`text-center font-medium ${isPhase ? 'font-bold' : ''}`}>{node.text}</div>
                )}

                {hasDetails && (
                    <div className="mt-2 pt-2 border-t border-current w-full opacity-90">
                        {node.description && (
                            <div className="text-[10px] text-left whitespace-pre-wrap leading-snug mb-1">
                                {node.description}
                            </div>
                        )}
                        {node.bulletPoints && node.bulletPoints.length > 0 && (
                            <ul className="text-[10px] text-left list-disc pl-3 leading-snug">
                                {node.bulletPoints.map((bp, i) => (
                                    <li key={i}>{bp}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div 
                    className="absolute -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-crosshair hover:scale-125 transition-transform"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    onMouseDown={(e) => onStartConnection(node.id, e)}
                    onMouseUp={() => onEndConnection(node.id)}
                />
            </div>

            {showContextMenu && (
                <div 
                  className="fixed bg-white rounded-md shadow-lg z-50 p-1 text-sm text-gray-700 border"
                  style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
                >
                    <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => { onOpenDetails(node.id); setShowContextMenu(false); }}>Details bearbeiten</div>
                    <div className="px-2 py-1">Farbe ändern</div>
                    <div className="flex px-2 py-1 space-x-2">
                        {Object.keys(COLORS).map((c) => (
                           <button key={c} onClick={() => { onUpdateColor(node.id, c as NodeColor); setShowContextMenu(false); }} className={`w-5 h-5 rounded-full ${COLORS[c as NodeColor].bg} border-2 ${node.color === c ? 'border-blue-500' : 'border-gray-200'}`}></button>
                        ))}
                    </div>
                    <div className="border-t my-1"></div>
                    <div className="px-2 py-1 text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => onDelete(node.id)}>Löschen</div>
                </div>
            )}
        </>
    );
};

export default NodeComponent;