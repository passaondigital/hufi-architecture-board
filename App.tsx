
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type NodeData, type Connection, NodeType, type ViewMode, type NodeColor, type ExportFormat } from './types';
import NodeComponent from './components/NodeComponent';
import ConnectionLine from './components/ConnectionLine';
import Toolbar from './components/Toolbar';
import DetailsModal from './components/DetailsModal';
import ExportModal from './components/ExportModal';
import { INITIAL_NODES, INITIAL_CONNECTIONS, NODE_WIDTH, NODE_HEIGHT } from './constants';
import { handleExport } from './services/exportService';

const LOCAL_STORAGE_KEY = 'mindmap-funnel-state';

function loadInitialState(): { nodes: Map<string, NodeData>; connections: Connection[] } {
    try {
        const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (Array.isArray(savedState.nodes) && Array.isArray(savedState.connections)) {
                return {
                    nodes: new Map(savedState.nodes.map((node: NodeData) => [node.id, node])),
                    connections: savedState.connections
                };
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden des initialen Zustands:", error);
    }

    return {
        nodes: new Map(INITIAL_NODES.map(node => [node.id, node])),
        connections: INITIAL_CONNECTIONS,
    };
}


const App: React.FC = () => {
    const [initialState] = useState(loadInitialState);
    const [nodes, setNodes] = useState<Map<string, NodeData>>(initialState.nodes);
    const [connections, setConnections] = useState<Connection[]>(initialState.connections);

    const [viewMode, setViewMode] = useState<ViewMode>('mindmap');
    
    const [connecting, setConnecting] = useState<{ from: string; to?: string; mousePos: { x: number; y: number } } | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    
    const canvasRef = useRef<HTMLDivElement>(null);
    
    const handleSaveState = useCallback(() => {
        try {
            const stateToSave = {
                nodes: Array.from(nodes.values()),
                connections: connections
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
            alert('Zustand erfolgreich gespeichert!');
        } catch (error) {
            console.error("Fehler beim Speichern des Zustands in localStorage:", error);
            alert('Fehler beim Speichern.');
        }
    }, [nodes, connections]);

    const handleLoadState = useCallback(() => {
        if (!window.confirm("Möchten Sie den gespeicherten Zustand laden? Nicht gespeicherte Änderungen gehen verloren.")) {
            return;
        }
        try {
            const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedStateJSON) {
                const savedState = JSON.parse(savedStateJSON);
                if (savedState.nodes && savedState.connections) {
                    setNodes(new Map(savedState.nodes.map((node: NodeData) => [node.id, node])));
                    setConnections(savedState.connections);
                    alert('Zustand erfolgreich geladen!');
                } else {
                     alert('Kein gültiger gespeicherter Zustand gefunden.');
                }
            } else {
                alert('Kein gespeicherter Zustand gefunden.');
            }
        } catch (error) {
            console.error("Fehler beim Laden des Zustands aus localStorage:", error);
            alert('Fehler beim Laden.');
        }
    }, []);

    const handleResetState = useCallback(() => {
        if (window.confirm("Möchten Sie wirklich alles zurücksetzen? Nicht gespeicherte Änderungen gehen verloren.")) {
            setNodes(new Map(INITIAL_NODES.map(node => [node.id, node])));
            setConnections(INITIAL_CONNECTIONS);
        }
    }, []);

    const handleAddNode = useCallback((type: NodeType) => {
        let defaultColor: NodeColor = 'white';
        let defaultText = `Neuer ${type}`;

        if (type === NodeType.Phase) {
            defaultColor = 'gray';
            defaultText = 'Neue Phase';
        } else if (type === NodeType.Text) {
            defaultColor = 'white';
            defaultText = 'Text eingeben...';
        }

        const newNode: NodeData = {
            id: uuidv4(),
            type,
            text: defaultText,
            x: 100,
            y: 100,
            color: defaultColor,
            description: '',
            bulletPoints: [],
            links: []
        };
        setNodes(prev => new Map(prev).set(newNode.id, newNode));
    }, []);

    const handleNodeMove = useCallback((id: string, x: number, y: number) => {
        setNodes(prev => {
            const node = prev.get(id);
            if (!node) {
                return prev;
            }
            const newNodes = new Map(prev);
            newNodes.set(id, { ...node, x, y });
            return newNodes;
        });
    }, []);
    
    const handleUpdateNodeText = useCallback((id: string, text: string) => {
        setNodes(prev => {
            const node = prev.get(id);
            if (!node) {
                return prev;
            }
            const newNodes = new Map(prev);
            newNodes.set(id, { ...node, text });
            return newNodes;
        });
    }, []);

    const handleDeleteNode = useCallback((id: string) => {
        setNodes(prev => {
            const newNodes = new Map(prev);
            newNodes.delete(id);
            return newNodes;
        });
        setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    }, []);

    const handleUpdateNodeColor = useCallback((id: string, color: NodeColor) => {
        setNodes(prev => {
            const node = prev.get(id);
            if (!node) {
                return prev;
            }
            const newNodes = new Map(prev);
            newNodes.set(id, { ...node, color });
            return newNodes;
        })
    }, []);

    const handleStartConnection = useCallback((fromId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConnecting({ from: fromId, mousePos: { x: e.clientX, y: e.clientY } });

        const handleMouseMove = (ev: MouseEvent) => {
            setConnecting(c => c ? { ...c, mousePos: { x: ev.clientX, y: ev.clientY } } : null);
        };

        const handleMouseUp = () => {
            setConnecting(null);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleEndConnection = useCallback((toId: string) => {
        if (connecting && connecting.from !== toId) {
            const newConnection: Connection = { from: connecting.from, to: toId };
            // Avoid duplicate connections
            if (!connections.some(c => c.from === newConnection.from && c.to === newConnection.to)) {
                setConnections(prev => [...prev, newConnection]);
            }
        }
        setConnecting(null);
    }, [connecting, connections]);

    const handleSaveDetails = useCallback((id: string, details: Partial<NodeData>) => {
        setNodes(prev => {
            const node = prev.get(id);
            if (!node) {
                return prev;
            }
            const newNodes = new Map(prev);
            newNodes.set(id, { ...node, ...details });
            return newNodes;
        });
    }, []);
    
    const calculateFunnelLayout = (nodesMap: Map<string, NodeData>, connectionsList: Connection[]): Map<string, NodeData> => {
        if (nodesMap.size === 0) return new Map();

        const layoutNodes = new Map(Array.from(nodesMap.entries()).map(([id, node]) => [id, {...node}]));
        const adjList = new Map<string, string[]>();
        const inDegree = new Map<string, number>();

        layoutNodes.forEach(node => {
            adjList.set(node.id, []);
            inDegree.set(node.id, 0);
        });

        connectionsList.forEach(conn => {
            adjList.get(conn.from)?.push(conn.to);
            inDegree.set(conn.to, (inDegree.get(conn.to) || 0) + 1);
        });

        const queue: string[] = [];
        layoutNodes.forEach(node => {
            if ((inDegree.get(node.id) || 0) === 0) {
                queue.push(node.id);
            }
        });
        
        if (queue.length === 0 && layoutNodes.size > 0) {
            queue.push(layoutNodes.keys().next().value);
        }

        const levels = new Map<string, number>();
        let maxLevel = 0;
        
        let head = 0;
        while(head < queue.length) {
            const u = queue[head++];
            const level = levels.get(u) || 0;
            maxLevel = Math.max(maxLevel, level);
            
            const children = adjList.get(u) || [];
            for(const v of children) {
                levels.set(v, level + 1);
                queue.push(v);
            }
        }
        
        const nodesByLevel: string[][] = Array.from({length: maxLevel + 1}, () => []);
        layoutNodes.forEach(node => {
            const level = levels.get(node.id) || 0;
            nodesByLevel[level].push(node.id);
        });
        
        const PADDING_X = 100;
        const PADDING_Y = 120;
        const VIEWPORT_WIDTH = window.innerWidth;
        
        nodesByLevel.forEach((levelNodes, level) => {
            const y = level * (NODE_HEIGHT + PADDING_Y) + 100;
            const totalWidth = levelNodes.length * NODE_WIDTH + (levelNodes.length - 1) * PADDING_X;
            let startX = (VIEWPORT_WIDTH - totalWidth) / 2;
            
            levelNodes.forEach((nodeId, i) => {
                const node = layoutNodes.get(nodeId);
                if(node) {
                    node.x = startX + i * (NODE_WIDTH + PADDING_X);
                    node.y = y;
                    layoutNodes.set(nodeId, node);
                }
            });
        });


        return layoutNodes;
    };
    
    const displayedNodes = viewMode === 'funnel' ? calculateFunnelLayout(nodes, connections) : nodes;
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodeId) {
                    handleDeleteNode(selectedNodeId);
                    setSelectedNodeId(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, handleDeleteNode]);


    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans" ref={canvasRef} onClick={() => setSelectedNodeId(null)}>
            <div className="absolute inset-0 bg-brand-gray">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {Array.from(displayedNodes.values()).map((node: NodeData) => (
                <div key={node.id} onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}>
                    <NodeComponent
                        node={node}
                        onMove={handleNodeMove}
                        onUpdateText={handleUpdateNodeText}
                        onDelete={handleDeleteNode}
                        onStartConnection={handleStartConnection}
                        onEndConnection={handleEndConnection}
                        onOpenDetails={() => setEditingNodeId(node.id)}
                        onUpdateColor={handleUpdateNodeColor}
                        isSelected={selectedNodeId === node.id}
                    />
                </div>
            ))}
            
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
              <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                  </marker>
              </defs>
              {connections.map((conn, i) => {
                  const fromNode = displayedNodes.get(conn.from);
                  const toNode = displayedNodes.get(conn.to);
                  if (fromNode && toNode) {
                      return <ConnectionLine key={`${conn.from}-${conn.to}-${i}`} fromNode={fromNode} toNode={toNode} />;
                  }
                  return null;
              })}
              {connecting && displayedNodes.get(connecting.from) && (
                  <line
                      x1={displayedNodes.get(connecting.from)!.x + NODE_WIDTH}
                      y1={displayedNodes.get(connecting.from)!.y + NODE_HEIGHT / 2}
                      x2={connecting.mousePos.x}
                      y2={connecting.mousePos.y}
                      stroke="#2563eb"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                  />
              )}
            </svg>

            <Toolbar 
                onAddNode={handleAddNode} 
                viewMode={viewMode} 
                onSetViewMode={setViewMode} 
                onExport={() => setIsExporting(true)}
                onSave={handleSaveState}
                onLoad={handleLoadState}
                onReset={handleResetState}
            />
            
            {editingNodeId && (
                <DetailsModal 
                    node={nodes.get(editingNodeId) || null}
                    onClose={() => setEditingNodeId(null)}
                    onSave={handleSaveDetails}
                />
            )}
            
            {isExporting && (
                <ExportModal
                    onClose={() => setIsExporting(false)}
                    onExport={(format) => {
                        handleExport(format, nodes, connections, canvasRef);
                        setIsExporting(false);
                    }}
                />
            )}
        </div>
    );
};

export default App;
