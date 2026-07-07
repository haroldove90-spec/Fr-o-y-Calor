/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculateBTU, BTUResult } from '../utils/btu';
import { BTUMeasurements } from '../types';
import { Flame, Users, Cpu, Sun, MapPin, Calculator, CalendarClock } from 'lucide-react';

interface BTUCalculatorTabProps {
  onQuickBook: (capacityBTU: number, recommendedText: string) => void;
}

export default function BTUCalculatorTab({ onQuickBook }: BTUCalculatorTabProps) {
  const [measurements, setMeasurements] = useState<BTUMeasurements>({
    width: 4,
    length: 4,
    height: 2.6,
    sunExposure: 'medium',
    occupants: 2,
    electricalDevices: 1,
    climateZone: 'warm',
  });

  const [result, setResult] = useState<BTUResult | null>(null);

  const handleCalculate = () => {
    const res = calculateBTU(measurements);
    setResult(res);
  };

  const handleInputChange = (field: keyof BTUMeasurements, value: any) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset result to encourage recalculating on change
    setResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
      
      {/* Tab Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#3B6774]/10 flex items-center justify-center text-[#3B6774]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#3B6774]">Cálculo de Carga Térmica</h2>
          <p className="text-xs text-slate-500">Calcula los BTUs ideales para tu habitación</p>
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
        
        {/* Dimensions */}
        <div>
          <label className="text-xs font-bold text-[#3B6774] uppercase tracking-wider mb-1.5 block">Dimensiones del Cuarto</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Ancho (metros)</span>
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={measurements.width}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FFF5CB]/10 border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6774] font-medium"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Largo (metros)</span>
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={measurements.length}
                onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FFF5CB]/10 border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6774] font-medium"
              />
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 text-right">
            Área total: <span className="font-semibold text-slate-600">{(measurements.width * measurements.length).toFixed(1)} m²</span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Environmental Factors */}
        <div className="flex flex-col gap-3">
          
          {/* Sun Exposure */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Sun className="w-3.5 h-3.5 text-[#DF4126]" />
              Exposición al Sol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => {
                const labels = { low: 'Sombra', medium: 'Normal', high: 'Mucho Sol' };
                const isActive = measurements.sunExposure === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange('sunExposure', level)}
                    className={`text-[11px] py-2 px-2 font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#DF4126] text-white border-[#DF4126] shadow-sm shadow-[#DF4126]/20'
                        : 'bg-[#FFF5CB]/20 border-slate-200 text-slate-600 hover:bg-[#FFF5CB]/30'
                    }`}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occupants & Devices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#3B6774]" />
                Personas
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={measurements.occupants}
                onChange={(e) => handleInputChange('occupants', parseInt(e.target.value) || 1)}
                className="w-full bg-[#FFF5CB]/10 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#3B6774] font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#96B4A8]" />
                Aparatos
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={measurements.electricalDevices}
                onChange={(e) => handleInputChange('electricalDevices', parseInt(e.target.value) || 0)}
                className="w-full bg-[#FFF5CB]/10 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#3B6774] font-medium"
              />
            </div>
          </div>

          {/* Climate Zone */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#3B6774]" />
              Zona Climática
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['temperate', 'warm', 'tropical'] as const).map((zone) => {
                const labels = { temperate: 'Templado', warm: 'Cálido', tropical: 'Tropical' };
                const isActive = measurements.climateZone === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => handleInputChange('climateZone', zone)}
                    className={`text-[11px] py-2 px-2 font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3B6774] text-white border-[#3B6774] shadow-sm shadow-[#3B6774]/20'
                        : 'bg-[#FFF5CB]/20 border-slate-200 text-slate-600 hover:bg-[#FFF5CB]/30'
                    }`}
                  >
                    {labels[zone]}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Calculate Action */}
        <button
          onClick={handleCalculate}
          className="w-full bg-[#3B6774] hover:bg-[#3B6774]/90 active:bg-[#3B6774] text-[#FFF5CB] font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <Calculator className="w-4 h-4 text-[#FFF5CB]" />
          Calcular Capacidad Ideal
        </button>

      </div>

      {/* Results Presentation Panel */}
      {result ? (
        <div className="bg-gradient-to-br from-[#3B6774] to-[#2A4B55] text-[#FFF5CB] rounded-2xl p-5 shadow-md border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          
          {/* Spark background */}
          <div className="absolute right-0 bottom-0 opacity-10">
            <Flame className="w-32 h-32 text-[#FFF5CB]" />
          </div>

          <div>
            <span className="text-[10px] text-[#FFF5CB]/70 font-bold uppercase tracking-wider">Capacidad Requerida</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-white">{result.totalBTU.toLocaleString()}</span>
              <span className="text-xs font-semibold text-[#FFF5CB]/85">BTU / hr</span>
            </div>
          </div>

          <hr className="border-[#FFF5CB]/10" />

          {/* Breakdown List */}
          <div className="flex flex-col gap-1.5 text-xs text-[#FFF5CB]/85">
            <div className="flex justify-between">
              <span>Área Base:</span>
              <span className="font-bold text-white">{result.baseBTU.toLocaleString()} BTU</span>
            </div>
            {result.sunFactor > 0 && (
              <div className="flex justify-between text-[#FFF5CB]">
                <span>Exposición Solar:</span>
                <span className="font-bold text-[#96B4A8]">+{result.sunFactor.toLocaleString()} BTU</span>
              </div>
            )}
            {result.peopleFactor > 0 && (
              <div className="flex justify-between">
                <span>Ocupantes extras:</span>
                <span className="font-bold text-[#96B4A8]">+{result.peopleFactor.toLocaleString()} BTU</span>
              </div>
            )}
            {result.devicesFactor > 0 && (
              <div className="flex justify-between">
                <span>Carga por aparatos:</span>
                <span className="font-bold text-[#96B4A8]">+{result.devicesFactor.toLocaleString()} BTU</span>
              </div>
            )}
            {result.climateFactor > 0 && (
              <div className="flex justify-between">
                <span>Multiplicador por Clima:</span>
                <span className="font-bold text-[#96B4A8]">+{result.climateFactor.toLocaleString()} BTU</span>
              </div>
            )}
          </div>

          <hr className="border-[#FFF5CB]/10" />

          {/* Commercial Match */}
          <div className="bg-black/15 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-[#FFF5CB]/70 font-bold uppercase tracking-wider">Sugerencia de Equipo Comercial</span>
            <span className="text-sm font-extrabold text-[#96B4A8]">{result.recommendedCommercialSize}</span>
            <p className="text-[10px] text-[#FFF5CB]/80 leading-normal mt-0.5">
              Se recomienda un Minisplit de pared Inverter con esta capacidad de refrigeración para garantizar un consumo mínimo y confort óptimo.
            </p>
          </div>

          {/* Direct Installation Link */}
          <button
            onClick={() => onQuickBook(result.totalBTU, result.recommendedCommercialSize)}
            className="w-full mt-1 bg-[#DF4126] hover:bg-[#DF4126]/90 active:bg-[#DF4126] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <CalendarClock className="w-4 h-4 text-white" />
            Reservar Instalación de esta Capacidad
          </button>

        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-8 px-4 flex flex-col items-center justify-center text-center">
          <Calculator className="w-8 h-8 text-slate-300 mb-2" />
          <span className="text-xs font-semibold text-slate-500">Introduce las dimensiones y factores de arriba</span>
          <span className="text-[10px] text-slate-400 mt-1">Calcularemos el caballaje en BTU idóneo para climatizar eficientemente tu espacio.</span>
        </div>
      )}

    </div>
  );
}
