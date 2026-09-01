
import type { NodeColor, NodeData, NodeType, Connection } from './types';
import { v4 as uuidv4 } from 'uuid';

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 60;

export const COLORS: Record<NodeColor, { bg: string; text: string; border: string }> = {
    orange: { bg: 'bg-brand-orange', text: 'text-white', border: 'border-brand-orange' },
    black: { bg: 'bg-brand-dark', text: 'text-white', border: 'border-brand-dark' },
    white: { bg: 'bg-brand-light', text: 'text-brand-dark', border: 'border-gray-300' },
    gray: { bg: 'bg-brand-gray', text: 'text-brand-dark', border: 'border-gray-400' },
};

const initialNodeId = uuidv4();
export const INITIAL_NODES: NodeData[] = [
    {
        id: initialNodeId,
        type: 'Idee' as NodeType.Idea,
        text: 'Zentrale Idee',
        x: 400,
        y: 200,
        color: 'orange',
        description: 'Dies ist der Startpunkt deiner Mindmap oder deines Funnels.',
        bulletPoints: ['Erster Punkt', 'Zweiter Punkt'],
        links: ['https://google.com'],
    },
];

export const INITIAL_CONNECTIONS: Connection[] = [];
