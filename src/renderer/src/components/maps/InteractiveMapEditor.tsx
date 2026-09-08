import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Castle, 
  Mountain, 
  Building2, 
  Sparkles, 
  Ship, 
  Flag, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Hand, 
  Plus, 
  Minus,
  Trash2, 
  ExternalLink, 
  Layers, 
  Search, 
  X, 
  Maximize2, 
  Minimize2, 
  Edit3, 
  Image as ImageIcon,
  Skull,
  GripHorizontal,
  Crosshair
} from 'lucide-react';
import { MapEntry, MapPin as MapPinType, MapPinIcon, WorldEntry } from '../../types';
import { ImageUploadModal } from '../modals/ImageUploadModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { CustomSelect, CustomSelectOption } from '../common/CustomSelect';

interface InteractiveMapEditorProps {
  map: MapEntry | null;
  allMaps: MapEntry[];
  worldEntries: WorldEntry[];
  onUpdateMap: (map: MapEntry) => void;
  onDeleteMap: (id: string) => void;
  onAddMap: () => void;
  onNavigateToWorld: (worldId: string) => void;
  t: (key: string) => string;
}

const PIN_COLORS = [
  { value: '#1B4332', label: 'Verde Folia' },
  { value: '#991B1B', label: 'Rosso Rubino' },
  { value: '#B45309', label: 'Ambra Dorata' },
  { value: '#1E40AF', label: 'Blu Zaffiro' },
  { value: '#6B21A8', label: 'Viola Ametista' },
  { value: '#374151', label: 'Grigio Ardesia' },
  { value: '#111827', label: 'Nero Ossidiana' },
  { value: '#FFFFFF', label: 'Bianco Perla' }
];

const isLightPinColor = (color?: string): boolean => {
  if (!color) return false;
  const c = color.toLowerCase();
  return c === '#ffffff' || c === '#fff' || c === '#f9fafb' || c === '#f3f4f6';
};

const PIN_ICONS: { value: MapPinIcon; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'pin', label: 'Spilla', icon: MapPin },
  { value: 'city', label: 'Città / Capitale', icon: Building2 },
  { value: 'castle', label: 'Rocca / Castello', icon: Castle },
  { value: 'mountain', label: 'Montagna / Regione', icon: Mountain },
  { value: 'dungeon', label: 'Dungeon / Rovina', icon: Skull },
  { value: 'star', label: 'Magia / Cosmo', icon: Sparkles },
  { value: 'ship', label: 'Porto / Mare', icon: Ship },
  { value: 'flag', label: 'Avamposto / Fazione', icon: Flag }
];

export const InteractiveMapEditor: React.FC<InteractiveMapEditorProps> = ({
  map,
  allMaps,
  worldEntries,
  onUpdateMap,
  onDeleteMap,
  onAddMap,
  onNavigateToWorld,
  t
}) => {
  const getInitialZoom = (targetMap: MapEntry | null): number => {
    if (targetMap?.zoom && typeof targetMap.zoom === 'number' && !isNaN(targetMap.zoom) && targetMap.zoom >= 0.4 && targetMap.zoom <= 4.0) {
      return targetMap.zoom;
    }
    if (targetMap?.id) {
      const saved = localStorage.getItem(`folia_map_zoom_${targetMap.id}`);
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.4 && val <= 4.0) return val;
      }
    }
    const globalSaved = localStorage.getItem('folia_map_last_zoom');
    if (globalSaved) {
      const val = parseFloat(globalSaved);
      if (!isNaN(val) && val >= 0.4 && val <= 4.0) return val;
    }
    return 1;
  };

  const getInitialPan = (targetMap: MapEntry | null): { x: number; y: number } => {
    if (targetMap?.pan && typeof targetMap.pan.x === 'number' && typeof targetMap.pan.y === 'number') {
      return targetMap.pan;
    }
    if (targetMap?.id) {
      const savedPan = localStorage.getItem(`folia_map_pan_${targetMap.id}`);
      if (savedPan) {
        try {
          const parsed = JSON.parse(savedPan);
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            return parsed;
          }
        } catch {}
      }
    }
    return { x: 0, y: 0 };
  };

  const getInitialPinScale = (targetMap: MapEntry | null): number => {
    if (targetMap?.pinScale && typeof targetMap.pinScale === 'number' && targetMap.pinScale >= 0.7) {
      return targetMap.pinScale;
    }
    if (targetMap?.id) {
      const perMap = localStorage.getItem(`folia_map_pin_scale_${targetMap.id}`);
      if (perMap) {
        const val = parseFloat(perMap);
        if (!isNaN(val) && val >= 0.7 && val <= 3.0) return val;
      }
    }
    const globalSaved = localStorage.getItem('folia_map_pin_scale');
    if (globalSaved) {
      const val = parseFloat(globalSaved);
      if (!isNaN(val) && val >= 0.7 && val <= 3.0) return val;
    }
    return 1;
  };

  const [zoom, setZoom] = useState<number>(() => getInitialZoom(map));
  const [pan, setPan] = useState<{ x: number; y: number }>(() => getInitialPan(map));
  const [pinScale, setPinScale] = useState<number>(() => getInitialPinScale(map));
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [toolMode, setToolMode] = useState<'pan' | 'add_pin'>('pan');
  
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerSearch, setDrawerSearch] = useState('');
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHighlightedPinId, setActiveHighlightedPinId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Draggable popover position state
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingPopoverRef = useRef(false);
  const popoverDragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0
  });

  // When switching maps: restore that map's saved zoom & pan & pinScale
  useEffect(() => {
    if (map?.id) {
      setZoom(getInitialZoom(map));
      setPan(getInitialPan(map));
      setPinScale(getInitialPinScale(map));
    }
    setSelectedPinId(null);
    setPopoverPos(null);
  }, [map?.id]);

  // Filter pins based on drawer search query - must be at top-level before any return
  const filteredPins = useMemo(() => {
    if (!map) return [];
    const pins = map.pins || [];
    if (!drawerSearch.trim()) return pins;
    const q = drawerSearch.toLowerCase();
    return pins.filter(p => 
      (p.label && p.label.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q))
    );
  }, [map?.pins, drawerSearch]);

  const getCategoryBadge = (cat?: string): string => {
    switch (cat) {
      case 'location': return 'Luogo';
      case 'city': return 'Città';
      case 'faction': return 'Fazione';
      case 'culture': return 'Cultura';
      case 'magic': return 'Magia';
      case 'religion': return 'Religione';
      case 'item': return 'Oggetto';
      case 'history': return 'Storia';
      default: return cat || 'Luogo';
    }
  };

  // Options for worldbuilding custom dropdown
  const worldOptions: CustomSelectOption[] = useMemo(() => {
    const opts: CustomSelectOption[] = [
      { value: '', label: '-- Nessun collegamento --' }
    ];
    (worldEntries || []).forEach(w => {
      opts.push({
        value: w.id,
        label: w.name || 'Senza nome',
        badge: getCategoryBadge(w.category)
      });
    });
    return opts;
  }, [worldEntries]);

  // Options for pin icon custom dropdown
  const pinIconOptions: CustomSelectOption[] = useMemo(() => {
    return PIN_ICONS.map(ic => {
      const IconComponent = ic.icon;
      return {
        value: ic.value,
        label: ic.label,
        icon: <IconComponent className="w-3.5 h-3.5 text-folia-800" />
      };
    });
  }, []);

  // Handler for dragging the details popover box
  const handlePopoverHeaderMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('input') ||
      (e.target as HTMLElement).closest('textarea')
    ) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const popoverEl = popoverRef.current;
    if (!popoverEl) return;
    const parentRect = containerRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
    const popoverRect = popoverEl.getBoundingClientRect();

    const currentX = popoverRect.left - parentRect.left;
    const currentY = popoverRect.top - parentRect.top;

    popoverDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: currentX,
      initialY: currentY
    };
    isDraggingPopoverRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingPopoverRef.current) return;
      const dx = moveEvent.clientX - popoverDragStartRef.current.mouseX;
      const dy = moveEvent.clientY - popoverDragStartRef.current.mouseY;

      const parentWidth = containerRef.current?.clientWidth || window.innerWidth;
      const parentHeight = containerRef.current?.clientHeight || window.innerHeight;
      const maxX = Math.max(0, parentWidth - popoverRect.width - 12);
      const maxY = Math.max(0, parentHeight - popoverRect.height - 12);

      const newX = Math.max(12, Math.min(popoverDragStartRef.current.initialX + dx, maxX));
      const newY = Math.max(12, Math.min(popoverDragStartRef.current.initialY + dy, maxY));

      setPopoverPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingPopoverRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!map) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper-150 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-paper-200 border border-paper-300 flex items-center justify-center text-paper-400 mb-4">
          <Compass className="w-8 h-8 text-folia-700" />
        </div>
        <h3 className="font-brand text-xl font-semibold text-paper-800 mb-1">Nessuna mappa selezionata</h3>
        <p className="text-xs text-paper-500 max-w-sm mb-4 leading-relaxed">
          Crea una mappa per il tuo mondo fantasy, sci-fi o storico e annota città, roccaforti e dungeon collegandoli alle tue ambientazioni.
        </p>
        <button
          type="button"
          onClick={onAddMap}
          className="flex items-center gap-2 px-4 py-2 bg-folia-800 hover:bg-folia-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Crea la tua prima mappa</span>
        </button>
      </div>
    );
  }

  const selectedPin = (map.pins || []).find(p => p.id === selectedPinId) || null;

  // Zoom handlers
  const applyZoom = (newZoom: number) => {
    const clamped = Math.min(Math.max(Number(newZoom.toFixed(2)), 0.4), 4.0);
    setZoom(clamped);
    if (map?.id) {
      localStorage.setItem(`folia_map_zoom_${map.id}`, clamped.toString());
      localStorage.setItem('folia_map_last_zoom', clamped.toString());
      onUpdateMap({ ...map, zoom: clamped, updatedAt: new Date().toISOString() });
    }
  };

  const handleZoomIn = () => applyZoom(zoom + 0.25);
  const handleZoomOut = () => applyZoom(zoom - 0.25);
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (map?.id) {
      localStorage.setItem(`folia_map_zoom_${map.id}`, '1');
      localStorage.setItem('folia_map_last_zoom', '1');
      localStorage.setItem(`folia_map_pan_${map.id}`, JSON.stringify({ x: 0, y: 0 }));
      onUpdateMap({ ...map, zoom: 1, pan: { x: 0, y: 0 }, updatedAt: new Date().toISOString() });
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    applyZoom(zoom + delta);
  };

  // Pin & Font Scale handlers
  const applyPinScale = (newScale: number) => {
    const clamped = Math.min(Math.max(Number(newScale.toFixed(2)), 0.75), 2.75);
    setPinScale(clamped);
    if (map?.id) {
      localStorage.setItem(`folia_map_pin_scale_${map.id}`, clamped.toString());
      localStorage.setItem('folia_map_pin_scale', clamped.toString());
      onUpdateMap({ ...map, pinScale: clamped, updatedAt: new Date().toISOString() });
    }
  };

  const handlePinSizeUp = () => applyPinScale(pinScale + 0.25);
  const handlePinSizeDown = () => applyPinScale(pinScale - 0.25);
  const handleResetPinSize = () => applyPinScale(1);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'add_pin') return;
    if (e.button !== 0) return; // Only left click
    if ((e.target as HTMLElement).closest('.folia-pin-marker') || (e.target as HTMLElement).closest('.folia-pin-popover')) {
      return;
    }
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggingPinId && mapImageRef.current) {
      // Dragging a pin to reposition
      const rect = mapImageRef.current.getBoundingClientRect();
      const xPercent = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
      const yPercent = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);

      const updatedPins = (map.pins || []).map(p => 
        p.id === draggingPinId ? { ...p, x: Number(xPercent.toFixed(2)), y: Number(yPercent.toFixed(2)) } : p
      );
      onUpdateMap({ ...map, pins: updatedPins });
    }
  };

  const handleMouseUp = () => {
    if (isPanning && map?.id) {
      localStorage.setItem(`folia_map_pan_${map.id}`, JSON.stringify(pan));
      onUpdateMap({ ...map, pan, updatedAt: new Date().toISOString() });
    }
    setIsPanning(false);
    setDraggingPinId(null);
  };

  // Click on map to add pin (when in add_pin mode)
  const handleMapClick = (e: React.MouseEvent) => {
    if (toolMode !== 'add_pin') return;
    if (!mapImageRef.current) return;
    if ((e.target as HTMLElement).closest('.folia-pin-marker') || (e.target as HTMLElement).closest('.folia-pin-popover')) {
      return;
    }

    const rect = mapImageRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    if (xPercent < 0 || xPercent > 100 || yPercent < 0 || yPercent > 100) return;

    const newPin: MapPinType = {
      id: 'pin-' + Date.now(),
      x: Number(xPercent.toFixed(2)),
      y: Number(yPercent.toFixed(2)),
      label: 'Nuovo Luogo',
      description: '',
      color: '#1B4332',
      icon: 'pin'
    };

    const updated = {
      ...map,
      pins: [...(map.pins || []), newPin],
      updatedAt: new Date().toISOString()
    };
    onUpdateMap(updated);
    setSelectedPinId(newPin.id);
    setToolMode('pan'); // switch back to pan mode after placing
  };

  const handleUpdatePin = (pinId: string, updates: Partial<MapPinType>) => {
    const updatedPins = (map.pins || []).map(p => p.id === pinId ? { ...p, ...updates } : p);
    onUpdateMap({
      ...map,
      pins: updatedPins,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeletePin = (pinId: string) => {
    const updatedPins = (map.pins || []).filter(p => p.id !== pinId);
    onUpdateMap({
      ...map,
      pins: updatedPins,
      updatedAt: new Date().toISOString()
    });
    if (selectedPinId === pinId) setSelectedPinId(null);
  };

  // Select a pin from the drawer list without jerking or jumping the map down if already visible
  const handleSelectPinFromList = (pin: MapPinType) => {
    setSelectedPinId(pin.id);
    setActiveHighlightedPinId(pin.id);
    setTimeout(() => setActiveHighlightedPinId(null), 2500);

    // Only pan if the pin is currently NOT visible inside the map viewport
    if (containerRef.current && mapImageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = mapImageRef.current.getBoundingClientRect();

      const pinScreenX = imgRect.left + (pin.x / 100) * imgRect.width;
      const pinScreenY = imgRect.top + (pin.y / 100) * imgRect.height;

      const isVisible = (
        pinScreenX >= containerRect.left + 60 &&
        pinScreenX <= containerRect.right - 60 &&
        pinScreenY >= containerRect.top + 60 &&
        pinScreenY <= containerRect.bottom - 60
      );

      // If the pin is already visible, keep map position steady!
      if (!isVisible) {
        const imgWidth = mapImageRef.current.clientWidth || 1000;
        const imgHeight = mapImageRef.current.clientHeight || 700;
        const newPanX = -(pin.x / 100 - 0.5) * imgWidth * zoom;
        const newPanY = -(pin.y / 100 - 0.5) * imgHeight * zoom;
        setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
      }
    }
  };

  const handleCenterOnPin = (pin: MapPinType) => {
    setSelectedPinId(pin.id);
    setActiveHighlightedPinId(pin.id);
    setTimeout(() => setActiveHighlightedPinId(null), 2500);

    if (mapImageRef.current) {
      // Use the actual rendered CSS dimensions of the image on screen (not naturalWidth)
      const imgWidth = mapImageRef.current.clientWidth || mapImageRef.current.offsetWidth || 1000;
      const imgHeight = mapImageRef.current.clientHeight || mapImageRef.current.offsetHeight || 700;

      // Center the viewport on the selected pin
      const newPanX = -(pin.x / 100 - 0.5) * imgWidth * zoom;
      const newPanY = -(pin.y / 100 - 0.5) * imgHeight * zoom;

      setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
    }
  };

  const getPinIconComponent = (iconName?: MapPinIcon) => {
    const found = PIN_ICONS.find(i => i.value === iconName);
    return found ? found.icon : MapPin;
  };

  return (
    <div className={`flex-1 h-full flex flex-col bg-paper-150 overflow-hidden select-none relative ${isFullscreen ? 'fixed inset-0 z-50 bg-paper-200' : ''}`}>
      {/* Top Header Bar */}
      <div className="bg-paper-50/95 backdrop-blur-md border-b border-paper-250 px-5 py-3 flex items-center justify-between gap-4 shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-folia-100 text-folia-900 rounded-xl shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <input
              type="text"
              value={map.title}
              onChange={(e) => onUpdateMap({ ...map, title: e.target.value, updatedAt: new Date().toISOString() })}
              placeholder="Nome della mappa (es. Continente di Eldoria)..."
              className="font-brand font-bold text-base md:text-lg text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-600 rounded px-1 w-full max-w-md"
            />
            <input
              type="text"
              value={map.description || ''}
              onChange={(e) => onUpdateMap({ ...map, description: e.target.value, updatedAt: new Date().toISOString() })}
              placeholder="Descrizione o note sul territorio..."
              className="text-xs text-paper-500 bg-transparent border-none focus:outline-hidden px-1 block w-full max-w-md truncate"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tool Mode: Explore vs Add Pin */}
          <div className="flex items-center bg-paper-200/80 p-0.5 rounded-xl border border-paper-300 mr-2 text-xs">
            <button
              type="button"
              onClick={() => setToolMode('pan')}
              title="Modalità Esplorazione (Sposta e ingrandisci la mappa)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                toolMode === 'pan' ? 'bg-white text-folia-900 font-bold shadow-2xs' : 'text-paper-600 hover:text-paper-900'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Esplora</span>
            </button>
            <button
              type="button"
              onClick={() => setToolMode('add_pin')}
              title="Modalità Segnalino (Clicca sulla mappa per piazzare un punto)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                toolMode === 'add_pin' ? 'bg-folia-800 text-white font-bold shadow-2xs' : 'text-paper-600 hover:text-paper-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Aggiungi Segnalino</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-paper-100 p-1 rounded-xl border border-paper-300 text-xs">
            <span className="text-[10px] uppercase font-bold text-paper-400 pl-1 hidden sm:inline">Zoom</span>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Rimpicciolisci (-)"
              className="p-1 rounded-lg text-paper-600 hover:text-paper-900 hover:bg-paper-200 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Ripristina zoom 100%"
              className="px-1.5 py-0.5 text-[11px] font-mono text-paper-700 font-semibold hover:text-folia-800 cursor-pointer"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Ingrandisci (+)"
              className="p-1 rounded-lg text-paper-600 hover:text-paper-900 hover:bg-paper-200 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pin & Font Size controls */}
          <div className="flex items-center gap-1 bg-paper-100 p-1 rounded-xl border border-paper-300 text-xs" title="Dimensione segnaposto e testi sulla mappa">
            <span className="text-[10px] uppercase font-bold text-paper-500 pl-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-folia-800" />
              <span className="font-semibold text-paper-800 hidden sm:inline">Segnaposto:</span>
            </span>
            <button
              type="button"
              onClick={handlePinSizeDown}
              disabled={pinScale <= 0.75}
              title="Rimpicciolisci segnaposto e testi (-)"
              className="p-1 rounded-lg text-paper-600 hover:text-paper-900 hover:bg-paper-200 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetPinSize}
              title="Ripristina dimensione segnaposto standard (100%)"
              className="px-1.5 py-0.5 text-[11px] font-mono text-paper-700 font-semibold hover:text-folia-800 cursor-pointer"
            >
              {Math.round(pinScale * 100)}%
            </button>
            <button
              type="button"
              onClick={handlePinSizeUp}
              disabled={pinScale >= 2.5}
              title="Ingrandisci segnaposto e testi (+)"
              className="p-1 rounded-lg text-paper-600 hover:text-paper-900 hover:bg-paper-200 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Change Image button */}
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            title="Carica o sostituisci l'immagine della mappa"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-paper-100 hover:bg-paper-200 text-paper-800 rounded-xl border border-paper-300 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-folia-800" />
            <span className="hidden md:inline">{map.imageUrl ? 'Cambia mappa' : 'Carica mappa'}</span>
          </button>

          {/* Toggle Places Drawer */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            title="Mostra / nascondi elenco luoghi"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isDrawerOpen 
                ? 'bg-folia-100 border-folia-400 text-folia-900 font-semibold shadow-2xs' 
                : 'bg-paper-100 border-paper-300 text-paper-700 hover:bg-paper-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-folia-700" />
            <span className="hidden sm:inline">Luoghi ({(map.pins || []).length})</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
            className="p-2 rounded-xl text-paper-600 hover:text-paper-900 hover:bg-paper-200 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Delete map button */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            title="Elimina questa mappa"
            className="p-2 rounded-xl text-paper-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Locations Drawer Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Viewport Area */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className={`flex-1 overflow-hidden relative flex items-center justify-center ${
            toolMode === 'add_pin' 
              ? 'cursor-crosshair' 
              : isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            backgroundImage: 'radial-gradient(#D5D1C7 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        >
          {/* If No Image is Uploaded */}
          {!map.imageUrl ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md bg-paper-50/90 rounded-3xl border-2 border-dashed border-paper-300 shadow-modal animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-brand font-bold text-lg text-paper-900 mb-1.5">
                Nessuna mappa caricata
              </h3>
              <p className="text-xs text-paper-500 mb-5 leading-relaxed">
                Carica una cartina geografica, la mappa di una galassia, la pianta di una capitale o di un dungeon per iniziare a posizionare i tuoi punti d'interesse interattivi.
              </p>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-folia-800 hover:bg-folia-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Carica immagine mappa</span>
              </button>
            </div>
          ) : (
            /* Pannable / Zoomable Map Canvas */
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out'
              }}
              className="relative inline-block max-w-none shadow-page rounded-2xl overflow-visible select-none"
              onClick={handleMapClick}
            >
              <img
                ref={mapImageRef}
                src={map.imageUrl}
                alt={map.title}
                draggable={false}
                className="max-w-none block pointer-events-auto rounded-xl border border-paper-300 shadow-2xl"
                style={{ maxHeight: '82vh' }}
              />

              {/* Pins Rendered Across Coordinates */}
              {(map.pins || []).map((pin) => {
                const isSelected = selectedPinId === pin.id;
                const isPulse = activeHighlightedPinId === pin.id;
                const IconComponent = getPinIconComponent(pin.icon);

                return (
                  <div
                    key={pin.id}
                    style={{
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPinId(pin.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingPinId(pin.id);
                    }}
                    className={`folia-pin-marker absolute cursor-pointer group z-30 transition-transform ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                    }`}
                  >
                    {/* Ripple Pulse Animation */}
                    {isPulse && (
                      <div className="absolute -inset-3 rounded-full bg-folia-400/40 animate-ping pointer-events-none" />
                    )}

                    {/* Teardrop Marker Pin Shape */}
                    <div
                      style={{
                        backgroundColor: pin.color || '#1B4332',
                        width: `${Math.round(32 * pinScale)}px`,
                        height: `${Math.round(32 * pinScale)}px`
                      }}
                      className={`rounded-full rounded-br-none rotate-45 shadow-lg flex items-center justify-center border-2 transition-all ${
                        isLightPinColor(pin.color)
                          ? 'border-paper-600 text-paper-900 shadow-md'
                          : 'border-white text-white'
                      }`}
                    >
                      <div className="-rotate-45 flex items-center justify-center">
                        <IconComponent style={{ width: `${Math.round(14 * pinScale)}px`, height: `${Math.round(14 * pinScale)}px` }} />
                      </div>
                    </div>

                    {/* Pin Label underneath */}
                    <div
                      style={{
                        fontSize: `${Math.round(10 * pinScale)}px`,
                        padding: `${Math.max(2, Math.round(2 * pinScale))}px ${Math.max(4, Math.round(6 * pinScale))}px`,
                        marginTop: `${Math.max(2, Math.round(4 * pinScale))}px`
                      }}
                      className="absolute left-1/2 -translate-x-1/2 top-full rounded-md bg-paper-900/90 text-white font-sans font-bold whitespace-nowrap shadow-md pointer-events-none transition-all"
                    >
                      {pin.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hint Overlay when in Add Pin Mode */}
          {toolMode === 'add_pin' && map.imageUrl && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-folia-900/90 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-2 pointer-events-none animate-in fade-in">
              <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Clicca in qualsiasi punto della mappa per piazzare il segnalino</span>
            </div>
          )}
        </div>

        {/* Selected Pin Details Popover Floating Card (Draggable) */}
        {selectedPin && (
          <div 
            ref={popoverRef}
            style={popoverPos ? { left: `${popoverPos.x}px`, top: `${popoverPos.y}px` } : undefined}
            className={`folia-pin-popover absolute ${popoverPos ? '' : 'left-6 bottom-6'} w-80 sm:w-96 bg-paper-50 rounded-2xl shadow-modal border border-paper-300 p-4 z-40 animate-in slide-in-from-bottom-3 duration-200 select-none`}
          >
            {/* Draggable Header */}
            <div 
              onMouseDown={handlePopoverHeaderMouseDown}
              className="flex items-center justify-between pb-2 border-b border-paper-200 cursor-grab active:cursor-grabbing group/header"
              title="Trascina per spostare questo pannello sulla mappa"
            >
              <div className="flex items-center gap-2 min-w-0">
                <GripHorizontal className="w-4 h-4 text-paper-400 group-hover/header:text-folia-800 transition-colors shrink-0" />
                <div 
                  style={{ backgroundColor: selectedPin.color || '#1B4332' }} 
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-2xs shrink-0 ${
                    isLightPinColor(selectedPin.color)
                      ? 'border border-paper-400 text-paper-900'
                      : 'text-white'
                  }`}
                >
                  {React.createElement(getPinIconComponent(selectedPin.icon), { className: 'w-3.5 h-3.5' })}
                </div>
                <span className="font-bold text-xs text-paper-900 truncate">Dettagli Luogo</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDeletePin(selectedPin.id)}
                  title="Elimina questo punto"
                  className="p-1 rounded text-paper-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPinId(null)}
                  className="p-1 rounded text-paper-400 hover:text-paper-700 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              {/* Name input */}
              <div>
                <label className="block text-[10px] font-bold text-paper-500 uppercase tracking-wider mb-1">
                  Nome del Luogo
                </label>
                <input
                  type="text"
                  value={selectedPin.label}
                  onChange={(e) => handleUpdatePin(selectedPin.id, { label: e.target.value })}
                  placeholder="Nome del punto..."
                  className="w-full px-2.5 py-1.5 bg-white border border-paper-300 rounded-xl text-xs font-semibold text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs"
                />
              </div>

              {/* Linked Worldbuilding Entry */}
              <div>
                <label className="block text-[10px] font-bold text-paper-500 uppercase tracking-wider mb-1">
                  Collega a scheda Ambientazione
                </label>
                <CustomSelect
                  value={selectedPin.worldEntryId || ''}
                  options={worldOptions}
                  onChange={(val) => handleUpdatePin(selectedPin.id, { worldEntryId: val || undefined })}
                  placeholder="-- Nessun collegamento --"
                  className="w-full"
                  buttonClassName="w-full bg-white text-paper-800 font-medium"
                  dropdownClassName="w-full"
                />

                {selectedPin.worldEntryId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPin.worldEntryId) {
                        onNavigateToWorld(selectedPin.worldEntryId);
                      }
                    }}
                    className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-folia-800 hover:text-folia-950 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Apri scheda ambientazione</span>
                  </button>
                )}
              </div>

              {/* Quick description */}
              <div>
                <label className="block text-[10px] font-bold text-paper-500 uppercase tracking-wider mb-1">
                  Note sul Luogo
                </label>
                <textarea
                  value={selectedPin.description || ''}
                  onChange={(e) => handleUpdatePin(selectedPin.id, { description: e.target.value })}
                  placeholder="Breve descrizione, cenni storici o pericoli..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-white border border-paper-300 rounded-xl text-xs text-paper-800 focus:outline-hidden focus:border-folia-600 resize-none font-sans shadow-2xs"
                />
              </div>

              {/* Icon & Color selector */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-paper-200 text-xs items-start">
                <div>
                  <label className="block text-[10px] font-bold text-paper-500 uppercase tracking-wider mb-1">
                    Icona
                  </label>
                  <CustomSelect
                    value={selectedPin.icon || 'pin'}
                    options={pinIconOptions}
                    onChange={(val) => handleUpdatePin(selectedPin.id, { icon: val as MapPinIcon })}
                    className="w-full"
                    buttonClassName="w-full bg-white text-paper-800 font-medium"
                    dropdownClassName="w-48"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-paper-500 uppercase tracking-wider mb-1">
                    Colore
                  </label>
                  <div className="flex items-center gap-1.5 pt-1.5">
                    {PIN_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => handleUpdatePin(selectedPin.id, { color: c.value })}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                        className={`w-4 h-4 rounded-full transition-transform cursor-pointer border ${
                          c.value === '#FFFFFF' ? 'border-paper-400' : 'border-black/10'
                        } ${
                          selectedPin.color === c.value ? 'scale-130 ring-2 ring-folia-500 shadow-xs' : 'hover:scale-115 opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Marker & Font Size Scaler */}
              <div className="pt-2.5 border-t border-paper-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-paper-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-folia-800" />
                    <span>Dimensione Segnaposto & Testo</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-folia-800">
                    {Math.round(pinScale * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePinSizeDown}
                    disabled={pinScale <= 0.75}
                    className="p-1.5 bg-white hover:bg-paper-150 disabled:opacity-30 rounded-lg text-paper-700 transition-colors cursor-pointer border border-paper-250 shadow-2xs"
                    title="Rimpicciolisci segnaposto e testo (-)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0.75"
                    max="2.5"
                    step="0.1"
                    value={pinScale}
                    onChange={(e) => applyPinScale(parseFloat(e.target.value))}
                    className="flex-1 accent-folia-700 h-1.5 bg-paper-200 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handlePinSizeUp}
                    disabled={pinScale >= 2.5}
                    className="p-1.5 bg-white hover:bg-paper-150 disabled:opacity-30 rounded-lg text-paper-700 transition-colors cursor-pointer border border-paper-250 shadow-2xs"
                    title="Ingrandisci segnaposto e testo (+)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPinSize}
                    className="px-2 py-1 text-[10px] font-semibold bg-white hover:bg-paper-150 text-paper-700 rounded-lg border border-paper-250 transition-colors cursor-pointer shadow-2xs"
                    title="Ripristina 100%"
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Locations Drawer on Right */}
        {isDrawerOpen && (
          <div className="w-72 md:w-80 border-l border-paper-300 bg-paper-50/95 backdrop-blur-md flex flex-col h-full z-20 shrink-0 shadow-lg animate-in slide-in-from-right-4 duration-150 select-none">
            {/* Drawer Header */}
            <div className="p-4 border-b border-paper-200 flex items-center justify-between bg-paper-100/70">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-folia-100 text-folia-800 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-brand font-bold text-sm text-paper-900">Luoghi Segnati</h4>
                  <p className="text-[11px] text-paper-500">{(map.pins || []).length} punti d'interesse</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-paper-400 hover:text-paper-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-3 border-b border-paper-200 bg-paper-50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-paper-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder="Cerca luogo sulla mappa..."
                  className="w-full pl-8 pr-3 py-1.5 bg-paper-100/80 border border-paper-250 rounded-xl text-xs text-paper-800 placeholder:text-paper-400 focus:outline-hidden focus:bg-white focus:border-folia-600"
                />
              </div>
            </div>

            {/* List of Pins */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredPins.length > 0 ? (
                filteredPins.map((pin) => {
                  const IconComp = getPinIconComponent(pin.icon);
                  const isSelected = selectedPinId === pin.id;
                  const linkedWorld = worldEntries.find(w => w.id === pin.worldEntryId);

                  return (
                    <div
                      key={pin.id}
                      onClick={() => handleSelectPinFromList(pin)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected 
                          ? 'bg-folia-50/80 border-folia-400 shadow-2xs' 
                          : 'bg-white border-paper-250 hover:border-folia-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div 
                            style={{ backgroundColor: pin.color || '#1B4332' }} 
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 shadow-2xs ${
                              isLightPinColor(pin.color)
                                ? 'border border-paper-400 text-paper-900'
                                : 'text-white'
                            }`}
                          >
                            <IconComp className="w-3 h-3" />
                          </div>
                          <span className="font-semibold text-xs text-paper-900 truncate">
                            {pin.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCenterOnPin(pin);
                            }}
                            title="Centra la mappa su questo punto"
                            className="p-1 rounded-md text-paper-400 hover:text-folia-800 hover:bg-paper-200 transition-colors cursor-pointer"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] text-paper-400 font-mono">
                            {Math.round(pin.x)}%, {Math.round(pin.y)}%
                          </span>
                        </div>
                      </div>

                      {linkedWorld && (
                        <div className="flex items-center gap-1 text-[10.5px] text-emerald-800 font-medium pl-7">
                          <span>Collegato:</span>
                          <span className="underline truncate">{linkedWorld.name}</span>
                        </div>
                      )}

                      {pin.description && (
                        <p className="text-[11px] text-paper-500 line-clamp-1 pl-7 font-sans">
                          {pin.description}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-paper-400 space-y-2">
                  <MapPin className="w-8 h-8 stroke-1 text-paper-300" />
                  <p className="text-xs">Nessun luogo trovato.</p>
                  <p className="text-[11px] text-paper-400 max-w-xs">
                    {'Attiva "Aggiungi Segnalino" in alto e clicca sulla mappa per inserire nuovi punti.'}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer: Pin Scale Control */}
            <div className="p-3 border-t border-paper-250 bg-paper-100/90 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-paper-600 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-folia-800" />
                  Dimensione Segnaposti Mappa
                </span>
                <span className="text-[11px] font-mono font-bold text-folia-800">
                  {Math.round(pinScale * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePinSizeDown}
                  disabled={pinScale <= 0.75}
                  className="p-1.5 bg-white hover:bg-paper-150 disabled:opacity-30 rounded-lg text-paper-700 transition-colors border border-paper-300 cursor-pointer shadow-2xs"
                  title="Rimpicciolisci (-)"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="range"
                  min="0.75"
                  max="2.5"
                  step="0.1"
                  value={pinScale}
                  onChange={(e) => applyPinScale(parseFloat(e.target.value))}
                  className="flex-1 accent-folia-700 h-1.5 bg-paper-200 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handlePinSizeUp}
                  disabled={pinScale >= 2.5}
                  className="p-1.5 bg-white hover:bg-paper-150 disabled:opacity-30 rounded-lg text-paper-700 transition-colors border border-paper-300 cursor-pointer shadow-2xs"
                  title="Ingrandisci (+)"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleResetPinSize}
                  className="px-2 py-1 text-[10px] font-semibold bg-white hover:bg-paper-150 text-paper-700 rounded-lg border border-paper-300 cursor-pointer shadow-2xs"
                  title="Ripristina 100%"
                >
                  100%
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={
          map.title && map.title !== 'Nuova Mappa' && map.title !== 'New Map'
            ? `Carica immagine per "${map.title}"`
            : 'Carica immagine della mappa'
        }
        currentImage={map.imageUrl}
        onSaveImage={(url) => onUpdateMap({ ...map, imageUrl: url, updatedAt: new Date().toISOString() })}
        onRemoveImage={() => onUpdateMap({ ...map, imageUrl: '', updatedAt: new Date().toISOString() })}
        contained={true}
      />

      {/* Delete Map Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDeleteMap(map.id);
          setShowDeleteConfirm(false);
        }}
        title="Elimina Mappa"
        subtitle="Questa azione rimuoverà la mappa e tutti i suoi segnalini"
        message={
          <span>
            Sei sicuro di voler eliminare la mappa <strong>"{map.title || 'Mappa senza titolo'}"</strong>?
          </span>
        }
        confirmLabel="Elimina mappa"
        cancelLabel="Annulla"
        variant="danger"
        contained={true}
      />
    </div>
  );
};
