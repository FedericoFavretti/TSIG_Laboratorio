// components/Map/AdminMap.tsx
import React, { useState, useCallback } from 'react';
import { Line, Stop } from '../../types/index';

const AdminMap: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<'line' | 'stop' | 'edit' | null>(null);
  const [draftLine, setDraftLine] = useState<Line | null>(null);
  const [draftStop, setDraftStop] = useState<Partial<Stop> | null>(null);

  const handleMapClick = useCallback((coordinates: { lat: number; lng: number }) => {
    if (selectedTool === 'line') {
      // Lógica para dibujar línea
    } else if (selectedTool === 'stop') {
      // Lógica para crear parada
    }
  }, [selectedTool]);

  return (
    <div className="admin-map">
      <div className="toolbar">
        <button onClick={() => setSelectedTool('line')}>Dibujar Línea</button>
        <button onClick={() => setSelectedTool('stop')}>Agregar Parada</button>
        <button onClick={() => setSelectedTool('edit')}>Editar Elementos</button>
      </div>
      <TransportMap 
        interactive={true}
        onMapClick={handleMapClick}
        showAdminControls={true}
        draftLine={draftLine}
        draftStop={draftStop}
      />
    </div>
  );
};