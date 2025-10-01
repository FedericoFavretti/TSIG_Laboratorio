import React from 'react';
import { MapFilters } from '../../types';

interface FilterPanelProps {
    filters: MapFilters;
    onFiltersChange: (filters: MapFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
    const handleActiveOnlyChange = (activeOnly: boolean) => {
        onFiltersChange({ ...filters, activeOnly });
    };

    const handleShowDisabledChange = (showDisabled: boolean) => {
        onFiltersChange({ ...filters, showDisabled });
    };

    const handleSearchRadiusChange = (radius: number) => {
        onFiltersChange({ ...filters, searchRadius: radius });
    };

    return (
        <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            marginBottom: '1rem'
        }}>
            <h4>Filtros</h4>
            
            <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="checkbox"
                        checked={filters.activeOnly}
                        onChange={(e) => handleActiveOnlyChange(e.target.checked)}
                    />
                    Solo elementos activos
                </label>
            </div>
            
            <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="checkbox"
                        checked={filters.showDisabled}
                        onChange={(e) => handleShowDisabledChange(e.target.checked)}
                    />
                    Mostrar deshabilitados
                </label>
            </div>
            
            <div>
                <label>
                    Radio de búsqueda:
                    <select 
                        value={filters.searchRadius}
                        onChange={(e) => handleSearchRadiusChange(Number(e.target.value))}
                        style={{ marginLeft: '0.5rem' }}
                    >
                        <option value={500}>500m</option>
                        <option value={1000}>1km</option>
                        <option value={2000}>2km</option>
                        <option value={5000}>5km</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default FilterPanel;