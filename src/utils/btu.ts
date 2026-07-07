/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BTUMeasurements } from '../types';

export interface BTUResult {
  baseBTU: number;
  sunFactor: number;
  peopleFactor: number;
  devicesFactor: number;
  climateFactor: number;
  totalBTU: number;
  recommendedCommercialSize: string;
}

export function calculateBTU(measurements: BTUMeasurements): BTUResult {
  const { width, length, sunExposure, occupants, electricalDevices, climateZone } = measurements;
  
  // Calculate Area
  const area = width * length;
  
  // Base BTU per square meter
  let baseFactor = 600; // Standard base (600 BTU/m2)
  if (sunExposure === 'high') {
    baseFactor = 800; // Increased base due to high solar radiation
  } else if (sunExposure === 'low') {
    baseFactor = 500; // Reduced base for shaded rooms
  }
  
  const baseBTU = Math.round(area * baseFactor);
  
  // Sun factor surplus (already baked in or extra details)
  const sunFactor = sunExposure === 'high' ? Math.round(area * 200) : 0;
  
  // Occupants Factor (first 2 occupants included in standard. Beyond that, +500 BTU per person)
  const extraOccupants = Math.max(0, occupants - 2);
  const peopleFactor = extraOccupants * 500;
  
  // Electrical devices factor (+600 BTU per device)
  const devicesFactor = electricalDevices * 600;
  
  // Climate multiplier
  let climateMultiplier = 1.0;
  if (climateZone === 'warm') {
    climateMultiplier = 1.15;
  } else if (climateZone === 'tropical') {
    climateMultiplier = 1.30;
  }
  
  const totalBeforeClimate = (area * 600) + sunFactor + peopleFactor + devicesFactor;
  const totalBTU = Math.round(totalBeforeClimate * climateMultiplier);
  
  const climateFactor = Math.round(totalBeforeClimate * (climateMultiplier - 1));
  
  // Find nearest commercial split sizes in BTUs:
  // Standard sizes: 9,000, 12,000, 18,000, 24,000, 36,000 BTU
  let recommendedCommercialSize = "9,000 BTU (0.75 Tonelada)";
  if (totalBTU <= 9000) {
    recommendedCommercialSize = "9,000 BTU (0.75 Tonelada)";
  } else if (totalBTU <= 12000) {
    recommendedCommercialSize = "12,000 BTU (1.0 Tonelada)";
  } else if (totalBTU <= 18000) {
    recommendedCommercialSize = "18,000 BTU (1.5 Toneladas)";
  } else if (totalBTU <= 24000) {
    recommendedCommercialSize = "24,000 BTU (2.0 Toneladas)";
  } else if (totalBTU <= 36000) {
    recommendedCommercialSize = "36,000 BTU (3.0 Toneladas)";
  } else {
    recommendedCommercialSize = "Múltiples Unidades (Recomendado: " + Math.ceil(totalBTU / 18000) + "x unidades de 18,000 BTU)";
  }
  
  return {
    baseBTU,
    sunFactor,
    peopleFactor,
    devicesFactor,
    climateFactor,
    totalBTU,
    recommendedCommercialSize
  };
}
