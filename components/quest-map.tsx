"use client";

import { useEffect } from "react";
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { getActiveCoupon } from "@/lib/quest";
import { SINGAPORE_CENTER } from "@/lib/map-experience";
import type { Restaurant } from "@/lib/types";

const queueColors = { green: "#58a55c", amber: "#f7b32b", red: "#e0523a" } as const;

function Pin({ restaurant, selected, onSelect }: { restaurant: Restaurant; selected: boolean; onSelect: () => void }) {
  const icon = L.divIcon({
    className: "quest-pin-wrap",
    html: `<div class="quest-pin ${selected ? "quest-pin-selected" : ""}" style="--queue:${queueColors[restaurant.queue]}"><span>${restaurant.emoji}</span><i></i>${getActiveCoupon(restaurant) ? "<b>🎟</b>" : ""}</div>`,
    iconSize: [54, 64],
    iconAnchor: [27, 58],
  });
  return (
    <Marker position={[restaurant.lat, restaurant.lng]} icon={icon} eventHandlers={{ click: onSelect }}>
      <Tooltip direction="top" offset={[0, -52]} opacity={1}>{restaurant.name}</Tooltip>
    </Marker>
  );
}

function Recenter({ restaurant }: { restaurant?: Restaurant }) {
  const map = useMap();
  useEffect(() => {
    if (restaurant) map.flyTo([restaurant.lat, restaurant.lng], 15, { duration: 1.2 });
  }, [map, restaurant]);
  return null;
}

export default function QuestMap({
  restaurants,
  selected,
  onSelect,
  routeTo,
}: {
  restaurants: Restaurant[];
  selected?: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  routeTo?: Restaurant;
}) {
  const user = SINGAPORE_CENTER;
  return (
    <MapContainer center={user} zoom={14} zoomControl={false} attributionControl={false} className="h-full w-full">
      <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={user} radius={90} pathOptions={{ color: "#2b2320", fillColor: "#fff", fillOpacity: 0.5, weight: 2 }} />
      {routeTo && <Polyline positions={[user, [routeTo.lat, routeTo.lng]]} pathOptions={{ color: "#e1623f", weight: 6, dashArray: "2 12", lineCap: "round" }} />}
      {restaurants.map((restaurant) => (
        <Pin key={restaurant.id} restaurant={restaurant} selected={selected?.id === restaurant.id} onSelect={() => onSelect(restaurant)} />
      ))}
      <Recenter restaurant={selected} />
    </MapContainer>
  );
}
