import React, { useEffect, useRef, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Globe, Shield, RefreshCw } from 'lucide-react';

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidGoogleKey = Boolean(GOOGLE_API_KEY) && GOOGLE_API_KEY !== 'YOUR_API_KEY';

const HUBS = [
  { name: 'Kinshasa (HQ)', lat: -4.4419, lng: 15.2663, desc: 'Siège Social & Data Center' },
  { name: 'Lubumbashi', lat: -11.6609, lng: 27.4794, desc: 'Innovation & AI Lab' },
  { name: 'Abidjan', lat: 5.3600, lng: -4.0083, desc: 'Support Afrique de l\'Ouest' },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, desc: 'Ops. & Logistique' },
];

export function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'google'>(hasValidGoogleKey ? 'google' : 'leaflet');
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Dynamic Leaflet Loading
  useEffect(() => {
    if (mapEngine !== 'leaflet') return;

    let isMounted = true;

    const loadLeafletFiles = async () => {
      if ((window as any).L) {
        if (isMounted) setLeafletLoaded(true);
        return;
      }

      // Add Leaflet stylesheet
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add Leaflet script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        if (isMounted) setLeafletLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadLeafletFiles();

    return () => {
      isMounted = false;
    };
  }, [mapEngine]);

  // Leaflet Map Initialization and Pinning
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy previous instance
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    // Initialize Leaflet map centered in Central Africa
    const map = L.map(mapContainerRef.current).setView([-2.0, 12.0], 4);
    leafletMapRef.current = map;

    // Add beautiful dark theme tiles (or clean voyager style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    // Custom marker icon using simple SVG
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-10 w-10 rounded-full bg-[#006c4a]/30 animate-ping"></span>
          <div class="relative bg-[#006c4a] text-white p-2 rounded-full shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add markers
    HUBS.forEach((hub) => {
      const marker = L.marker([hub.lat, hub.lng], { icon: customIcon }).addTo(map);
      
      marker.bindTooltip(`
        <div class="p-2 font-sans">
          <strong class="text-sm text-[#0b1c30] block">${hub.name}</strong>
          <span class="text-xs text-[#6d7a72] block">${hub.desc}</span>
        </div>
      `, { permanent: false, direction: 'top' });

      marker.on('click', () => {
        setSelectedHub(hub);
        map.setView([hub.lat, hub.lng], 6);
      });
    });

  }, [mapEngine, leafletLoaded]);

  // Handle hub focus
  const handleHubSelect = (hub: typeof HUBS[0]) => {
    setSelectedHub(hub);
    if (mapEngine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.setView([hub.lat, hub.lng], 6);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
      
      {/* Map Header with Engine Switcher */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#006c4a] animate-spin-slow" />
          <span className="font-sans font-bold text-sm text-[#0b1c30]">Souveraineté des Données Live GPS</span>
        </div>

        {/* Engine switcher to support Google Maps */}
        <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-full text-[11px] font-semibold">
          <button
            onClick={() => setMapEngine('leaflet')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mapEngine === 'leaflet' ? 'bg-[#006c4a] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satelitte/OSM
          </button>
          <button
            onClick={() => setMapEngine('google')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mapEngine === 'google' ? 'bg-[#006c4a] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Maps
          </button>
        </div>
      </div>

      {/* Map display area */}
      <div className="relative flex-1 min-h-[340px] bg-slate-100">
        
        {mapEngine === 'leaflet' && (
          <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-10" />
        )}

        {mapEngine === 'google' && (
          <div className="w-full h-full absolute inset-0 z-10">
            {hasValidGoogleKey ? (
              <APIProvider apiKey={GOOGLE_API_KEY} version="weekly">
                <Map
                  defaultCenter={{ lat: -2.0, lng: 12.0 }}
                  defaultZoom={4}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {HUBS.map((hub) => (
                    <AdvancedMarker
                      key={hub.name}
                      position={{ lat: hub.lat, lng: hub.lng }}
                      title={hub.name}
                      onClick={() => setSelectedHub(hub)}
                    >
                      <Pin background="#006c4a" glyphColor="#fff" />
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-700">
                <div className="max-w-md space-y-4">
                  <Shield className="w-12 h-12 text-[#006c4a] mx-auto opacity-80" />
                  <h4 className="font-sans font-bold text-base text-[#0b1c30]">Google Maps API Key Requis</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Saisissez votre clé Google Maps dans les secrets de votre workspace AI Studio pour débloquer la vue Google Maps Premium :
                  </p>
                  <div className="bg-slate-150 p-3 rounded-xl border text-left text-[11px] font-mono leading-relaxed text-slate-600 space-y-1">
                    <div>1. Ouvrez <strong>Paramètres</strong> (Icône engrenage ⚙️ en haut à droite)</div>
                    <div>2. Choisissez <strong>Secrets</strong></div>
                    <div>3. Ajoutez <code>GOOGLE_MAPS_PLATFORM_KEY</code></div>
                  </div>
                  <button
                    onClick={() => setMapEngine('leaflet')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006c4a] hover:bg-[#005137] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retourner à la carte Satellite
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hub selection and info panel */}
      <div className="bg-slate-50 border-t border-slate-150 p-4 grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
        {HUBS.map((hub) => {
          const isActive = selectedHub.name === hub.name;
          return (
            <button
              key={hub.name}
              onClick={() => handleHubSelect(hub)}
              className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                isActive
                  ? 'bg-white border-[#006c4a] shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-slate-100'
              }`}
            >
              <p className="text-xs font-bold text-[#0b1c30] flex items-center gap-1">
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#006c4a]' : 'text-slate-400'}`} />
                {hub.name}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{hub.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
