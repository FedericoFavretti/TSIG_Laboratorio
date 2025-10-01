import React, { useState } from 'react';
import type { LineSearchCriteria, AddressSearchCriteria, IntersectionSearchCriteria } from '../../types';

interface AdvancedSearchProps {
    onLineSearch: (criteria: LineSearchCriteria) => void;
    onAddressSearch: (criteria: AddressSearchCriteria) => void;
    onIntersectionSearch: (criteria: IntersectionSearchCriteria) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    onLineSearch,
    onAddressSearch,
    onIntersectionSearch
}) => {
    const [searchType, setSearchType] = useState<'line' | 'address' | 'intersection'>('line');
    const [lineCode, setLineCode] = useState('');
    const [destination, setDestination] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [street1, setStreet1] = useState('');
    const [street2, setStreet2] = useState('');

    const handleLineSearch = () => {
        onLineSearch({
            type: 'code',
            code: lineCode,
            destination: destination || undefined
        });
    };

    const handleAddressSearch = () => {
        onAddressSearch({
            street,
            number: number || undefined
        });
    };

    const handleIntersectionSearch = () => {
        onIntersectionSearch({
            street1,
            street2
        });
    };

    const clearForm = () => {
        setLineCode('');
        setDestination('');
        setStreet('');
        setNumber('');
        setStreet1('');
        setStreet2('');
    };

    return (
        <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
        }}>
            <h4>Búsqueda Avanzada</h4>
            
            <div style={{ marginBottom: '1rem' }}>
                <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem' }}
                >
                    <option value="line">Buscar por Línea</option>
                    <option value="address">Buscar por Dirección</option>
                    <option value="intersection">Buscar por Cruce</option>
                </select>
            </div>

            {searchType === 'line' && (
                <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Código de línea (ej: 104)"
                            value={lineCode}
                            onChange={(e) => setLineCode(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Destino (opcional)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button 
                        onClick={handleLineSearch}
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none' }}
                    >
                        Buscar Línea
                    </button>
                </div>
            )}

            {searchType === 'address' && (
                <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Calle"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Número (opcional)"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button 
                        onClick={handleAddressSearch}
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none' }}
                    >
                        Buscar Dirección
                    </button>
                </div>
            )}

            {searchType === 'intersection' && (
                <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Primera calle"
                            value={street1}
                            onChange={(e) => setStreet1(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Segunda calle"
                            value={street2}
                            onChange={(e) => setStreet2(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button 
                        onClick={handleIntersectionSearch}
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none' }}
                    >
                        Buscar Cruce
                    </button>
                </div>
            )}

            <button 
                onClick={clearForm}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none' }}
            >
                Limpiar
            </button>
        </div>
    );
};

export default AdvancedSearch;