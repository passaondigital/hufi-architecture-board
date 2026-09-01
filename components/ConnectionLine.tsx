
import React from 'react';
import type { NodeData } from '../types';
import { NODE_WIDTH, NODE_HEIGHT } from '../constants';

interface ConnectionLineProps {
    fromNode: NodeData;
    toNode: NodeData;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ fromNode, toNode }) => {
    const fromX = fromNode.x + NODE_WIDTH;
    const fromY = fromNode.y + NODE_HEIGHT / 2;
    const toX = toNode.x;
    const toY = toNode.y + NODE_HEIGHT / 2;

    return (
        <path
            d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
            stroke="#9ca3af"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrow)"
        />
    );
};

export default ConnectionLine;
