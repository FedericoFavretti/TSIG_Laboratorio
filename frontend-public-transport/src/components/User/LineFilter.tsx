// components/User/LineFilter.tsx
import React, { useState } from 'react';
import type { LineSearchCriteria } from '../../types/index';

interface LineFilterProps {
  onSearch: (criteria: LineSearchCriteria) => void;
}

const LineFilter: React.FC<LineFilterProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState<'code' | 'company'>('code');
  const [code, setCode] = useState('');
  const [destination, setDestination] = useState('');
  const [company, setCompany] = useState('');

  const handleSearch = () => {
    if (searchType === 'code') {
      onSearch({
        type: 'code',
        code,
        destination: destination || undefined
      });
    } else {
      onSearch({
        type: 'company',
        company
      });
    }
  };

  return (
    <div className="line-filter">
      <div className="search-type">
        <label>
          <input
            type="radio"
            value="code"
            checked={searchType === 'code'}
            onChange={() => setSearchType('code')}
          />
          Buscar por código
        </label>
        <label>
          <input
            type="radio"
            value="company"
            checked={searchType === 'company'}
            onChange={() => setSearchType('company')}
          />
          Buscar por empresa
        </label>
      </div>

      {searchType === 'code' ? (
        <div className="code-search">
          <input
            type="text"
            placeholder="Código de línea (ej: 104)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Destino (opcional)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      ) : (
        <div className="company-search">
          <input
            type="text"
            placeholder="Empresa (ej: CUCTSA)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};

export default LineFilter;