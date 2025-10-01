import React, { useEffect, useRef } from 'react';
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
import 'ol/ol.css';

interface TransportMapProps {
    searchResults?: any[];
    isAdmin?: boolean;
    onMapClick?: (coordinates: { lat: number; lng: number }) => void;
    draftPoints?: Array<{ lat: number; lng: number }>;
}

const TransportMap: React.FC<TransportMapProps> = ({ 
    searchResults = [], 
    isAdmin = false,
    onMapClick,
    draftPoints = []
}) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<Map | null>(null);

    useEffect(() => {
        let map: Map;

        const loadMap = async () => {
            const data = await fetchTransportData();
            const stops = data.stops || [];

            // Crear features para los stops existentes
            const stopFeatures = stops.map((stop: any) => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat([stop.longitude, stop.latitude])),
                    name: stop.name,
                    routes: stop.routes,
                    type: 'stop'
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

            // Crear features para los puntos de draft (línea en progreso)
            const draftFeatures = draftPoints.map((point, index) => {
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
            let lineFeature: Feature | null = null;
            if (draftPoints.length > 1) {
                const lineCoords = draftPoints.map(point => 
                    fromLonLat([point.lng, point.lat])
                );
                lineFeature = new Feature({
                    geometry: new LineString(lineCoords),
                    type: 'draft-line'
                });
                
                lineFeature.setStyle(
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
                features: [...stopFeatures, ...draftFeatures, ...(lineFeature ? [lineFeature] : [])],
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
                if (isAdmin && onMapClick) {
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
                                overlayRef.current.innerHTML = `
                                    <strong>${feature.get('name')}</strong><br/>
                                    Routes: ${(feature.get('routes') || []).join(', ')}
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
            map.on('pointermove', function (e) {
                const pixel = map.getEventPixel(e.originalEvent);
                const hit = map.hasFeatureAtPixel(pixel);
                (map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : (isAdmin ? 'crosshair' : '');
            });

            mapInstance.current = map;
        };

        if (mapRef.current) {
            loadMap();
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
            }
        };
    }, [searchResults, isAdmin, onMapClick, draftPoints]);

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