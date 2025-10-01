import React, { useState } from 'react';
import StopEditor from './StopEditor';

const StopManagement: React.FC = () => {
    const [selectedStopId, setSelectedStopId] = useState<string>('');

    return (
        <div>
            <h2>Gestión de Paradas</h2>
            <div>
                <label>
                    Seleccionar Parada:
                    <input 
                        type="text" 
                        value={selectedStopId}
                        onChange={(e) => setSelectedStopId(e.target.value)}
                        placeholder="ID de la parada"
                    />
                </label>
            </div>
            {selectedStopId && <StopEditor stopId={selectedStopId} />}
        </div>
    );
};

export default StopManagement;