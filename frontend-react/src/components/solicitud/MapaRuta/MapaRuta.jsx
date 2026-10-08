import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CENTRO_MEDELLIN, LIMITES_VALLE } from "../../../data/medellin";
import "./MapaRuta.css";

// Íconos HTML (evitan el problema de las imágenes por defecto de Leaflet con Vite)
const crearPin = (clase, texto) =>
  L.divIcon({
    className: "",
    html: `<div class="mapa-pin ${clase}"><span>${texto}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });

const PIN_ORIGEN = crearPin("mapa-pin--origen", "A");
const PIN_DESTINO = crearPin("mapa-pin--destino", "B");
const PIN_VEHICULO = L.divIcon({
  className: "",
  html: `<div class="mapa-vehiculo">🚚</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function ClickEnMapa({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Ajusta el zoom para que se vean ambos puntos
function AjustarVista({ origen, destino }) {
  const map = useMap();
  useEffect(() => {
    if (origen && destino) {
      map.fitBounds([[origen.lat, origen.lng], [destino.lat, destino.lng]], { padding: [50, 50] });
    } else if (origen || destino) {
      const p = origen || destino;
      map.setView([p.lat, p.lng], Math.max(map.getZoom(), 14));
    }
  }, [map, origen?.lat, origen?.lng, destino?.lat, destino?.lng]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/**
 * Mapa de Medellín con origen (A), destino (B) y vehículo opcional.
 * - onSelect: si se pasa, el mapa es interactivo y devuelve el punto clickeado.
 * - onMove(tipo, punto): si se pasa, los pines A y B se pueden arrastrar.
 * - vehiculo: { lat, lng } posición actual del transportista (seguimiento).
 */
function MapaRuta({ origen, destino, vehiculo, onSelect, onMove, alto = 380 }) {
  const arrastrable = (tipo) =>
    onMove && {
      draggable: true,
      eventHandlers: {
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          onMove(tipo, { lat, lng });
        },
      },
    };

  return (
    <div className="mapa-ruta" style={{ height: alto }}>
      <MapContainer
        center={CENTRO_MEDELLIN}
        zoom={12}
        minZoom={11}
        maxBounds={LIMITES_VALLE}
        maxBoundsViscosity={1}
        scrollWheelZoom
        className={onSelect ? "mapa-interactivo" : ""}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onSelect && <ClickEnMapa onSelect={onSelect} />}
        <AjustarVista origen={origen} destino={destino} />

        {origen && <Marker position={[origen.lat, origen.lng]} icon={PIN_ORIGEN} {...arrastrable("origen")} />}
        {destino && <Marker position={[destino.lat, destino.lng]} icon={PIN_DESTINO} {...arrastrable("destino")} />}
        {origen && destino && (
          <Polyline
            positions={[[origen.lat, origen.lng], [destino.lat, destino.lng]]}
            pathOptions={{ color: "#FFC107", weight: 4, dashArray: "8 8" }}
          />
        )}
        {vehiculo && <Marker position={[vehiculo.lat, vehiculo.lng]} icon={PIN_VEHICULO} />}
      </MapContainer>
    </div>
  );
}

export default MapaRuta;
