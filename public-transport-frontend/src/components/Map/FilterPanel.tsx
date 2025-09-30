import React, { useState } from 'react';

const FilterPanel = ({ onFilterChange }) => {
    const [lineFilter, setLineFilter] = useState('');
    const [stopFilter, setStopFilter] = useState('');

    const handleLineFilterChange = (event) => {
        setLineFilter(event.target.value);
        onFilterChange(event.target.value, stopFilter);
    };

    const handleStopFilterChange = (event) => {
        setStopFilter(event.target.value);
        onFilterChange(lineFilter, event.target.value);
    };

    return (
        <div className="filter-panel">
            <h3>Filter Options</h3>
            <div>
                <label htmlFor="line-filter">Filter by Line:</label>
                <input
                    type="text"
                    id="line-filter"
                    value={lineFilter}
                    onChange={handleLineFilterChange}
                />
            </div>
            <div>
                <label htmlFor="stop-filter">Filter by Stop:</label>
                <input
                    type="text"
                    id="stop-filter"
                    value={stopFilter}
                    onChange={handleStopFilterChange}
                />
            </div>
        </div>
    );
};

export default FilterPanel;