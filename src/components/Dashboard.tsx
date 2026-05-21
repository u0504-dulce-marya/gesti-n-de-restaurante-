/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ChefHat, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat as HatIcon,
  PlusCircle
} from 'lucide-react';
import { Personal, Chef, Cliente, Platillo, Comanda, Venta } from '../types';

interface DashboardProps {
  personal: Personal[];
  chefs: Chef[];
  clientes: Cliente[];
  platillos: Platillo[];
  comandas: Comanda[];
  ventas: Venta[];
  setActiveTab: (tab: string) => void;
  onQuickActionNewOrder: () => void;
}

export default function Dashboard({
  personal,
  chefs,
  clientes,
  platillos,
  comandas,
  ventas,
  setActiveTab,
  onQuickActionNewOrder,
}: DashboardProps) {
  // Calculations
  const activeComandasCount = comandas.filter(c => c.estado !== 'Entregado' && c.estado !== 'Cancelado').length;
  
  // Today's Sales (taking into account simulated dates of today or last 24h)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const salesTodayTotal = ventas
    .filter(v => new Date(v.fecha).getTime() >= todayStart.getTime())
    .reduce((sum, v) => sum + v.total, 0);

  const activeChefsCount = chefs.filter(c => c.estado === 'En Cocina').length;
  const clientCount = clientes.filter(c => c.activo).length;

  // Active orders by status
  const ordersEnCola = comandas.filter(c => c.estado === 'En Cola');
  const ordersPrep = comandas.filter(c => c.estado === 'Prep');
  const ordersListo = comandas.filter(c => c.estado === 'Listo');

  // Last 4 completed sales
  const recentSales = [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 4);

  // Helper to get client name
  const getClientName = (id: string) => {
    const c = clientes.find(client => client.id === id);
    return c ? c.nombre : 'Cliente General';
  };

  // Helper to get waiter name
  const getWaiterName = (id: string) => {
    const p = personal.find(pers => pers.id === id);
    return p ? p.nombre : 'Camarero N/A';
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#f5f2ed]">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#0c0c0c] border border-[#2a2a2a] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-[#c1a35f]/5 to-transparent pointer-events-none"></div>
        <div className="space-y-1.5 relative z-10">
          <h1 className="text-2xl md:text-3xl font-serif italic text-[#c1a35f] tracking-tight">¡Bienvenido de vuelta, Administrador!</h1>
          <p className="text-[#f5f2ed]/60 text-xs md:text-sm max-w-xl">El restaurante está operando con normalidad. Aquí está el resumen administrativo de la sesión actual.</p>
        </div>
        <button
          id="btn-quick-new-order"
          onClick={onQuickActionNewOrder}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-lg shadow-[#c1a35f]/10 transition duration-200 cursor-pointer relative z-10 border border-[#c1a35f]/20"
        >
          <PlusCircle size={15} />
          <span>Nueva Comanda</span>
        </button>
      </div>
 
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div id="kpi-sales-today" className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/20 transition-colors">
          <div className="p-3 bg-[#1c1c1c] text-[#c1a35f] rounded-xl border border-[#2a2a2a]">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#f5f2ed]/40 font-mono uppercase tracking-widest block mb-1">Ventas de Hoy</span>
            <span className="text-2xl font-serif text-[#f5f2ed] block">${salesTodayTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
 
        {/* KPI 2 */}
        <div id="kpi-active-orders" className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/20 transition-colors">
          <div className="p-3 bg-[#1c1c1c] text-blue-400 rounded-xl border border-[#2a2a2a]">
            <Receipt size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#f5f2ed]/40 font-mono uppercase tracking-widest block mb-1">Comandas Activas</span>
            <span className="text-2xl font-serif text-[#f5f2ed] block">{activeComandasCount}</span>
          </div>
        </div>
 
        {/* KPI 3 */}
        <div id="kpi-active-chefs" className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/20 transition-colors">
          <div className="p-3 bg-[#1c1c1c] text-green-400 rounded-xl border border-[#2a2a2a]">
            <ChefHat size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#f5f2ed]/40 font-mono uppercase tracking-widest block mb-1">Chefs en Cocina</span>
            <span className="text-2xl font-serif text-[#f5f2ed] block">{activeChefsCount} / {chefs.length}</span>
          </div>
        </div>
 
        {/* KPI 4 */}
        <div id="kpi-loyal-clients" className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/20 transition-colors">
          <div className="p-3 bg-[#1c1c1c] text-rose-400 rounded-xl border border-[#2a2a2a]">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#f5f2ed]/40 font-mono uppercase tracking-widest block mb-1">Clientes VIP</span>
            <span className="text-2xl font-serif text-[#f5f2ed] block">{clientCount}</span>
          </div>
        </div>
      </div>
 
      {/* Main Content Grid (Active Orders + Chefs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kanban Orders - Takes 2 Cols on Desktop */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-[#f5f2ed] flex items-center gap-2">
              <Clock className="text-[#c1a35f]" size={16} />
              <span className="font-serif italic text-lg capitalize tracking-normal text-[#c1a35f]">Monitoreo de Comandas</span>
            </h2>
            <button 
              onClick={() => setActiveTab('comandas')} 
              className="text-[#c1a35f] hover:text-[#b0914e] text-xs font-serif italic hover:underline"
            >
              Ver todas las comandas →
            </button>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: En Cola */}
            <div className="bg-[#0c0c0c] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                <span className="text-xs font-mono tracking-wider text-[#f5f2ed]/70 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-600 block"></span>
                  <span>EN COLA</span>
                </span>
                <span className="bg-[#141414] text-[#c1a35f] text-xs font-bold font-mono px-2 py-0.5 rounded border border-[#2a2a2a]">{ordersEnCola.length}</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {ordersEnCola.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#f5f2ed]/40 bg-[#141414]/40 rounded-xl border border-dashed border-[#2a2a2a]">
                    Sin comandas en cola.
                  </div>
                ) : (
                  ordersEnCola.map(order => (
                    <div key={order.id} className="bg-[#141414] p-3.5 rounded-xl border border-[#2a2a2a] space-y-2 hover:border-[#c1a35f]/40 transition duration-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-[#c1a35f]">{order.codigo}</span>
                        <span className="text-[#f5f2ed]/50 font-mono text-[11px] bg-[#0c0c0c] px-1.5 py-0.5 rounded border border-[#2a2a2a]/60">{order.numeroMesa}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#f5f2ed] line-clamp-1">{getClientName(order.clienteId)}</p>
                      <div className="text-[11px] text-[#f5f2ed]/50 border-t border-[#2a2a2a]/60 pt-1.5 flex justify-between">
                        <span>Items: {order.items.reduce((acc, i) => acc + (i.cantidad as number), 0)}</span>
                        <span className="font-bold text-[#c1a35f]">${order.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
 
            {/* Column 2: En Preparación */}
            <div className="bg-[#0c0c0c] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                <span className="text-xs font-mono tracking-wider text-[#f5f2ed]/70 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 block animate-pulse"></span>
                  <span>PREPARACIÓN</span>
                </span>
                <span className="bg-[#141414] text-amber-400 text-xs font-bold font-mono px-2 py-0.5 rounded border border-[#2a2a2a]">{ordersPrep.length}</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {ordersPrep.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#f5f2ed]/40 bg-[#141414]/40 rounded-xl border border-dashed border-[#2a2a2a]">
                    Sin comandas preparándose.
                  </div>
                ) : (
                  ordersPrep.map(order => {
                    const chef = chefs.find(ch => ch.id === order.chefId);
                    return (
                      <div key={order.id} className="bg-[#141414] p-3.5 rounded-xl border border-[#2a2a2a] border-l-2 border-l-[#c1a35f] space-y-2 hover:border-[#c1a35f]/50 transition duration-200">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-[#c1a35f]">{order.codigo}</span>
                          <span className="text-[#f5f2ed]/50 font-mono text-[11px] bg-[#0c0c0c] px-1.5 py-0.5 rounded border border-[#2a2a2a]/60">{order.numeroMesa}</span>
                        </div>
                        <p className="text-xs font-semibold text-[#f5f2ed] line-clamp-1">{getClientName(order.clienteId)}</p>
                        {chef && (
                          <div className="flex items-center gap-1 text-[11px] bg-[#1c1c1c] text-[#c1a35f] px-2 py-0.5 rounded border border-[#c1a35f]/20 w-fit">
                            <HatIcon size={11} />
                            <span className="truncate max-w-[130px]">{chef.nombre.replace('Chef ', '')}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-[#f5f2ed]/50 border-t border-[#2a2a2a]/60 pt-1.5 flex justify-between">
                          <span>Items: {order.items.reduce((acc, i) => acc + (i.cantidad as number), 0)}</span>
                          <span className="font-bold text-[#c1a35f]">${order.total}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
 
            {/* Column 3: Listo para entregar */}
            <div className="bg-[#0c0c0c] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                <span className="text-xs font-mono tracking-wider text-[#f5f2ed]/70 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                  <span>LISTO</span>
                </span>
                <span className="bg-[#141414] text-green-400 text-xs font-bold font-mono px-2 py-0.5 rounded border border-[#2a2a2a]">{ordersListo.length}</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {ordersListo.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#f5f2ed]/40 bg-[#141414]/40 rounded-xl border border-dashed border-[#2a2a2a]">
                    Sin comandas listas.
                  </div>
                ) : (
                  ordersListo.map(order => (
                    <div key={order.id} className="bg-[#141414] p-3.5 rounded-xl border border-[#2a2a2a] border-l-2 border-l-green-500 space-y-2 hover:border-green-500/40 transition duration-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-green-400">{order.codigo}</span>
                        <span className="text-[#f5f2ed]/50 font-mono text-[11px] bg-[#0c0c0c] px-1.5 py-0.5 rounded border border-[#2a2a2a]/60">{order.numeroMesa}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#f5f2ed] line-clamp-1">{getClientName(order.clienteId)}</p>
                      <div className="text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded w-fit font-medium">
                        Listo para servir
                      </div>
                      <div className="text-[11px] text-[#f5f2ed]/50 border-t border-[#2a2a2a]/60 pt-1.5 flex justify-between">
                        <span>Items: {order.items.reduce((acc, i) => acc + (i.cantidad as number), 0)}</span>
                        <span className="font-bold text-[#c1a35f]">${order.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
 
        {/* Chefs Working - Takes 1 Col on Desktop */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-[#f5f2ed] flex items-center gap-2">
            <ChefHat className="text-[#c1a35f]" size={16} />
            <span className="font-serif italic text-lg capitalize tracking-normal text-[#c1a35f]">Estado de los Chefs</span>
          </h2>
 
          <div className="bg-[#0c0c0c] rounded-xl border border-[#2a2a2a] p-5 space-y-4">
            {chefs.map(chef => (
              <div key={chef.id} className="flex items-center justify-between border-b border-[#2a2a2a]/60 pb-3.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-[#f5f2ed]">{chef.nombre}</h3>
                  <span className="text-xs text-[#f5f2ed]/40 block font-mono text-[11px]">{chef.especialidad}</span>
                  {chef.ordenesAsignadas > 0 && (
                    <span className="inline-block text-[10px] font-bold font-mono text-[#c1a35f] bg-[#1c1c1c] border border-[#c1a35f]/20 px-2.5 py-0.5 rounded-full mt-1.5">
                      {chef.ordenesAsignadas} {chef.ordenesAsignadas === 1 ? 'comanda asignada' : 'comandas asignadas'}
                    </span>
                  )}
                </div>
                <div>
                  <span className={`inline-block text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded border ${
                    chef.estado === 'En Cocina' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                      : chef.estado === 'Libre' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                      : 'bg-[#141414] text-[#f5f2ed]/45 border-[#2a2a2a]'
                  }`}>
                    {chef.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Bottom Grid: Recent Sales + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recent Billing Log */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-[#f5f2ed] flex items-center gap-2">
            <AlertCircle className="text-[#c1a35f]" size={16} />
            <span className="font-serif italic text-lg capitalize tracking-normal text-[#c1a35f]">Últimas Facturaciones</span>
          </h2>
          <div className="bg-[#0c0c0c] rounded-xl border border-[#2a2a2a] overflow-hidden">
            {recentSales.length === 0 ? (
              <div className="text-center py-12 text-sm text-[#f5f2ed]/40 font-serif italic">
                No hay ventas registradas hoy todavía.
              </div>
            ) : (
              <div className="divide-y divide-[#2a2a2a]/60">
                {recentSales.map(v => (
                  <div key={v.id} className="p-4 flex items-center justify-between hover:bg-[#141414] transition duration-150">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#f5f2ed] font-mono">{v.codigoComanda}</span>
                          <span className="text-[#f5f2ed]/30 font-mono">|</span>
                          <span className="text-xs font-mono text-[#f5f2ed]/50">{new Date(v.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-[11px] text-[#f5f2ed]/40 block mt-0.5">Método de pago: <span className="font-mono text-[#f5f2ed]/60">{v.metodoPago}</span></span>
                      </div>
                    </div>
                    <span className="text-sm font-bold font-mono text-green-400">+${v.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="p-3.5 bg-[#141414] border-t border-[#2a2a2a] text-center">
              <button 
                onClick={() => setActiveTab('ventas')} 
                className="text-[#c1a35f] hover:text-[#b0914e]/90 text-xs font-serif italic hover:underline"
              >
                Ver registro de ventas →
              </button>
            </div>
          </div>
        </div>
 
        {/* Quick Operations Guide */}
        <div className="bg-[#0c0c0c] rounded-xl border border-[#2a2a2a] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-[#c1a35f] font-mono">Guía de Operación Rápida</h2>
            <p className="text-xs text-[#f5f2ed]/70 leading-relaxed">
              Utilice las pestañas superiores para administrar cada área. Al ingresar una nueva comanda, puede asignarla a un Chef disponible para cocina inmediata. Cuando esté lista, puede facturarla en la vista de <strong>Comandas</strong> para que se registre en el panel de <strong>Ventas</strong> e incremente los puntos del cliente VIP de forma automática.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#141414] rounded-lg border border-[#2a2a2a]">
                <span className="font-semibold text-neutral-200 block text-xs">Asignar Chef</span>
                <span className="text-[#f5f2ed]/40 text-[10px] mt-0.5 block">Optimiza tiempos de preparación</span>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-[#2a2a2a]">
                <span className="font-semibold text-neutral-200 block text-xs">Acumular VIP</span>
                <span className="text-[#f5f2ed]/40 text-[10px] mt-0.5 block">10% del total se convierte en puntos</span>
              </div>
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-[#2a2a2a]/60 flex items-center justify-between text-[11px] text-[#f5f2ed]/30 font-mono">
            <span>Servidor Central Activo</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"></span>
              <span>ONLINE</span>
            </span>
          </div>
        </div>
 
      </div>
    </div>
  );
}
