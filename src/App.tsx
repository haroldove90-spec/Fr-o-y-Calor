/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import AppointmentsTab from './components/AppointmentsTab';
import DiagnosticsTab from './components/DiagnosticsTab';
import MyACTab from './components/MyACTab';
import BTUCalculatorTab from './components/BTUCalculatorTab';
import { AirConditioner, Appointment, ChatMessage, AppointmentStatus } from './types';
import { CalendarRange, Sparkles, Cpu, Calculator, ThermometerSnowflake, UserCheck, ShieldAlert, Wrench } from 'lucide-react';

const INITIAL_AC_LIST: AirConditioner[] = [
  {
    id: 'ac-1',
    brand: 'Carrier',
    model: 'Inverter Prime 12K',
    nickname: 'Split Dormitorio Principal',
    type: 'split',
    btu: 12000,
    installationDate: '2024-05-12',
    lastServiceDate: '2025-11-20',
    status: 'maintenance_needed',
  },
  {
    id: 'ac-2',
    brand: 'LG',
    model: 'ArtCool Dual Inverter',
    nickname: 'Aire de la Sala Estar',
    type: 'split',
    btu: 18000,
    installationDate: '2025-01-10',
    lastServiceDate: '2026-01-10',
    status: 'normal',
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APP-9201',
    clientName: 'Juan Pérez',
    clientPhone: '+56 9 8765 4321',
    clientAddress: 'Av. Libertador #1040, Depto 42B',
    acId: 'ac-1',
    acNickname: 'Split Dormitorio Principal',
    serviceType: 'maintenance',
    date: '2026-07-08',
    timeSlot: 'Mañana (8:00 AM - 12:00 PM)',
    details: 'Mantenimiento preventivo anual, limpieza de turbina evaporadora y serpentín exterior debido a un ligero olor a humedad.',
    status: 'assigned',
    createdAt: '2026-07-06T18:00:00.000Z',
  }
];

export default function App() {
  const [activeRole, setActiveRole] = useState<'client' | 'technician'>('client');
  const [activeTab, setActiveTab] = useState<'appointments' | 'diagnose' | 'equipment' | 'calculator'>('appointments');
  
  // App States with LocalStorage Persistence
  const [acList, setAcList] = useState<AirConditioner[]>(() => {
    const saved = localStorage.getItem('hvac_ac_list');
    return saved ? JSON.parse(saved) : INITIAL_AC_LIST;
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hvac_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('hvac_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [quickBookData, setQuickBookData] = useState<{ capacityBTU: number; recommendedText: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('hvac_ac_list', JSON.stringify(acList));
  }, [acList]);

  useEffect(() => {
    localStorage.setItem('hvac_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('hvac_chat_history', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Actions
  const handleAddAC = (newAc: Omit<AirConditioner, 'id'>) => {
    const ac: AirConditioner = {
      ...newAc,
      id: `ac-${Date.now()}`,
    };
    setAcList((prev) => [ac, ...prev]);
  };

  const handleAddAppointment = (newAppt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const appt: Appointment = {
      ...newAppt,
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // If client booked for an existing AC, mark its status as 'pending'
    if (newAppt.acId !== 'new') {
      setAcList(prev => prev.map(ac => {
        if (ac.id === newAppt.acId) {
          return { ...ac, status: newAppt.serviceType === 'repair' ? 'faulty' : ac.status };
        }
        return ac;
      }));
    }

    setAppointments((prev) => [appt, ...prev]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus, techNotes?: string) => {
    setAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id === id) {
          // Sync AC status if service completed
          if (status === 'completed' && appt.acId !== 'new') {
            setAcList((currentACs) =>
              currentACs.map((ac) => {
                if (ac.id === appt.acId) {
                  return {
                    ...ac,
                    status: 'normal',
                    lastServiceDate: new Date().toISOString().split('T')[0],
                  };
                }
                return ac;
              })
            );
          }
          return {
            ...appt,
            status,
            technicianNotes: techNotes !== undefined ? techNotes : appt.technicianNotes,
          };
        }
        return appt;
      })
    );
  };

  // Quick book triggered from BTU Calculator
  const handleQuickBook = (capacityBTU: number, recommendedText: string) => {
    setQuickBookData({ capacityBTU, recommendedText });
    setActiveTab('appointments');
  };

  // Direct diagnosis prefill query triggered from MyAC Card
  const handleAskAIAboutAC = (acNickname: string, brand: string, type: string) => {
    const prefillQuery = `Hola, quiero consultar sobre mi aire acondicionado "${acNickname}" de la marca ${brand} (tipo ${type}). ¿Qué mantenimiento preventivo regular me recomiendas hacerle y cada cuánto tiempo?`;
    handleSendMessage(prefillQuery);
    setActiveTab('diagnose');
  };

  // AI Chat Communication with Gemini
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setIsThinking(true);

    try {
      // Build history payloads for the Express server (/api/diagnose)
      const payloadMessages = updatedHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error('No se pudo obtener respuesta del servidor de diagnóstico.');
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error fetching diagnosis:', error);
      
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        text: '⚠️ Ocurrió un error al procesar tu consulta técnica con el motor de IA. Por favor, asegúrate de que el servidor esté activo o intenta de nuevo en unos momentos.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <MobileFrame
      activeRole={activeRole}
      onRoleToggle={() => setActiveRole(activeRole === 'client' ? 'technician' : 'client')}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      
      {/* Main Tab Screen Panel Content (Scrollable internally) */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            acList={acList}
            activeRole={activeRole}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            quickBookData={quickBookData}
            onClearQuickBook={() => setQuickBookData(null)}
          />
        )}

        {activeTab === 'diagnose' && (
          <DiagnosticsTab
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
          />
        )}

        {activeTab === 'equipment' && (
          <MyACTab
            acList={acList}
            onAddAC={handleAddAC}
            onBookService={(acId, acNickname, serviceType) => {
              setQuickBookData({ acId, serviceType });
              setActiveTab('appointments');
            }}
            onAskAIAboutAC={handleAskAIAboutAC}
          />
        )}

        {activeTab === 'calculator' && (
          <BTUCalculatorTab onQuickBook={handleQuickBook} />
        )}
      </div>

    </MobileFrame>
  );
}
