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
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/50',
      glowColor: 'shadow-rose-500/10',
    },
    {
      id: 'coordinator' as RoleType,
      name: 'Coordinador / Oficina',
      icon: Users,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/50',
      glowColor: 'shadow-amber-500/10',
    },
    {
      id: 'technician' as RoleType,
      name: 'Técnico en Campo',
      icon: Wrench,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50',
      glowColor: 'shadow-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] text-slate-100 font-sans antialiased relative px-4 py-8 select-none overflow-hidden">
      {/* Soft ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative clean mesh grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        
        {/* PWA Installation Top Notification Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-md"
        >
          {!isInstalled ? (
            <button
              onClick={triggerInstall}
              className="w-full bg-gradient-to-r from-blue-600/90 to-cyan-500/90 hover:from-blue-600 hover:to-cyan-500 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/20 border border-white/10 cursor-pointer group transition-all duration-300"
            >
              <Smartphone className="w-4 h-4 animate-bounce shrink-0 text-cyan-200" />
              <span>Instalar App en tu Celular (PWA)</span>
              <Download className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-y-0.5 shrink-0" />
            </button>
          ) : (
            <div className="w-full bg-slate-800/80 backdrop-blur-md text-slate-300 text-[10px] md:text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700/50">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Aplicación instalada como PWA en tu dispositivo</span>
            </div>
          )}
        </motion.div>

        {/* Logo & Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <img
            src="https://appdesignproyectos.com/caloryfriologo.png"
            alt="Calor y Frío"
            className="h-24 md:h-28 w-auto object-contain mb-4 drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
            Calor y Frío
          </h1>
          <p className="text-[10px] md:text-xs text-blue-400 font-bold tracking-[0.2em] uppercase mt-3">
            Climas & Climatización • Sistema de Operaciones
          </p>
        </motion.div>

        {/* Roles Selector Container */}
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
                className="group relative flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-blue-500/40 rounded-2xl p-8 py-10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer"
              >
                {/* Active Indicator Pulse */}
                <div className="absolute top-4 right-4 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </div>

                {/* Styled Role Icon */}
                <div className={`w-18 h-18 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300 group-hover:scale-110 ${role.colorClass}`}>
                  <Icon className="w-9 h-9" />
                </div>

                {/* Role Title */}
                <span className="text-lg font-bold text-white tracking-wide group-hover:text-blue-400 transition-colors duration-150">
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
          className="mt-16 flex items-center gap-2 text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.25em]"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Servidor Activo • Conexión Segura
        </motion.div>
      </div>
    </div>
  );
}
