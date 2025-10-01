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
    const mapRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);
    const [mapData, setMapData] = useState<{ stops: Stop[]; lines: Line[] }>({ stops: [], lines: [] });

    useEffect(() => {
        // Guardar referencias en variables locales para el closure
        const currentMapRef = mapRef.current;
        const currentOverlayRef = overlayRef.current;

        // Verificar que las referencias no sean nulas
        if (!currentMapRef || !currentOverlayRef) {
            console.error('Map references are not available');
            return;
        }

        let map: Map;

        const loadMap = async () => {
            try {
                const data = await fetchTransportData();
                setMapData({
                    stops: data.stops || [],
                    lines: data.lines || []
                });

                // Crear features para los stops
                const stopFeatures = (data.stops || []).map((stop: any) => {
                    const feature = new Feature({
                        geometry: new Point(fromLonLat([stop.location.longitude, stop.location.latitude])),
                        name: stop.name,
                        routes: stop.lines || stop.routes || [],
                        type: 'stop',
                        isActive: stop.isActive,
                        id: stop.id
                    });
                    
                    feature.setStyle(
                        new Style({
                            image: new Icon({
                                src: 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/examples/data/icon.png',
                                anchor: [0.5, 1],
                                scale: 0.05,
                            }),
                        })
                    );
                    return feature;
                });

                const vectorSource = new VectorSource({
                    features: stopFeatures,
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                });

                // Usar las referencias locales (TypeScript sabe que no son null aquí)
                map = new Map({
                    target: currentMapRef,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
                        vectorLayer,
                    ],
                    view: new View({
                        center: fromLonLat([-56.1645, -34.9011]),
                        zoom: 13,
                    }),
                });

                // Popup overlay - usar referencia local
                const overlay = new Overlay({
                    element: currentOverlayRef,
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
                            currentOverlayRef.innerHTML = `
                                <strong>${feature.get('name')}</strong><br/>
                                Routes: ${(feature.get('routes') || []).join(', ')}
                            `;
                            currentOverlayRef.style.display = 'block';
                        }
                    } else {
                        overlay.setPosition(undefined);
                        currentOverlayRef.style.display = 'none';
                    }
                });

                if (interactive) {
                    map.on('pointermove', function (e) {
                        const pixel = map.getEventPixel(e.originalEvent);
                        const hit = map.hasFeatureAtPixel(pixel);
                        currentMapRef.style.cursor = hit ? 'pointer' : (isAdmin ? 'crosshair' : '');
                    });
                }

                mapInstance.current = map;
            } catch (error) {
                console.error('Error loading map:', error);
            }
        };

        loadMap();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
            }
        };
    }, [searchResults, isAdmin, onMapClick, draftPoints, filters, interactive]);

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
                }}
            />
        </div>
    );
};

export default TransportMap;