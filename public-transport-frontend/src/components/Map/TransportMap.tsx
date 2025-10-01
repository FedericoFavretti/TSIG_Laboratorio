import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Icon, Style, Stroke, Fill, Circle } from 'ol/style';
import Overlay from 'ol/Overlay';
import { fetchTransportData } from '../../services/api';
import { MapFilters, Stop, Line, Coordinate } from '../../types';
import 'ol/ol.css';

interface TransportMapProps {
    searchResults?: any[];
    isAdmin?: boolean;
    onMapClick?: (coordinates: Coordinate) => void;
    draftPoints?: Coordinate[];
    filters?: MapFilters;
    showUserControls?: boolean;
    interactive?: boolean;
}

const TransportMap: React.FC<TransportMapProps> = ({ 
    searchResults = [], 
    isAdmin = false,
    onMapClick,
    draftPoints = [],
    filters,
    showUserControls = false,
    interactive = true
}) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<Map | null>(null);
    const [mapData, setMapData] = useState<{ stops: Stop[]; lines: Line[] }>({ stops: [], lines: [] });

    useEffect(() => {
        let map: Map;

        const loadMap = async () => {
            try {
                const data = await fetchTransportData();
                setMapData({
                    stops: data.stops || [],
                    lines: data.lines || []
                });

                // Aplicar filtros si existen
                const filteredStops = applyFilters(data.stops || [], filters);
                const filteredLines = applyLineFilters(data.lines || [], filters);

                // Crear features para los stops
                const stopFeatures = filteredStops.map((stop: Stop) => {
                    const feature = new Feature({
                        geometry: new Point(fromLonLat([stop.location.longitude, stop.location.latitude])),
                        name: stop.name,
                        // Usar lines si existe, sino routes para compatibilidad
                        routes: stop.lines || stop.routes || [],
                        type: 'stop',
                        isActive: stop.isActive,
                        id: stop.id
                    });
                    
                    // Estilo diferente según el estado y si está en resultados de búsqueda
                    const isInSearchResults = searchResults.some(result => {
                        const stopLines = stop.lines || stop.routes || [];
                        return stopLines.includes(result.code);
                    });
                    const isActive = stop.isActive !== false;

                    feature.setStyle(
                        new Style({
                            image: new Icon({
                                src: getStopIcon(isActive, isInSearchResults),
                                anchor: [0.5, 1],
                                scale: getStopScale(isActive, isInSearchResults),
                            }),
                        })
                    );
                    return feature;
                });

                // Crear features para las líneas
                const lineFeatures = filteredLines.map((line: Line) => {
                    // Si la línea tiene ruta definida, usarla, sino crear una ruta básica
                    let lineCoords: number[][];
                    
                    if (line.route && line.route.length > 0) {
                        lineCoords = line.route.map((coord: Coordinate) => 
                            fromLonLat([coord.lng, coord.lat])
                        );
                    } else {
                        // Crear una ruta básica si no existe
                        lineCoords = [
                            fromLonLat([-56.1645, -34.9011]), // Montevideo centro
                            fromLonLat([-56.1745, -34.9111])  // Un punto cercano
                        ];
                    }

                    const feature = new Feature({
                        geometry: new LineString(lineCoords),
                        name: line.code,
                        company: line.company,
                        type: 'line',
                        isActive: line.isActive,
                        id: line.id
                    });
                    
                    feature.setStyle(
                        new Style({
                            stroke: new Stroke({
                                color: getLineColor(line.isActive),
                                width: 4,
                                lineDash: line.isActive === false ? [5, 5] : undefined
                            })
                        })
                    );
                    return feature;
                });

                // Crear features para los puntos de draft (línea en progreso)
                const draftFeatures = draftPoints.map((point: Coordinate, index: number) => {
                    const feature = new Feature({
                        geometry: new Point(fromLonLat([point.lng, point.lat])),
                        type: 'draft-point',
                        index: index
                    });
                    
                    feature.setStyle(
                        new Style({
                            image: new Circle({
                                radius: 6,
                                fill: new Fill({ color: '#007bff' }),
                                stroke: new Stroke({ color: '#ffffff', width: 2 })
                            })
                        })
                    );
                    return feature;
                });

                // Crear línea para conectar puntos de draft
                let draftLineFeature: Feature | null = null;
                if (draftPoints.length > 1) {
                    const lineCoords = draftPoints.map((point: Coordinate) => 
                        fromLonLat([point.lng, point.lat])
                    );
                    draftLineFeature = new Feature({
                        geometry: new LineString(lineCoords),
                        type: 'draft-line'
                    });
                    
                    draftLineFeature.setStyle(
                        new Style({
                            stroke: new Stroke({
                                color: '#007bff',
                                width: 4,
                                lineDash: [5, 5]
                            })
                        })
                    );
                }

                const vectorSource = new VectorSource({
                    features: [
                        ...stopFeatures, 
                        ...lineFeatures, 
                        ...draftFeatures, 
                        ...(draftLineFeature ? [draftLineFeature] : [])
                    ],
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                });

                map = new Map({
                    target: mapRef.current as HTMLDivElement,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
                        vectorLayer,
                    ],
                    view: new View({
                        center: fromLonLat([-56.1645, -34.9011]), // Montevideo
                        zoom: 13,
                    }),
                });

                // Popup overlay
                const overlay = new Overlay({
                    element: overlayRef.current as HTMLDivElement,
                    autoPan: {
                        animation: {
                            duration: 250,
                        },
                    },
                });
                map.addOverlay(overlay);

                map.on('singleclick', function (evt) {
                    const coordinates = map.getCoordinateFromPixel(evt.pixel);
                    const lonLat = toLonLat(coordinates);
                    
                    // Si es modo admin y hay callback, llamarlo
                    if (isAdmin && onMapClick && interactive) {
                        onMapClick({
                            lat: lonLat[1],
                            lng: lonLat[0]
                        });
                    }

                    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
                        return feat;
                    });
                    
                    if (feature) {
                        const geometry = feature.getGeometry();
                        if (geometry instanceof Point) {
                            const featureCoordinates = geometry.getCoordinates();
                            overlay.setPosition(featureCoordinates);
                            if (overlayRef.current) {
                                const featureType = feature.get('type');
                                if (featureType === 'draft-point') {
                                    overlayRef.current.innerHTML = `
                                        <strong>Punto de Línea</strong><br/>
                                        Orden: ${feature.get('index') + 1}
                                    `;
                                } else {
                                    const routes = feature.get('routes') || [];
                                    overlayRef.current.innerHTML = `
                                        <strong>${feature.get('name')}</strong><br/>
                                        ${routes.length > 0 ? `Líneas: ${routes.join(', ')}<br/>` : ''}
                                        ${feature.get('company') ? `Empresa: ${feature.get('company')}<br/>` : ''}
                                        Estado: ${feature.get('isActive') !== false ? 'Activo' : 'Inactivo'}
                                    `;
                                }
                                overlayRef.current.style.display = 'block';
                            }
                        }
                    } else {
                        overlay.setPosition(undefined);
                        if (overlayRef.current) {
                            overlayRef.current.style.display = 'none';
                        }
                    }
                });

                // Cambiar el cursor al pasar sobre features
                if (interactive) {
                    map.on('pointermove', function (e) {
                        const pixel = map.getEventPixel(e.originalEvent);
                        const hit = map.hasFeatureAtPixel(pixel);
                        (map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : (isAdmin ? 'crosshair' : '');
                    });
                }

                mapInstance.current = map;
            } catch (error) {
                console.error('Error loading map data:', error);
            }
        };

        if (mapRef.current) {
            loadMap();
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
            }
        };
    }, [searchResults, isAdmin, onMapClick, draftPoints, filters, interactive]);

    // Funciones auxiliares para estilos
    const getStopIcon = (isActive: boolean, isInSearchResults: boolean): string => {
        if (!isActive) return 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/examples/data/dot-red.png';
        if (isInSearchResults) return 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/examples/data/dot-green.png';
        return 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/examples/data/icon.png';
    };

    const getStopScale = (isActive: boolean, isInSearchResults: boolean): number => {
        if (isInSearchResults) return 0.08;
        if (!isActive) return 0.04;
        return 0.05;
    };

    const getLineColor = (isActive: boolean | undefined): string => {
        if (isActive === false) return '#ff0000';
        return '#007bff';
    };

    // Aplicar filtros a las paradas
    const applyFilters = (stops: Stop[], filters?: MapFilters): Stop[] => {
        if (!filters) return stops;
        
        return stops.filter(stop => {
            // Filtro por estado activo/inactivo
            if (filters.activeOnly && stop.isActive === false) return false;
            
            // Filtro por mostrar deshabilitados
            if (!filters.showDisabled && stop.isActive === false) return false;
            
            // Filtro por empresas (implementación básica)
            if (filters.companies.length > 0) {
                // Aquí necesitarías lógica para relacionar paradas con empresas
                // Por ahora, asumimos que todas las paradas pasan el filtro
            }
            
            return true;
        });
    };

    // Aplicar filtros a las líneas
    const applyLineFilters = (lines: Line[], filters?: MapFilters): Line[] => {
        if (!filters) return lines;
        
        return lines.filter(line => {
            // Filtro por estado activo/inactivo
            if (filters.activeOnly && line.isActive === false) return false;
            
            // Filtro por mostrar deshabilitados
            if (!filters.showDisabled && line.isActive === false) return false;
            
            // Filtro por empresas
            if (filters.companies.length > 0 && !filters.companies.includes(line.company)) {
                return false;
            }
            
            return true;
        });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {isAdmin && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '2px solid #007bff',
                    fontSize: '14px'
                }}>
                    <strong>🔧 Modo Administrador</strong>
                    <div style={{ marginTop: '5px' }}>
                        {draftPoints.length > 0 ? (
                            <span>📌 Línea en progreso: <strong>{draftPoints.length} puntos</strong></span>
                        ) : (
                            <span>Haz clic en el mapa para agregar elementos</span>
                        )}
                    </div>
                </div>
            )}
            
            {showUserControls && !isAdmin && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                }}>
                    <strong>👤 Modo Usuario</strong>
                    <div style={{ marginTop: '5px' }}>
                        {filters?.activeOnly ? 'Solo activos' : 'Todos'} | 
                        Radio: {filters?.searchRadius ? `${filters.searchRadius}m` : '1km'}
                    </div>
                </div>
            )}
            
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            <div
                ref={overlayRef}
                style={{
                    background: 'white',
                    borderRadius: 4,
                    padding: 8,
                    border: '1px solid #ccc',
                    minWidth: 120,
                    position: 'absolute',
                    display: 'none',
                    pointerEvents: 'none',
                    fontSize: '14px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    maxWidth: '250px',
                    wordWrap: 'break-word'
                }}
            />
        </div>
    );
};

export default TransportMap;