
export enum NodeType {
    Idea = 'Idee',
    Step = 'Schritt',
    Task = 'Aufgabe',
    Module = 'Modul',
    Channel = 'Kanal',
    TargetGroup = 'Zielgruppe',
    Offer = 'Angebot',
    CTA = 'CTA',
    Phase = 'Phase',
    Text = 'Textfeld',
}

export type NodeColor = 'orange' | 'black' | 'white' | 'gray';

export interface NodeData {
    id: string;
    type: NodeType;
    text: string;
    x: number;
    y: number;
    color: NodeColor;
    description: string;
    bulletPoints: string[];
    links: string[];
}

export interface Connection {
    from: string;
    to: string;
}

export type ViewMode = 'mindmap' | 'funnel';

export type ExportFormat = 'png' | 'pdf' | 'json' | 'md';