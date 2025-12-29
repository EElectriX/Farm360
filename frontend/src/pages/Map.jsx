import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- Search Component ---
const SearchField = ({ setPosition }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar",
      autoComplete: true,
      autoClose: true,
      searchLabel: "Enter address",
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      if (result && result.location) {
        setPosition({
          lat: result.location.y,
          lng: result.location.x,
        });
      }
    });

    return () => map.removeControl(searchControl);
  }, [map, setPosition]);

  return null;
};

// --- Click Handler ---
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Selected Location: <br /> {position.lat.toFixed(5)},{" "}
        {position.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
}

// ------
const Map = ({ position, setPosition }) => {
  const defaultPosition = [22.9868, 87.855]; 

  return (
    <div className="h-[85vh] w-full flex flex-col md:flex-row bg-gray-50">
      
      {/* --- LEFT --- */}
      <div className="w-full md:w-2/3 h-full relative z-0">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <SearchField setPosition={setPosition} />

          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* --- RIGHT --- */}
      <div className="w-full md:w-1/3 h-full p-8 flex flex-col justify-center items-center bg-white shadow-l z-10">
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          Location Selector
        </h2>

        <p className="text-gray-600 mb-8 text-center">
          Search for a place or click on the map to pin-point your farm.
        </p>

        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl w-full max-w-sm shadow-md">
          <h3 className="text-lg font-bold text-yellow-800 border-b border-yellow-200 pb-2 mb-4">
            Coordinates
          </h3>

          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Latitude:</span>
            <span className="text-green-700 font-mono">
              {position ? position.lat.toFixed(6) : "--"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Longitude:</span>
            <span className="text-green-700 font-mono">
              {position ? position.lng.toFixed(6) : "--"}
            </span>
          </div>
        </div>

        {position && (
          <button
            className="mt-8 bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition-transform hover:scale-105 shadow-lg"
            onClick={() =>
              alert(`Saved Location: ${position.lat}, ${position.lng}`)
            }
          >
            Location Confirmed
          </button>
        )}
      </div>
    </div>
  );
};

export default Map;