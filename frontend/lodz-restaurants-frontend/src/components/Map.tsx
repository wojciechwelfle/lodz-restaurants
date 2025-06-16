import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type IRestaurant from "../types/IRestaurant";
import React, { useEffect, useState } from "react";

// @ts-expect-error: leaflet types are not complete
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    restaurants: IRestaurant[];
    selected?: IRestaurant | null;
    onMarkerClick: (restaurant: IRestaurant) => void;
    onMarkerHighlight: (restaurantId: number) => void;
}

const FlyTo = ({ position }: { position: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, {
                duration: 0.5,
                easeLinearity: 0.25,
            });
        }
    }, [position, map]);

    return null;
};

const Map: React.FC<MapProps> = ({ restaurants, selected, onMarkerClick, onMarkerHighlight }) => {
    const defaultCenter: [number, number] = [51.77720949875417, 19.45797264481472];
    const [lastSelected, setLastSelected] = useState<IRestaurant | null>(null);
    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        if (selected) {
            setLastSelected(selected);
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [selected]);

    return (
        <MapContainer
            key={mapKey}
            center={selected ? selected.position : defaultCenter}
            zoom={13}
            className="h-screen w-full"
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {restaurants.map((r) => (
                <Marker
                    key={r.id}
                    position={r.position}
                    icon={(selected && r.id === selected.id) || 
                          (!selected && lastSelected && r.id === lastSelected.id) 
                          ? redIcon : new L.Icon.Default()}
                    eventHandlers={{
                        click: () => {
                            onMarkerClick(r);
                            onMarkerHighlight(r.id);
                        },
                    }}
                >
                    <Popup>{r.name}</Popup>
                </Marker>
            ))}

            {selected && <FlyTo position={selected.position} />}
        </MapContainer>
    );
};

export default Map;
