/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Users, Wrench, Download, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { usePWA } from '../hooks/usePWA';

type RoleType = 'admin' | 'coordinator' | 'technician';

interface RolePortalProps {
  onSelectRole: (role: RoleType) => void;
}

export default function RolePortal({ onSelectRole }: RolePortalProps) {
  const { isInstallable, isInstalled, triggerInstall } = usePWA();

  const roles = [
    {
      id: 'admin' as RoleType,
      name: 'Administrador',
      icon: Shield,
      colorClass: 'text-[#DF4126] bg-[#DF4126]/10 border-[#DF4126]/20 group-hover:bg-[#DF4126]/15 group-hover:border-[#DF4126]/45',
      indicatorBg: 'bg-[#DF4126]',
    },
    {
      id: 'coordinator' as RoleType,
      name: 'Coordinador / Oficina',
      icon: Users,
      colorClass: 'text-[#3B6774] bg-[#3B6774]/10 border-[#3B6774]/20 group-hover:bg-[#3B6774]/15 group-hover:border-[#3B6774]/45',
      indicatorBg: 'bg-[#3B6774]',
    },
    {
      id: 'technician' as RoleType,
      name: 'Técnico en Campo',
      icon: Wrench,
      colorClass: 'text-[#96B4A8] bg-[#96B4A8]/10 border-[#96B4A8]/20 group-hover:bg-[#96B4A8]/15 group-hover:border-[#96B4A8]/45',
      indicatorBg: 'bg-[#96B4A8]',
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#3B6774] text-[#FFF5CB] font-sans antialiased relative px-4 py-8 select-none overflow-hidden">
      {/* Ambient background glows using Pantone palette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#96B4A8]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-[#DF4126]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative clean grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,245,203,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,245,203,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        
        {/* PWA Installation Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-md"
        >
          {!isInstalled ? (
            <button
              onClick={triggerInstall}
              className="w-full bg-gradient-to-r from-[#DF4126] to-[#DF4126]/90 hover:from-[#DF4126] hover:to-[#DF4126] text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-black/15 border border-white/10 cursor-pointer group transition-all duration-300"
            >
              <Smartphone className="w-4 h-4 animate-bounce shrink-0 text-[#FFF5CB]" />
              <span>Instalar App en tu Celular (PWA)</span>
              <Download className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-y-0.5 shrink-0" />
            </button>
          ) : (
            <div className="w-full bg-[#FFF5CB]/10 backdrop-blur-md text-[#FFF5CB] text-[10px] md:text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 border border-[#FFF5CB]/20">
              <span className="w-2 h-2 bg-[#96B4A8] rounded-full animate-pulse" />
              <span>Aplicación instalada como PWA en tu dispositivo</span>
            </div>
          )}
        </motion.div>

        {/* Logo Header (Title text removed as per request) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <img
            src="https://appdesignproyectos.com/caloryfriologo.png"
            alt="Calor y Frío"
            className="h-28 md:h-32 w-auto object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <p className="text-[10px] md:text-xs text-[#FFF5CB]/85 font-bold tracking-[0.2em] uppercase mt-4">
            Climas & Climatización • Sistema de Operaciones
          </p>
        </motion.div>

        {/* Roles Selector Container (Using #FFF5CB Soft Cream for Card Backgrounds) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl px-4">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.2, ease: 'easeOut' }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col items-center justify-center bg-[#FFF5CB] border border-[#FFF5CB]/80 hover:border-[#DF4126]/30 rounded-2xl p-8 py-10 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/15 cursor-pointer"
              >
                {/* Active Indicator Pulse in custom pantone red/teal/sage */}
                <div className="absolute top-4 right-4 flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${role.indicatorBg}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${role.indicatorBg}`}></span>
                </div>

                {/* Styled Role Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300 group-hover:scale-110 ${role.colorClass}`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Role Title */}
                <span className="text-base font-bold text-[#3B6774] tracking-wide group-hover:text-[#DF4126] transition-colors duration-150">
                  {role.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex items-center gap-2 text-[10px] text-[#FFF5CB]/60 font-extrabold uppercase tracking-[0.25em]"
        >
          <span className="w-2 h-2 bg-[#96B4A8] rounded-full animate-pulse" />
          Servidor Activo • Conexión Segura
        </motion.div>
      </div>
    </div>
  );
}
