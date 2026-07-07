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
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
      
      {/* Tab Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Cálculo de Carga Térmica</h2>
          <p className="text-xs text-slate-400">Calcula los BTUs ideales para tu habitación</p>
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col gap-3">
        
        {/* Dimensions */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Dimensiones del Cuarto</label>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
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
                    className={`text-[11px] py-1.5 px-2 font-medium rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Personas habituales
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={measurements.occupants}
                onChange={(e) => handleInputChange('occupants', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 mb-1">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                Aparatos Eléctricos
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={measurements.electricalDevices}
                onChange={(e) => handleInputChange('electricalDevices', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Climate Zone */}
          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
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
                    className={`text-[11px] py-1.5 px-2 font-medium rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          Calcular Capacidad Ideal
        </button>

      </div>

      {/* Results Presentation Panel */}
      {result ? (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md border border-blue-950 flex flex-col gap-3 relative overflow-hidden">
          
          {/* Spark background */}
          <div className="absolute right-0 bottom-0 opacity-10">
            <Flame className="w-32 h-32 text-blue-400" />
          </div>

          <div>
            <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Capacidad Requerida</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold tracking-tight">{result.totalBTU.toLocaleString()}</span>
              <span className="text-sm font-semibold text-blue-300">BTU / hr</span>
            </div>
          </div>

          <hr className="border-blue-800/60" />

          {/* Breakdown List */}
          <div className="flex flex-col gap-1.5 text-xs text-blue-100">
            <div className="flex justify-between">
              <span>Área Base:</span>
              <span className="font-semibold">{result.baseBTU.toLocaleString()} BTU</span>
            </div>
            {result.sunFactor > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>Exposición Solar:</span>
                <span className="font-semibold">+{result.sunFactor.toLocaleString()} BTU</span>
              </div>
            )}
            {result.peopleFactor > 0 && (
              <div className="flex justify-between text-blue-300">
                <span>Ocupantes extras:</span>
                <span className="font-semibold">+{result.peopleFactor.toLocaleString()} BTU</span>
              </div>
            )}
            {result.devicesFactor > 0 && (
              <div className="flex justify-between text-purple-300">
                <span>Carga por aparatos:</span>
                <span className="font-semibold">+{result.devicesFactor.toLocaleString()} BTU</span>
              </div>
            )}
            {result.climateFactor > 0 && (
              <div className="flex justify-between text-rose-300">
                <span>Multiplicador por Clima:</span>
                <span className="font-semibold">+{result.climateFactor.toLocaleString()} BTU</span>
              </div>
            )}
          </div>

          <hr className="border-blue-800/60" />

          {/* Commercial Match */}
          <div className="bg-white/10 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Sugerencia de Equipo Comercial</span>
            <span className="text-sm font-bold text-amber-300">{result.recommendedCommercialSize}</span>
            <p className="text-[10px] text-blue-100 leading-normal mt-0.5">
              Se recomienda un Minisplit de pared Inverter con esta capacidad de refrigeración para garantizar un consumo mínimo y confort óptimo.
            </p>
          </div>

          {/* Direct Installation Link */}
          <button
            onClick={() => onQuickBook(result.totalBTU, result.recommendedCommercialSize)}
            className="w-full mt-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <CalendarClock className="w-4 h-4" />
            Reservar Instalación de esta Capacidad
          </button>

        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-8 px-4 flex flex-col items-center justify-center text-center">
          <Calculator className="w-8 h-8 text-slate-300 mb-2" />
          <span className="text-xs font-semibold text-slate-400">Introduce las dimensiones y factores de arriba</span>
          <span className="text-[10px] text-slate-400/80 mt-1">Calcularemos el caballaje en BTU idóneo para climatizar eficientemente tu espacio.</span>
        </div>
      )}

    </div>
  );
}
