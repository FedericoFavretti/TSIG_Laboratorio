import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { fetchTransportData } from '../../services/api';
import 'ol/ol.css';

// Define el tipo para los datos del transporte
interface TransportData {
  stops: Stop[];
  routes?: any[];
}

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes?: string[];
}

const TransportMap: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<Map | null>(null);

    useEffect(() => {
        let map: Map;

        const loadMap = async () => {
            const data: TransportData = await fetchTransportData();
            const stops = data.stops || [];

            // Crear features para los stops
            const features = stops.map((stop: Stop) => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat([stop.longitude, stop.latitude])),
                    name: stop.name,
                    routes: stop.routes || [],
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
                features: features,
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
                    center: fromLonLat([-56.1645, -34.9011]), // Coordenadas de Montevideo
                    zoom: 13,
                }),
            });

            // Popup overlay - CORREGIDO
            const overlay = new Overlay({
                element: overlayRef.current as HTMLDivElement,
                autoPan: {
                    animation: {
                        duration: 250, // Mover la animación aquí
                    },
                },
            });
            map.addOverlay(overlay);

            map.on('singleclick', function (evt) {
                const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
                    return feat;
                });
                
                if (feature) {
                    const geometry = feature.getGeometry();
                    if (geometry instanceof Point) {
                        const coordinates = geometry.getCoordinates();
                        overlay.setPosition(coordinates);
                        if (overlayRef.current) {
                            overlayRef.current.innerHTML = `
                                <strong>${feature.get('name')}</strong><br/>
                                Routes: ${(feature.get('routes') || []).join(', ')}
                            `;
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
                (map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : '';
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
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
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
                    pointerEvents: 'none', // Cambiado a 'none' para evitar interferencias
                    fontSize: '14px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
            />
        </div>
    );
};

export default TransportMap;