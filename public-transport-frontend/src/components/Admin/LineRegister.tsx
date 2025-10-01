// components/Admin/LineRegister.tsx
import React, { useState } from 'react';

const LineRegister: React.FC = () => {
  const [lineData, setLineData] = useState({
    code: '',
    origin: '',
    destination: '',
    company: '',
    route: [] as Array<{ lat: number; lng: number }>
  });

  // Lógica para registrar nueva línea
  return (
    <div>
      <h3>Registrar Nueva Línea</h3>
      {/* Formulario para datos básicos */}
      {/* Mapa para dibujar recorrido */}
    </div>
  );
};