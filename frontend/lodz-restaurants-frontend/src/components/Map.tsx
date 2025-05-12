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

interface MapProps {
    restaurants: IRestaurant[];
    selected?: IRestaurant | null;
}

const FlyTo = ({ position }: { position: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, {
                duration: 1,
                easeLinearity: 0.25,
            });
        }
    }, [position, map]);

    return null;
};

const Map: React.FC<MapProps> = ({ restaurants, selected }) => {
    const defaultCenter: [number, number] = [52.2297, 21.0122];

    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        if (selected) {
            setMapKey((prevKey) => prevKey + 1);
        }
    }, [selected]);

    return (
        <MapContainer
            key={mapKey}
            center={selected ? selected.position : defaultCenter}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {restaurants.map((r) => (
                <Marker key={r.id} position={r.position}>
                    <Popup>{r.name}</Popup>
                </Marker>
            ))}

            {selected && <FlyTo position={selected.position} />}
        </MapContainer>
    );
};

export default Map;
