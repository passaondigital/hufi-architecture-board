
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { NodeData, Connection, ExportFormat } from '../types';
// FIX: Import RefObject type from react to resolve namespace error.
import type { RefObject } from 'react';

function downloadFile(content: string, fileName: string, contentType: string) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

const exportToPng = async (element: HTMLElement) => {
    const dataUrl = await toPng(element, { backgroundColor: '#F5F5F5' });
    const link = document.createElement('a');
    link.download = 'mindmap.png';
    link.href = dataUrl;
    link.click();
};

const exportToPdf = async (element: HTMLElement) => {
    const dataUrl = await toPng(element, { backgroundColor: '#FFFFFF', pixelRatio: 2 });
    const pdf = new jsPDF({
        orientation: element.offsetWidth > element.offsetHeight ? 'l' : 'p',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
    pdf.save('mindmap.pdf');
};

const exportToJson = (nodes: Map<string, NodeData>, connections: Connection[]) => {
    const data = {
        nodes: Array.from(nodes.values()),
        connections,
    };
    downloadFile(JSON.stringify(data, null, 2), 'mindmap.json', 'application/json');
};

const buildMarkdown = (
    nodeId: string, 
    nodes: Map<string, NodeData>, 
    adjList: Map<string, string[]>, 
    visited: Set<string>, 
    depth: number
): string => {
    if (visited.has(nodeId)) return '';
    visited.add(nodeId);

    const node = nodes.get(nodeId);
    if (!node) return '';

    let md = `${'  '.repeat(depth)}- **${node.text}** (*${node.type}*)\n`;

    if (node.description) {
        md += `${'  '.repeat(depth + 1)}  *${node.description}*\n`;
    }
    if (node.bulletPoints && node.bulletPoints.length > 0) {
        node.bulletPoints.forEach(bp => {
            md += `${'  '.repeat(depth + 1)}  - ${bp}\n`;
        });
    }
    if (node.links && node.links.length > 0) {
        node.links.forEach(link => {
            md += `${'  '.repeat(depth + 1)}  - [Link](${link})\n`;
        });
    }
    
    const children = adjList.get(nodeId) || [];
    for (const childId of children) {
        md += buildMarkdown(childId, nodes, adjList, visited, depth + 1);
    }
    return md;
};

const exportToMarkdown = (nodes: Map<string, NodeData>, connections: Connection[]) => {
    const adjList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(node => {
        adjList.set(node.id, []);
        inDegree.set(node.id, 0);
    });

    connections.forEach(conn => {
        adjList.get(conn.from)?.push(conn.to);
        inDegree.set(conn.to, (inDegree.get(conn.to) || 0) + 1);
    });

    const rootNodes = Array.from(nodes.keys()).filter(id => (inDegree.get(id) || 0) === 0);
    if (rootNodes.length === 0 && nodes.size > 0) {
        rootNodes.push(Array.from(nodes.keys())[0]);
    }

    let markdownContent = '# Mindmap / Funnel Export\n\n';
    const visited = new Set<string>();
    rootNodes.forEach(rootId => {
        markdownContent += buildMarkdown(rootId, nodes, adjList, visited, 0);
    });

    downloadFile(markdownContent, 'mindmap.md', 'text/markdown');
};

export const handleExport = (
    format: ExportFormat, 
    nodes: Map<string, NodeData>, 
    connections: Connection[], 
    // FIX: Use RefObject instead of React.RefObject.
    canvasRef: RefObject<HTMLDivElement>
) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    switch(format) {
        case 'png':
            exportToPng(canvasElement);
            break;
        case 'pdf':
            exportToPdf(canvasElement);
            break;
        case 'json':
            exportToJson(nodes, connections);
            break;
        case 'md':
            exportToMarkdown(nodes, connections);
            break;
    }
};
