import React, { useState, useMemo } from 'react';
import { MapPin, Search, Star, Navigation, Check, AlertCircle } from 'lucide-react';
import { REPUBLICS, REGIONS, DISTRICTS, LocationItem } from '../../data/locations';

interface LocationSelectorProps {
  republic: 'uzbekistan' | 'karakalpakstan';
  regionId: number;
  districtId: number;
  latitude?: number;
  longitude?: number;
  onChange: (data: {
    republic: 'uzbekistan' | 'karakalpakstan';
    regionId: number;
    districtId: number;
    latitude?: number;
    longitude?: number;
  }) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  republic = 'uzbekistan',
  regionId = 10, // Default Toshkent shahri
  districtId = 101, // Default Yunusobod
  latitude,
  longitude,
  onChange,
}) => {
  const [districtSearch, setDistrictSearch] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsMessage, setGpsMessage] = useState('');

  // Republic filter
  const currentRepublicId = republic === 'uzbekistan' ? 1 : 2;

  // Regions under selected Republic
  const availableRegions = useMemo(() => {
    return REGIONS.filter((r) => r.parentId === currentRepublicId);
  }, [currentRepublicId]);

  // Districts under selected Region
  const availableDistricts = useMemo(() => {
    const list = DISTRICTS.filter((d) => d.parentId === regionId);
    if (!districtSearch.trim()) return list;
    return list.filter((d) =>
      d.nameUz.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.nameRu.toLowerCase().includes(districtSearch.toLowerCase())
    );
  }, [regionId, districtSearch]);

  const handleRepublicChange = (newRepublic: 'uzbekistan' | 'karakalpakstan') => {
    const newRepId = newRepublic === 'uzbekistan' ? 1 : 2;
    const defaultRegion = REGIONS.find((r) => r.parentId === newRepId) || REGIONS[0];
    const defaultDistrict = DISTRICTS.find((d) => d.parentId === defaultRegion.id) || DISTRICTS[0];

    onChange({
      republic: newRepublic,
      regionId: defaultRegion.id,
      districtId: defaultDistrict.id,
      latitude: defaultDistrict.lat,
      longitude: defaultDistrict.lng,
    });
  };

  const handleRegionChange = (newRegionId: number) => {
    const defaultDistrict = DISTRICTS.find((d) => d.parentId === newRegionId) || DISTRICTS[0];
    onChange({
      republic,
      regionId: newRegionId,
      districtId: defaultDistrict.id,
      latitude: defaultDistrict.lat,
      longitude: defaultDistrict.lng,
    });
  };

  const handleDistrictChange = (newDistrictId: number) => {
    const selectedDistrict = DISTRICTS.find((d) => d.id === newDistrictId);
    onChange({
      republic,
      regionId,
      districtId: newDistrictId,
      latitude: selectedDistrict?.lat,
      longitude: selectedDistrict?.lng,
    });
  };

  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsMessage("Qurilmangizda geolokatsiya qo'llab-quvvatlanmaydi.");
      return;
    }

    setGpsStatus('locating');
    setGpsMessage("GPS orqali aniqlanmoqda...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setGpsStatus('success');
        setGpsMessage(`Joylashuv aniqlandi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);

        // Find nearest district
        let nearestDistrict = DISTRICTS[0];
        let minDistance = 999999;

        DISTRICTS.forEach((d) => {
          if (d.lat && d.lng) {
            const dist = Math.hypot(d.lat - lat, d.lng - lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearestDistrict = d;
            }
          }
        });

        const targetRegion = REGIONS.find((r) => r.id === nearestDistrict.parentId);
        const targetRepublic = targetRegion?.parentId === 2 ? 'karakalpakstan' : 'uzbekistan';

        onChange({
          republic: targetRepublic,
          regionId: targetRegion?.id || regionId,
          districtId: nearestDistrict.id,
          latitude: lat,
          longitude: lng,
        });
      },
      (err) => {
        setGpsStatus('error');
        setGpsMessage("Geolokatsiyaga ruxsat berilmadi yoki xatolik yuz berdi.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. REPUBLIC SELECTOR */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          1. Davlat / Respublika hududi
        </label>
        <div className="grid grid-cols-2 gap-2">
          {REPUBLICS.map((rep) => {
            const isSelected = (republic === 'uzbekistan' && rep.id === 1) || (republic === 'karakalpakstan' && rep.id === 2);
            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => handleRepublicChange(rep.id === 1 ? 'uzbekistan' : 'karakalpakstan')}
                className={`py-3 px-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-[#18181b] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <span>{rep.nameUz}</span>
                {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. REGION SELECTOR (Tashkent City at top with star ⭐) */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          2. Viloyat / Shahar tanlang
        </label>
        <div className="relative">
          <select
            value={regionId}
            onChange={(e) => handleRegionChange(Number(e.target.value))}
            className="w-full bg-[#18181b] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none transition-colors"
          >
            {availableRegions.map((reg) => (
              <option key={reg.id} value={reg.id} className="bg-[#18181b] text-white py-2">
                {reg.nameUz} {reg.isPopular && ' (Mashhur)'}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <MapPin className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>

      {/* 3. DISTRICT SELECTOR WITH SEARCH BAR */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            3. Tuman / Hudud tanlang
          </label>
          <span className="text-[11px] text-gray-500">{availableDistricts.length} ta tuman</span>
        </div>

        {/* Search Input for Districts */}
        <div className="relative mb-2">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tumanni qidirish (masalan, Yunusobod, Chilonzor)..."
            value={districtSearch}
            onChange={(e) => setDistrictSearch(e.target.value)}
            className="w-full bg-[#141417] border border-gray-800/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* District list selector */}
        <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-800 bg-[#161619] p-1.5 space-y-1">
          {availableDistricts.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              Qidiruv bo'yicha tuman topilmadi. Qidiruv so'zini tekshiring.
            </div>
          ) : (
            availableDistricts.map((dist) => {
              const isSelected = dist.id === districtId;
              return (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => handleDistrictChange(dist.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-900/50 text-white border border-purple-500 shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-purple-400' : 'text-gray-500'}`} />
                    <span>{dist.nameUz}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 4. GPS NEARBY FILTER REQUEST */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleRequestGPS}
          disabled={gpsStatus === 'locating'}
          className="w-full bg-[#1c1c24] hover:bg-[#232330] border border-purple-600/40 hover:border-purple-500 py-2.5 px-4 rounded-xl text-xs font-medium text-purple-300 flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Navigation className={`w-4 h-4 text-purple-400 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
          <span>{gpsStatus === 'locating' ? 'Joylashuv olinmoqda...' : '📍 GPS orqali yaqin atrofdagi anketalarni aniqlash'}</span>
        </button>

        {gpsMessage && (
          <div className={`mt-2 text-[11px] flex items-center gap-1.5 ${gpsStatus === 'success' ? 'text-green-400' : gpsStatus === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
            {gpsStatus === 'success' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            <span>{gpsMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
