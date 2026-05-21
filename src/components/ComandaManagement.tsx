/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChefHat, 
  Clock, 
  User, 
  DollarSign, 
  Layers, 
  ArrowRight, 
  X, 
  Utensils, 
  CreditCard, 
  Coins, 
  Activity,
  UserCheck, 
  PenTool, 
  FileText,
  Ticket
} from 'lucide-react';
import { Personal, Chef, Cliente, Platillo, Comanda, ComandaItem } from '../types';

interface ComandaManagementProps {
  comandas: Comanda[];
  personal: Personal[];
  chefs: Chef[];
  clientes: Cliente[];
  platillos: Platillo[];
  onAddComanda: (newC: Omit<Comanda, 'id' | 'codigo' | 'fecha'>) => void;
  onUpdateComandaEstado: (id: string, nuevoEstado: Comanda['estado']) => void;
  onAssignChef: (comandaId: string, chefId: string) => void;
  onPagarComanda: (comandaId: string, metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia') => void;
  onCancelarComanda: (comandaId: string) => void;
  showNewOrderForm: boolean;
  setShowNewOrderForm: (show: boolean) => void;
  currentUserRole?: 'administrador' | 'mesero' | 'cocinero';
}

export default function ComandaManagement({
  comandas,
  personal,
  chefs,
  clientes,
  platillos,
  onAddComanda,
  onUpdateComandaEstado,
  onAssignChef,
  onPagarComanda,
  onCancelarComanda,
  showNewOrderForm,
  setShowNewOrderForm,
  currentUserRole = 'administrador',
}: ComandaManagementProps) {
  // Filter Camareros only
  const waiters = personal.filter(p => p.rol === 'Camarero' && p.activo);
  const activeChefs = chefs.filter(c => c.estado !== 'Descanso');

  // Filter Active vs Historical Comandas
  const activeComandas = comandas.filter(c => c.estado !== 'Entregado' && c.estado !== 'Cancelado');

  // New Comanda state variables
  const [numeroMesa, setNumeroMesa] = useState('Mesa 1');
  const [selectedCliente, setSelectedCliente] = useState(clientes[0]?.id || '');
  const [selectedCamarero, setSelectedCamarero] = useState(waiters[0]?.id || '');
  const [cart, setCart] = useState<{ [platilloId: string]: number }>({});
  const [notas, setNotas] = useState('');

  // Payment popup state
  const [payingComanda, setPayingComanda] = useState<Comanda | null>(null);

  // Helper selectors
  const getCliente = (id: string) => clientes.find(c => c.id === id);
  const getWaiter = (id: string) => personal.find(p => p.id === id);
  const getChef = (id: string | null) => chefs.find(c => c.id === id);

  // Cart operations
  const handleAddToCart = (platilloId: string) => {
    setCart(prev => ({
      ...prev,
      [platilloId]: (prev[platilloId] || 0) + 1
    }));
  };

  const handleUpdateCartQty = (platilloId: string, change: number) => {
    setCart(prev => {
      const copy = { ...prev };
      const current = copy[platilloId] || 0;
      const next = current + change;
      if (next <= 0) {
        delete copy[platilloId];
      } else {
        copy[platilloId] = next;
      }
      return copy;
    });
  };

  // Compute cart total
  const cartTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const pl = platillos.find(p => p.id === pId);
    const quantity = qty as number;
    return sum + (pl ? pl.precio * quantity : 0);
  }, 0);

  // Handle Comanda Submitting
  const handleCreateComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) {
      alert('Favor de añadir al menos un platillo a la comanda.');
      return;
    }

    // Convert cart helper object to ComandaItem array
    const cartItems: ComandaItem[] = Object.entries(cart).map(([platilloId, qty]) => {
      const pl = platillos.find(p => p.id === platilloId)!;
      const quantity = qty as number;
      return {
        platilloId,
         nombre: pl.nombre,
         precio: pl.precio,
         cantidad: quantity
      };
    });

    onAddComanda({
      numeroMesa,
      clienteId: selectedCliente,
      chefId: null, // assigned during kitchen prep flow
      camareroId: selectedCamarero,
      items: cartItems,
      notas,
      estado: 'En Cola',
      total: cartTotal
    });

    // Reset Form
    setNumeroMesa('Mesa 1');
    setCart({});
    setNotas('');
    setShowNewOrderForm(false);
  };

  // Process checkout/payment trigger
  const triggerPaymentPopup = (comanda: Comanda) => {
    setPayingComanda(comanda);
  };

  const submitPayment = (metodo: 'Efectivo' | 'Tarjeta' | 'Transferencia') => {
    if (payingComanda) {
      onPagarComanda(payingComanda.id, metodo);
      setPayingComanda(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#f5f2ed]">
      {/* Dynamic Tabs headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#2a2a2a] pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-[#c1a35f] tracking-tight">Mesa de Comandas</h1>
          <p className="text-[#f5f2ed]/50 text-xs md:text-sm">Crea, asigna preparación en cocina y realiza cobros a clientes.</p>
        </div>

        <div className="inline-flex bg-[#0c0c0c] border border-[#2a2a2a] p-1 rounded-lg w-fit shrink-0">
          <button
            id="tab-comandas-activas"
            onClick={() => setShowNewOrderForm(false)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition duration-150 ${
              !showNewOrderForm 
                ? 'bg-[#c1a35f] text-[#0c0c0c]' 
                : 'text-[#f5f2ed]/50 hover:text-[#f5f2ed]'
            }`}
          >
            <Ticket size={14} />
            <span>Activas ({activeComandas.length})</span>
          </button>
          {currentUserRole !== 'cocinero' && (
            <button
              id="tab-nueva-comanda"
              onClick={() => setShowNewOrderForm(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition duration-150 ${
                showNewOrderForm 
                  ? 'bg-[#c1a35f] text-[#0c0c0c]' 
                  : 'text-[#f5f2ed]/50 hover:text-[#f5f2ed]'
              }`}
            >
              <Plus size={14} />
              <span>Nueva Comanda</span>
            </button>
          )}
        </div>
      </div>

      {showNewOrderForm && currentUserRole !== 'cocinero' ? (
        /* Create Order screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-slide-in">
          {/* Menu Catalog selector - Left Part */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#c1a35f] flex items-center gap-1.5">
              <Utensils size={15} />
              <span>Seleccione Platillos del Menú</span>
            </h2>

            {/* Menu List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {platillos.map(p => (
                <div 
                  key={p.id} 
                  className={`bg-[#141414] rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 hover:border-[#c1a35f]/40 ${
                    p.disponible 
                      ? 'border-[#2a2a2a]' 
                      : 'border-[#2a2a2a]/40 opacity-40 bg-[#0c0c0c]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#f5f2ed]/40">{p.categoria}</span>
                      <span className="text-xs font-mono font-bold text-[#c1a35f]">${p.precio}</span>
                    </div>
                    <h3 className="font-serif italic text-sm text-[#f5f2ed] mt-1 leading-tight">{p.nombre}</h3>
                    <p className="text-[11px] text-[#f5f2ed]/50 line-clamp-2 mt-1 leading-normal">{p.ingredientes}</p>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#2a2a2a]/60">
                    <span className="text-[10px] text-[#f5f2ed]/40 font-mono">Cocción: {p.tiempoMin} min</span>
                    {p.disponible ? (
                      <button
                        type="button"
                        id={`btn-add-to-cart-${p.id}`}
                        onClick={() => handleAddToCart(p.id)}
                        className="bg-[#c1a35f] text-[#0c0c0c] hover:bg-[#b0914e] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition duration-150"
                      >
                        <Plus size={11} />
                        <span>Añadir</span>
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-red-400 uppercase bg-red-950/40 border border-red-900/30 px-2 py-0.5 rounded-sm">Agotado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout State Sidebar - Right Part */}
          <form onSubmit={handleCreateComanda} className="lg:col-span-5 bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl p-5 space-y-5 shadow-lg">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#c1a35f] border-b border-[#2a2a2a] pb-3">Resumen de Comanda</h2>

            {/* General Fields */}
            <div className="grid grid-cols-2 gap-4 text-[#f5f2ed]">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#f5f2ed]/50 uppercase tracking-wider font-mono">Mesa</label>
                <select
                  id="select-mesa-comanda"
                  value={numeroMesa}
                  onChange={(e) => setNumeroMesa(e.target.value)}
                  className="w-full p-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs font-semibold text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
                >
                  {Array.from({ length: 15 }, (_, i) => `Mesa ${i + 1}`).map(m => (
                    <option key={m} className="bg-[#141414] text-[#f5f2ed]" value={m}>{m}</option>
                  ))}
                  <option className="bg-[#141414] text-[#f5f2ed]" value="Terraza 1">Terraza 1</option>
                  <option className="bg-[#141414] text-[#f5f2ed]" value="Terraza 2">Terraza 2</option>
                  <option className="bg-[#141414] text-[#f5f2ed]" value="Barra 1">Barra 1</option>
                  <option className="bg-[#141414] text-[#f5f2ed]" value="Barra 2">Barra 2</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#f5f2ed]/50 uppercase tracking-wider font-mono">Atiende (Camarero)</label>
                <select
                  id="select-camarero-comanda"
                  value={selectedCamarero}
                  onChange={(e) => setSelectedCamarero(e.target.value)}
                  className="w-full p-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs font-semibold text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
                >
                  {waiters.map(w => (
                    <option key={w.id} className="bg-[#141414] text-[#f5f2ed]" value={w.id}>{w.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-[#f5f2ed]/50 uppercase tracking-wider font-mono">Cliente VIP (Puntos Club)</label>
                <select
                  id="select-cliente-comanda"
                  value={selectedCliente}
                  onChange={(e) => setSelectedCliente(e.target.value)}
                  className="w-full p-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs font-semibold text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
                >
                  {clientes.map(c => (
                    <option key={c.id} className="bg-[#141414] text-[#f5f2ed]" value={c.id}>{c.nombre} ({c.puntos} pts)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items inside Cart */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#f5f2ed]/50 uppercase tracking-wider font-mono">Artículos Seleccionados</span>
              
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8 text-[#f5f2ed]/40 bg-[#141414] border border-dashed border-[#2a2a2a] rounded-xl text-xs">
                  Añada platillos desde el menú izquierdo.
                </div>
              ) : (
                <div className="divide-y divide-[#2a2a2a]/60 max-h-56 overflow-y-auto bg-[#141414]/50 p-3 rounded-lg border border-[#2a2a2a] custom-scrollbar">
                  {Object.entries(cart).map(([platilloId, qty]) => {
                    const pl = platillos.find(p => p.id === platilloId)!;
                    const quantity = qty as number;
                    return (
                      <div key={platilloId} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="space-y-0.5 max-w-[180px]">
                          <p className="font-medium text-[#f5f2ed] truncate">{pl.nombre}</p>
                          <p className="text-[10px] text-[#f5f2ed]/45 font-mono">${pl.precio} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(platilloId, -1)}
                            className="w-6 h-6 rounded bg-[#202020] border border-[#2a2a2a] text-[#f5f2ed] flex items-center justify-center font-bold hover:bg-[#2c2c2c] transition duration-150 cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-[#f5f2ed] w-4 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(platilloId, 1)}
                            className="w-6 h-6 rounded bg-[#202020] border border-[#2a2a2a] text-[#f5f2ed] flex items-center justify-center font-bold hover:bg-[#2c2c2c] transition duration-150 cursor-pointer text-xs"
                          >
                            +
                          </button>
                          <span className="font-mono font-bold text-[#c1a35f] pl-2 w-16 text-right">
                            ${(pl.precio * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cooking Notes */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#f5f2ed]/50 uppercase tracking-wider font-mono">Instrucciones Especiales</label>
              <textarea
                id="textarea-comanda-notas"
                rows={2}
                placeholder="Ej. Sin picante, término medio, bebida con hielo..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs resize-none text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
              />
            </div>

            {/* Total display & submit button */}
            <div className="border-t border-[#2a2a2a] pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-[#f5f2ed]/60 font-mono">Total de la Cuenta:</span>
                <span className="text-xl font-serif italic font-bold text-[#c1a35f]">${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <button
                id="btn-submit-comanda"
                type="submit"
                disabled={Object.keys(cart).length === 0}
                className="w-full bg-[#c1a35f] hover:bg-[#b0914e] disabled:bg-[#141414] disabled:text-[#f5f2ed]/20 disabled:border-[#2a2a2a] disabled:cursor-not-allowed text-[#0c0c0c] font-bold py-3 rounded-lg shadow-lg transition duration-250 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-widest border border-[#c1a35f]/20"
              >
                <Layers size={15} />
                <span>Enviar a Cocina</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Orders list view */
        activeComandas.length === 0 ? (
          <div className="bg-[#0c0c0c] text-center py-20 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/45">
            <Ticket className="mx-auto text-[#c1a35f]/30 mb-3" size={40} />
            <h3 className="text-[#c1a35f] font-serif italic text-base">No hay comandas activas</h3>
            <p className="text-xs">Usa "Nueva Comanda" para asignarle una mesa u orden a un camarero de turno.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeComandas.map(c => {
              const cliente = getCliente(c.clienteId);
              const camarero = getWaiter(c.camareroId);
              const chef = getChef(c.chefId);

              return (
                <div key={c.id} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-5 flex flex-col justify-between space-y-4 hover:border-[#c1a35f]/30 transition duration-150">
                  
                  {/* Card head */}
                  <div className="flex items-start justify-between border-b border-[#2a2a2a] pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-[#f5f2ed]/40 font-mono tracking-wide">
                        <span>Código:</span> 
                        <span className="font-bold font-mono text-[#c1a35f] bg-[#0c0c0c] px-1.5 py-0.5 rounded border border-[#c1a35f]/15">{c.codigo}</span>
                      </div>
                      <h3 className="font-serif italic text-base text-[#f5f2ed] mt-1">{c.numeroMesa}</h3>
                    </div>

                    {/* Status marker */}
                    <span className={`inline-block text-[9px] font-mono font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                      c.estado === 'En Cola'
                        ? 'bg-[#1c1c1c] text-[#f5f2ed]/70 border-[#2a2a2a]'
                        : c.estado === 'Prep'
                        ? 'bg-[#c1a35f]/10 text-[#c1a35f] border-[#c1a35f]/20'
                        : 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                    }`}>
                      {c.estado === 'En Cola' ? 'En Cola' : c.estado === 'Prep' ? 'En Cocina' : 'Listo'}
                    </span>
                  </div>

                  {/* Customer, Waiter, and Chef summary details */}
                  <div className="text-xs space-y-1.5 text-[#f5f2ed]/80 bg-[#0c0c0c]/80 p-3 rounded-lg border border-[#2a2a2a]/50">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-[#c1a35f]/60" />
                      <span>VIP: <strong className="text-[#f5f2ed]">{cliente?.nombre || 'General'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={12} className="text-[#c1a35f]/60" />
                      <span>Mesero: <span className="text-[#f5f2ed]/90">{camarero?.nombre || 'Mesero N/A'}</span></span>
                    </div>
                    
                    {/* Cooking assignment */}
                    <div className="pt-2 mt-1.5 border-t border-[#2a2a2a]/40 flex flex-wrap items-center gap-1.5">
                      <ChefHat size={12} className="text-[#c1a35f]/75" />
                      <span className="mr-1 text-[11px] text-[#f5f2ed]/50">Chef:</span>
                      {c.chefId ? (
                        <span className="font-bold text-[#f5f2ed] bg-[#141414] px-2 py-0.5 rounded border border-[#2a2a2a] flex items-center gap-1 text-[10px] font-mono">
                          <Activity size={9} className="text-emerald-400" />
                          <span>{chef?.nombre.replace('Chef ', '')}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 flex-grow">
                          <select
                            id={`chef-selector-${c.id}`}
                            className="bg-[#141414] border border-red-900/40 text-[#c1a35f] focus:outline-none text-[10px] py-1 px-1.5 rounded-md font-mono"
                            defaultValue=""
                            onChange={(e) => onAssignChef(c.id, e.target.value)}
                          >
                            <option value="" disabled className="bg-[#141414] text-[#f5f2ed]/55">⚠️ Asignar Chef...</option>
                            {activeChefs.map(ch => (
                              <option key={ch.id} value={ch.id} className="bg-[#141414] text-[#f5f2ed]">🍳 {ch.nombre}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#f5f2ed]/40 uppercase font-bold tracking-wider font-mono">Detalle del Consumo</span>
                    <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-xs custom-scrollbar">
                      {c.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-[#f5f2ed]/90">
                          <span className="truncate max-w-[160px]">
                            <strong className="text-[#c1a35f] font-mono text-[10px] mr-1">x{i.cantidad}</strong> {i.nombre}
                          </span>
                          <span className="text-[#f5f2ed]/60 font-mono">${(i.precio * i.cantidad).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes if any */}
                  {c.notas && (
                    <div className="bg-[#c1a35f]/5 p-2.5 rounded border border-[#c1a35f]/20 text-[11px] text-[#c1a35f] flex gap-1 items-start font-serif italic">
                      <PenTool size={11} className="shrink-0 mt-0.5 text-[#c1a35f]/70" />
                      <span className="leading-snug">"{c.notas}"</span>
                    </div>
                  )}

                  {/* Total pricing */}
                  <div className="flex justify-between items-center border-t border-[#2a2a2a] pt-3">
                    <span className="text-xs font-semibold text-[#f5f2ed]/60">Mesa {c.numeroMesa.replace('Mesa ', '')} Total:</span>
                    <span className="text-base font-serif font-bold text-[#c1a35f]">${c.total.toFixed(2)}</span>
                  </div>

                  {/* Transition/Workflow Buttons */}
                  <div className="pt-2 border-t border-[#2a2a2a] flex items-center justify-between gap-2">
                    {/* Secondary button: cancel */}
                    {currentUserRole !== 'cocinero' && (
                      <button
                        id={`btn-cancelar-${c.id}`}
                        onClick={() => onCancelarComanda(c.id)}
                        className="text-xs hover:bg-neutral-800/40 text-[#f5f2ed]/35 hover:text-red-400 p-2 rounded-lg cursor-pointer transition"
                        title="Cancelar Comanda"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* Primary process transition Button */}
                    {c.estado === 'En Cola' ? (
                      <button
                        id={`btn-aceptar-${c.id}`}
                        disabled={!c.chefId}
                        onClick={() => onUpdateComandaEstado(c.id, 'Prep')}
                        className="flex-grow flex items-center justify-center gap-1 font-bold text-[11px] uppercase tracking-wider bg-[#c1a35f] disabled:bg-[#1c1c1c] disabled:text-[#f5f2ed]/20 disabled:border-[#2a2a2a] disabled:cursor-not-allowed hover:bg-[#b0914e] text-[#0c0c0c] py-2 px-3 rounded-md cursor-pointer transition border border-[#c1a35f]/20"
                      >
                        <span>Comenzar Prep</span>
                        <ArrowRight size={12} />
                      </button>
                    ) : c.estado === 'Prep' ? (
                      <button
                        id={`btn-listo-${c.id}`}
                        onClick={() => onUpdateComandaEstado(c.id, 'Listo')}
                        className="flex-grow flex items-center justify-center gap-1 font-bold text-[11px] uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-[#f5f2ed] py-2 px-3 rounded-md cursor-pointer transition border border-emerald-500/20"
                      >
                        <span>Marcar Listo</span>
                        <ArrowRight size={12} />
                      </button>
                    ) : (
                      currentUserRole !== 'cocinero' ? (
                        <button
                          id={`btn-cobrar-${c.id}`}
                          onClick={() => triggerPaymentPopup(c)}
                          className="flex-grow flex items-center justify-center gap-1 font-bold text-[11px] uppercase tracking-wider bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] py-2 px-3 rounded-md cursor-pointer transition border border-[#c1a35f]/20"
                        >
                          <DollarSign size={11} />
                          <span>Cobrar y Cerrar</span>
                        </button>
                      ) : (
                        <div className="flex-grow py-2 px-3 text-center bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-mono text-[10px] font-bold uppercase rounded-md tracking-wider">
                          ✓ Listo (Entregar a Mesero)
                        </div>
                      )
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )
      )}

      {/* Payment billing modal popup */}
      {payingComanda && (
        <div className="fixed inset-0 bg-[#030303]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition duration-300">
          <div id="payment-modal" className="bg-[#0c0c0c] w-full max-w-md rounded-xl p-6 shadow-2xl shadow-black/80 border border-[#2a2a2a] space-y-5 animate-scale-up text-[#f5f2ed]">
            <div className="flex justify-between items-start border-b border-[#2a2a2a] pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#f5f2ed]/40 font-mono">Facturando {payingComanda.codigo}</span>
                <h3 className="font-serif italic text-lg text-[#c1a35f]">Cerrar Mesa & Cobrar</h3>
              </div>
              <button 
                onClick={() => setPayingComanda(null)}
                className="text-[#f5f2ed]/40 hover:text-[#f5f2ed] p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 bg-[#141414] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="flex justify-between text-xs text-[#f5f2ed]/60">
                <span>Cliente VIP:</span>
                <span className="font-semibold text-[#f5f2ed]">{getCliente(payingComanda.clienteId)?.nombre || 'General'}</span>
              </div>
              <div className="flex justify-between text-xs text-[#f5f2ed]/60">
                <span>Mesa asignada:</span>
                <span className="font-semibold text-[#f5f2ed]">{payingComanda.numeroMesa}</span>
              </div>
              <div className="flex justify-between text-xs text-[#f5f2ed]/60">
                <span>Mesero:</span>
                <span className="font-semibold text-[#f5f2ed]">{getWaiter(payingComanda.camareroId)?.nombre}</span>
              </div>
              <div className="flex justify-between border-t border-[#2a2a2a]/60 pt-2.5 text-sm">
                <span className="font-bold text-[#f5f2ed]/70">Importe Total:</span>
                <span className="font-bold font-mono text-[#c1a35f]">${payingComanda.total.toFixed(2)} MXN</span>
              </div>
              <div className="bg-[#c1a35f]/10 p-2.5 rounded border border-[#c1a35f]/25 text-[11px] text-[#c1a35f] font-serif italic text-center">
                ⭐ ¡Acumulará {Math.floor(payingComanda.total / 10)} puntos Club VIP para este cliente!
              </div>
            </div>

            {/* Select Payments action buttons */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-[#f5f2ed]/50 uppercase tracking-wider font-mono">Método de Pago</span>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  id="btn-pay-cash"
                  onClick={() => submitPayment('Efectivo')}
                  className="flex items-center justify-between p-3 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#c1a35f]/60 hover:bg-[#1a1a1a] text-xs transition cursor-pointer text-[#f5f2ed]"
                >
                  <span className="flex items-center gap-2">
                    <Coins size={15} className="text-emerald-400" />
                    <span>Pago en Efectivo (Caja)</span>
                  </span>
                  <span className="font-mono text-[#c1a35f] font-bold">$ (Cash)</span>
                </button>
                <button
                  id="btn-pay-card"
                  onClick={() => submitPayment('Tarjeta')}
                  className="flex items-center justify-between p-3 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#c1a35f]/60 hover:bg-[#1a1a1a] text-xs transition cursor-pointer text-[#f5f2ed]"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard size={15} className="text-sky-400" />
                    <span>Tarjeta de Crédito / Débito</span>
                  </span>
                  <span className="font-mono text-[#c1a35f] font-bold">Terminal</span>
                </button>
                <button
                  id="btn-pay-transfer"
                  onClick={() => submitPayment('Transferencia')}
                  className="flex items-center justify-between p-3 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#c1a35f]/60 hover:bg-[#1a1a1a] text-xs transition cursor-pointer text-[#f5f2ed]"
                >
                  <span className="flex items-center gap-2">
                    <Activity size={15} className="text-[#f5f2ed]/50" />
                    <span>Transferencia Interbancaria (SPEI)</span>
                  </span>
                  <span className="font-mono text-[#c1a35f] font-bold">SPEI</span>
                </button>
              </div>
            </div>

            {/* Cancel Footer */}
            <div className="pt-1 text-center">
              <p className="text-[10px] text-[#f5f2ed]/40">Al cobrar, la comanda se cerrará y se liberará el chef asignado.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
