/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import AdminDashboard from './components/AdminDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import TechnicianRoute from './components/TechnicianRoute';
import DiagnosticsTab from './components/DiagnosticsTab';
import BTUCalculatorTab from './components/BTUCalculatorTab';
import RolePortal from './components/RolePortal';

import {
  AirConditioner,
  Appointment,
  ChatMessage,
  Employee,
  CatalogPrice,
  InventoryItem,
  Client,
  Quote,
  CajaChicaLog,
  RouteExpense,
  AuditLog
} from './types';

// Seeding Initial Realistic Data
const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Omar Castillo', role: 'admin', permissions: ['all'], completedServices: 0, status: 'active' },
  { id: 'emp-2', name: 'Carlos Torres', role: 'technician', permissions: ['agenda', 'route', 'status_update', 'photos'], completedServices: 8, status: 'active' },
  { id: 'emp-3', name: 'Alejandro Ruiz', role: 'technician', permissions: ['agenda', 'route', 'status_update', 'photos'], completedServices: 5, status: 'active' },
  { id: 'emp-4', name: 'Sandra Méndez', role: 'technician', permissions: ['agenda', 'route', 'status_update', 'photos'], completedServices: 11, status: 'active' },
  { id: 'emp-5', name: 'Juan Pérez', role: 'technician', permissions: ['agenda', 'route', 'status_update', 'photos'], completedServices: 4, status: 'active' },
  { id: 'emp-6', name: 'Lorena Castro', role: 'coordinator', permissions: ['clients', 'schedule', 'quotes', 'caja_chica'], completedServices: 0, status: 'active' },
  { id: 'emp-7', name: 'Martha Gómez', role: 'coordinator', permissions: ['clients', 'schedule', 'quotes', 'caja_chica'], completedServices: 0, status: 'active' },
];

const INITIAL_CATALOG: CatalogPrice[] = [
  { id: 'cat-1', name: 'Mantenimiento de MiniSplit (1 TR)', description: 'Lavado químico de serpentines, limpieza de turbina, filtros y charola de condensados.', price: 1200 },
  { id: 'cat-2', name: 'Instalación de MiniSplit', description: 'Fijación de evaporador, perforación, tendido de tubería de cobre hasta 4m y vacío.', price: 2500 },
  { id: 'cat-3', name: 'Recarga de Gas R410a', description: 'Presurización, detección de fuga menor, sellado y recarga completa de refrigerante ecológico.', price: 1800 },
  { id: 'cat-4', name: 'Cambio de Capacitor', description: 'Diagnóstico de arranque y reemplazo de capacitor de marcha para compresor o ventilador.', price: 950 },
  { id: 'cat-5', name: 'Cambio de Tarjeta Universal', description: 'Retiro de tarjeta dañada y adaptación de tarjeta electrónica universal con control remoto.', price: 2200 },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'part-1', name: 'Gas Refrigerante R410a', code: 'GAS-R410A', stock: 15, unit: 'kg', price: 1200 },
  { id: 'part-2', name: 'Capacitor de Marcha 45uF', code: 'CAP-45UF', stock: 24, unit: 'pzas', price: 450 },
  { id: 'part-3', name: 'Tarjeta Universal MiniSplit', code: 'TAR-UNIV', stock: 8, unit: 'pzas', price: 1100 },
  { id: 'part-4', name: 'Protector de Voltaje', code: 'PROT-VOLT', stock: 12, unit: 'pzas', price: 350 },
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'cli-1', name: 'Juan Pérez', phone: '+52 55 1234 5678', address: 'Av. Paseo de la Reforma #240, Depto 4B', source: 'Llegó por Facebook', registeredAt: '2026-07-01' },
  { id: 'cli-2', name: 'María Elena Ortiz', phone: '+52 55 9876 5432', address: 'Calle Sierra Madre #1024, Col. Lomas', source: 'Llamada Directa', registeredAt: '2026-07-03' },
  { id: 'cli-3', name: 'Roberto Gómez', phone: '+52 81 2456 7890', address: 'Calle Las Palmas #422, Monterrey', source: 'WhatsApp', registeredAt: '2026-07-05' },
];

const INITIAL_QUOTES: Quote[] = [
  {
    id: 'COT-89210',
    clientName: 'Juan Pérez',
    clientPhone: '+52 55 1234 5678',
    clientAddress: 'Av. Paseo de la Reforma #240, Depto 4B',
    servicesSelected: [
      { name: 'Mantenimiento de MiniSplit (1 TR)', price: 1200 }
    ],
    total: 1200,
    status: 'accepted',
    createdAt: '2026-07-04'
  }
];

const INITIAL_CAJA_LOGS: CajaChicaLog[] = [
  { id: 'cj-1', type: 'income', amount: 1200, concept: 'Cobro de cotización COT-89210 - Juan Pérez', date: '2026-07-04', status: 'validated' },
  { id: 'cj-2', type: 'expense', amount: 350, concept: 'Compra de cinta teflón y conectores de cobre', date: '2026-07-05', status: 'validated' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APP-9201',
    clientName: 'Juan Pérez',
    clientPhone: '+52 55 1234 5678',
    clientAddress: 'Av. Paseo de la Reforma #240, Depto 4B',
    acId: 'ac-1',
    acNickname: 'MiniSplit Dormitorio',
    serviceType: 'maintenance',
    date: '2026-07-08',
    timeSlot: 'Mañana (8:00 AM - 12:00 PM)',
    details: 'Mantenimiento preventivo anual, limpieza de turbina evaporadora.',
    status: 'assigned',
    technicianId: 'emp-2', // Carlos Torres
    technicianName: 'Carlos Torres',
    createdAt: '2026-07-06T18:00:00.000Z',
  },
  {
    id: 'APP-4552',
    clientName: 'María Elena Ortiz',
    clientPhone: '+52 55 9876 5432',
    clientAddress: 'Calle Sierra Madre #1024, Col. Lomas',
    acId: 'ac-2',
    acNickname: 'MiniSplit Sala Estar',
    serviceType: 'repair',
    date: '2026-07-08',
    timeSlot: 'Tarde (12:00 PM - 4:00 PM)',
    details: 'El clima no enfría, arroja aire tibio. Posible daño en capacitor.',
    status: 'pending', // Pending assignation
    createdAt: '2026-07-06T19:00:00.000Z',
  }
];

const INITIAL_AUDIT: AuditLog[] = [
  { id: 'aud-1', timestamp: '19:00:00', user: 'Lorena Castro', role: 'coordinador', action: 'Agendó servicio de reparación para María Elena Ortiz' },
  { id: 'aud-2', timestamp: '18:15:00', user: 'Omar Castillo', role: 'admin', action: 'Actualizó stock de Capacitor de Marcha a 24 pzas' },
];

export default function App() {
  const [activeRole, setActiveRole] = useState<'admin' | 'coordinator' | 'technician' | 'portal'>('portal');
  const [activeTab, setActiveTab] = useState<'workspace' | 'diagnose' | 'calculator'>('workspace');
  
  // App States with LocalStorage Persistence
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('fc_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [catalog, setCatalog] = useState<CatalogPrice[]>(() => {
    const saved = localStorage.getItem('fc_catalog');
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('fc_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('fc_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('fc_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('fc_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [cajaLogs, setCajaLogs] = useState<CajaChicaLog[]>(() => {
    const saved = localStorage.getItem('fc_caja');
    return saved ? JSON.parse(saved) : INITIAL_CAJA_LOGS;
  });

  const [routeExpenses, setRouteExpenses] = useState<RouteExpense[]>([]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('fc_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('hvac_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isThinking, setIsThinking] = useState(false);

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('fc_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('fc_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('fc_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('fc_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('fc_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('fc_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('fc_caja', JSON.stringify(cajaLogs));
  }, [cajaLogs]);

  useEffect(() => {
    localStorage.setItem('fc_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('hvac_chat_history', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // General Logging helper
  const addAuditLog = (action: string) => {
    const userName = activeRole === 'admin' ? 'Omar Castillo' : activeRole === 'coordinator' ? 'Lorena Castro' : 'Carlos Torres';
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      user: userName,
      role: activeRole,
      action,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Quick book triggered from BTU Calculator
  const handleQuickBook = (capacityBTU: number, recommendedText: string) => {
    // We add client prefill info and switch to coordinator tab
    setActiveRole('coordinator');
    setActiveTab('workspace');
    addAuditLog(`Calculó capacidad recomendada de ${capacityBTU.toLocaleString()} BTU`);
  };

  // AI Chat Communication with Gemini (Diagnostics)
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

  if (activeRole === 'portal') {
    return (
      <RolePortal
        onSelectRole={(role) => {
          setActiveRole(role);
          setActiveTab('workspace');
        }}
      />
    );
  }

  return (
    <MobileFrame
      activeRole={activeRole as any}
      onRoleChange={(role) => {
        setActiveRole(role);
        setActiveTab('workspace');
      }}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      
      {/* Main Tab Switch Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'workspace' && (
          <>
            {activeRole === 'admin' && (
              <AdminDashboard
                employees={employees}
                setEmployees={setEmployees}
                catalog={catalog}
                setCatalog={setCatalog}
                inventory={inventory}
                setInventory={setInventory}
                cajaLogs={cajaLogs}
                auditLogs={auditLogs}
                addAuditLog={addAuditLog}
              />
            )}

            {activeRole === 'coordinator' && (
              <CoordinatorDashboard
                clients={clients}
                setClients={setClients}
                appointments={appointments}
                setAppointments={setAppointments}
                quotes={quotes}
                setQuotes={setQuotes}
                catalog={catalog}
                employees={employees}
                cajaLogs={cajaLogs}
                setCajaLogs={setCajaLogs}
                addAuditLog={addAuditLog}
                onAddAppointment={(appt) => {
                  const newAppt: Appointment = {
                    ...appt,
                    id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                  };
                  setAppointments(prev => [newAppt, ...prev]);
                }}
              />
            )}

            {activeRole === 'technician' && (
              <TechnicianRoute
                appointments={appointments}
                setAppointments={setAppointments}
                inventory={inventory}
                setInventory={setInventory}
                routeExpenses={routeExpenses}
                setRouteExpenses={setRouteExpenses}
                setCajaLogs={setCajaLogs}
                employees={employees}
                setEmployees={setEmployees}
                addAuditLog={addAuditLog}
              />
            )}
          </>
        )}

        {activeTab === 'diagnose' && (
          <DiagnosticsTab
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
          />
        )}

        {activeTab === 'calculator' && (
          <BTUCalculatorTab onQuickBook={handleQuickBook} />
        )}
      </div>

    </MobileFrame>
  );
}
