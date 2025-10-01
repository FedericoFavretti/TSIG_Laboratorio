import React from 'react';
import type { MapFilters } from '../../types';

interface SearchPanelProps {
    searchType: 'line' | 'address' | 'intersection' | 'company' | 'polygon';
    onSearchTypeChange: (type: 'line' | 'address' | 'intersection' | 'company' | 'polygon') => void;
    onFiltersChange: (filters: MapFilters) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ 
    searchType, 
    onSearchTypeChange, 
    onFiltersChange 
}) => {
    return (
        <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f5f5f5', 
            borderBottom: '1px solid #ddd' 
        }}>
            <h3>Búsqueda de Transporte</h3>
            
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '1rem' }}>
                    Tipo de búsqueda:
                    <select 
                        value={searchType}
                        onChange={(e) => onSearchTypeChange(e.target.value as any)}
                        style={{ marginLeft: '0.5rem' }}
                    >
                        <option value="line">Por Línea</option>
                        <option value="address">Por Dirección</option>
                        <option value="intersection">Por Cruce</option>
                        <option value="company">Por Empresa</option>
                        <option value="polygon">En Polígono</option>
                    </select>
                </label>
            </div>

            {/* Aquí podrías agregar campos específicos para cada tipo de búsqueda */}
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <p>Selecciona el tipo de búsqueda y utiliza el mapa para encontrar rutas y paradas.</p>
            </div>
        </div>
    );
};

export default SearchPanel;