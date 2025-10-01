// components/User/AdvancedSearch.tsx
const AdvancedSearch: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    lineCode: '',
    street1: '',
    street2: '',
    address: '',
    company: '',
    polygon: [] as Array<{ lat: number; lng: number }>
  });

  // Lógicas para diferentes tipos de búsqueda
  return (
    <div className="advanced-search">
      <div className="search-tabs">
        <button onClick={() => setSearchType('line')}>Buscar Línea</button>
        <button onClick={() => setSearchType('intersection')}>Buscar Cruce</button>
        <button onClick={() => setSearchType('address')}>Buscar Dirección</button>
        <button onClick={() => setSearchType('company')}>Buscar por Empresa</button>
        <button onClick={() => setSearchType('polygon')}>Buscar en Polígono</button>
      </div>
      
      {searchType === 'line' && <LineSearch />}
      {searchType === 'intersection' && <IntersectionSearch />}
      {/* ... otros tipos de búsqueda */}
    </div>
  );
};