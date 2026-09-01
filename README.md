# HufiOS Architecture Board

Visuelle Systemkarte für die HEYHUFI-/HufiOS-Architektur.

## Ursprung

Dieses Repository basiert auf dem früheren Google-AI-Studio-Mindmap-/Funnel-Projekt `PascalsProjektArchiv-2`. Der bestehende Funktionsumfang wird als Ausgangspunkt erhalten und nicht neu erfunden.

## Zweck

Das Board soll schrittweise zur visuellen Oberfläche für HufiOS werden. Es soll später reale Systemdaten aus HufiOS darstellen, ohne selbst zur technischen Source of Truth zu werden.

Geplante bzw. sinnvolle Knotentypen sind unter anderem:

- Project
- Service
- Agent
- Account
- Database
- Domain
- Repository
- Workflow
- Email Account
- Model
- Device
- Alert

## Architekturprinzip

```text
Geräte
  ↓
HufiOS
  ↓
HufiBoss
  ↓
Registry / Capabilities / Tool Gateway
  ↓
n8n / APIs / Agents
  ↓
HufManager / GitHub / Supabase / Gmail / weitere Systeme
```

Das Architecture Board ist dabei die **Visualisierungsschicht**. HufiOS bleibt die operative Source of Truth.

## Aktueller Stand

Der importierte Ausgangsstand enthält bereits:

- Mindmap-Ansicht
- Funnel-Ansicht
- verschiebbare Nodes
- Verbindungen zwischen Nodes
- verschiedene Node-Typen
- Beschreibungen, Bulletpoints und Links
- lokale Speicherung
- Export nach PNG, PDF, JSON und Markdown

## Nächste Entwicklung

1. Bestehende Funktionen stabil erhalten.
2. Datenmodell für HufiOS-Knoten sauber definieren.
3. Read-only Live-Daten aus HufiOS anbinden.
4. Health-/Status-Ampeln ergänzen.
5. Erst danach kontrollierte Aktionen über HufiOS freigeben.

## Sicherheitsregel

Das Board soll keine Secrets, Passwörter oder Tokens speichern. Schreibende oder administrative Aktionen gehören in die HufiOS-Policy-/Approval-Schicht und nicht direkt in die Visualisierung.
