import React, { useState } from 'react';
import TransportMap from './TransportMap';
import SearchPanel from '../User/SearchPanel';
import type { MapFilters } from '../../types';

const UserMap: React.FC = () => {
    const [filters, setFilters] = useState<MapFilters>({
        companies: [],
        activeOnly: true,
        showDisabled: false,
        timeRange: { start: '06:00', end: '22:00' },
        searchRadius: 1000
    });

    const [searchType, setSearchType] = useState<'line' | 'address' | 'intersection' | 'company' | 'polygon'>('line');
    
    return (
        <div className="user-map" style={{ width: '100%', height: '100%' }}>
            <SearchPanel 
                searchType={searchType}
                onSearchTypeChange={setSearchType}
                onFiltersChange={setFilters}
            />
            <TransportMap 
                interactive={true}
                filters={filters}
                showUserControls={true}
            />
        </div>
    );
};

export default UserMap;