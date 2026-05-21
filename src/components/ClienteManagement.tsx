/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Award, 
  Phone, 
  Mail, 
  Compass, 
  PlusCircle, 
  MinusCircle,
  HelpCircle
} from 'lucide-react';
import { Cliente } from '../types';

interface ClienteManagementProps {
  clientes: Cliente[];
  onAddCliente: (newC: Omit<Cliente, 'id' | 'puntos' | 'activo'>) => void;
  onUpdatePuntos: (id: string, puntosCambio: number) => void;
  onDelCliente: (id: string) => void;
}

export default function ClienteManagement({
  clientes,
  onAddCliente,
  onUpdatePuntos,
  onDelCliente,
}: ClienteManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Client States
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [mesaFav, setMesaFav] = useState('Mesa 4');
  
  // Points adjuster states
  const [adjustingClient, setAdjustingClient] = useState<string | null>(null);
  const [pointsAmount, setPointsAmount] = useState('50');

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.telefono.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onAddCliente({
      nombre,
      telefono: telefono || 'Sin Teléfono',
      email: email || 'Sin correo',
      mesaFav
    });
    setNombre('');
    setTelefono('');
    setEmail('');
    setMesaFav('Mesa 4');
    setShowAddForm(false);
  };

  const handleAdjustPoints = (clientId: string, factor: 1 | -1) => {
    const amt = parseInt(pointsAmount, 10);
    if (!isNaN(amt) && amt > 0) {
      onUpdatePuntos(clientId, amt * factor);
      setAdjustingClient(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#f5f2ed]">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-[#c1a35f] tracking-tight">Directorio de Clientes VIP</h1>
          <p className="text-[#f5f2ed]/50 text-xs md:text-sm">Gestiona la base de clientes distinguidos del restaurante y sus puntos de lealtad.</p>
        </div>
        <button
          id="btn-add-cliente-trigger"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition duration-200 cursor-pointer border border-[#c1a35f]/20 shadow-lg shadow-[#c1a35f]/5"
        >
          <Plus size={14} />
          <span>Registrar Cliente VIP</span>
        </button>
      </div>
 
      {/* Add Client Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#0c0c0c] p-6 rounded-xl border border-[#2a2a2a] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-in">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Nombre Completo</label>
            <input
              id="form-cl-nombre"
              type="text"
              required
              placeholder="Ej. Sofía Valenzuela"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Teléfono móvil</label>
            <input
              id="form-cl-tel"
              type="text"
              placeholder="555-1234"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Mesa Preferida</label>
            <select
              id="form-cl-mesa"
              value={mesaFav}
              onChange={(e) => setMesaFav(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
            >
              <option value="Mesa 2 (Terraza)">Mesa 2 (Terraza)</option>
              <option value="Mesa 4 (Terraza)">Mesa 4 (Terraza)</option>
              <option value="Mesa 8 (Interior)">Mesa 8 (Interior)</option>
              <option value="Mesa 12 (Ventana)">Mesa 12 (Ventana)</option>
              <option value="Barra 1">Barra 1</option>
              <option value="Barra 2">Barra 2</option>
            </select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Correo electrónico</label>
            <input
              id="form-cl-email"
              type="email"
              placeholder="sofia@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="md:col-span-4 flex justify-end gap-3 pt-2">
            <button
               type="button"
               onClick={() => setShowAddForm(false)}
               className="px-4 py-2 border border-[#2a2a2a] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#f5f2ed]/70 hover:bg-[#141414] cursor-pointer"
             >
               Cancelar
             </button>
             <button
               id="form-cl-submit"
               type="submit"
               className="px-4 py-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer border border-[#c1a35f]/20"
             >
               Registrar Cliente
             </button>
          </div>
        </form>
      )}
 
      {/* Search Filter bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#c1a35f]/60">
          <Search size={16} />
        </span>
        <input
          id="input-search-clientes"
          type="text"
          placeholder="Buscar clientes distinguidos por nombre, correo o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl text-sm focus:outline-none focus:border-[#c1a35f] transition text-[#f5f2ed] placeholder-[#f5f2ed]/30"
        />
      </div>
 
      {/* Grid of Clients */}
      {filteredClientes.length === 0 ? (
        <div className="bg-[#0c0c0c] text-center py-16 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/40">
          <Users className="mx-auto text-[#c1a35f]/30 mb-3" size={36} />
          <h3 className="text-[#c1a35f] font-serif italic text-base">No se encontraron clientes</h3>
          <p className="text-xs">Intenta con otros criterios de búsqueda o registra un nuevo cliente VIP.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.map((c) => (
            <div key={c.id} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-5 space-y-4 flex flex-col justify-between hover:border-[#c1a35f]/30 transition duration-150">
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="font-serif italic text-base text-[#f5f2ed] leading-tight">{c.nombre}</h3>
                    <span className="text-[10px] text-[#f5f2ed]/40 font-mono tracking-wider">ID: {c.id.toUpperCase()}</span>
                  </div>
                  <button
                    id={`btn-del-cliente-${c.id}`}
                    onClick={() => onDelCliente(c.id)}
                    className="p-1.5 text-[#f5f2ed]/30 hover:text-red-400 rounded-md hover:bg-red-500/10 transition cursor-pointer"
                    title="Eliminar cliente"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
 
                {/* Info Lines */}
                <div className="space-y-2 text-xs text-[#f5f2ed]/80 bg-[#0c0c0c]/70 rounded-lg p-3.5 border border-[#2a2a2a]/40">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[#c1a35f]/50" />
                    <span>Llamar: <span className="font-mono text-[#f5f2ed]">{c.telefono}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-[#c1a35f]/50" />
                    <span className="truncate">Email: <span className="text-[#f5f2ed]/90">{c.email}</span></span>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#2a2a2a]/60 pt-2 mt-1.5">
                    <Compass size={12} className="text-[#c1a35f]/50" />
                    <span>Mesa Preferida: <span className="font-bold text-[#c1a35f]">{c.mesaFav}</span></span>
                  </div>
                </div>
              </div>
 
              {/* Loyalty Score Panel */}
              <div className="border-t border-[#2a2a2a] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award size={15} className="text-[#c1a35f]" />
                    <span className="text-xs text-[#f5f2ed]/60">Club Premium:</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#c1a35f]">{c.puntos} pts</span>
                </div>
 
                {/* Adjust Points Trigger */}
                {adjustingClient === c.id ? (
                  <div className="bg-[#0c0c0c] border border-[#c1a35f]/20 p-2.5 rounded-lg flex items-center justify-between gap-1.5 animate-slide-in">
                    <div className="flex items-center gap-1 max-w-[100px]">
                      <input
                        id={`input-pts-amt-${c.id}`}
                        type="number"
                        className="w-full text-center py-1 bg-[#141414] border border-[#2a2a2a] rounded text-xs font-bold text-[#f5f2ed] focus:border-[#c1a35f]"
                        value={pointsAmount}
                        onChange={(e) => setPointsAmount(e.target.value)}
                        min="1"
                      />
                      <span className="text-[10px] text-[#f5f2ed]/45 font-mono">pts</span>
                    </div>
 
                    <div className="flex items-center gap-1">
                      <button
                        id={`btn-pts-sub-${c.id}`}
                        onClick={() => handleAdjustPoints(c.id, -1)}
                        className="p-1 px-2 bg-[#141414] hover:bg-[#202020] text-[#f5f2ed]/80 border border-[#2a2a2a] rounded text-[10px] font-bold cursor-pointer"
                        title="Restar puntos"
                      >
                        Restar
                      </button>
                      <button
                        id={`btn-pts-add-${c.id}`}
                        onClick={() => handleAdjustPoints(c.id, 1)}
                        className="p-1 px-2.5 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] rounded text-[10px] font-bold cursor-pointer"
                        title="Sumar puntos"
                      >
                        Sumar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      id={`btn-pts-adjust-trigger-${c.id}`}
                      onClick={() => { setAdjustingClient(c.id); setPointsAmount('50'); }}
                      className="text-xs font-semibold text-[#c1a35f] bg-[#1c1c1c] hover:bg-[#202020]/80 pr-2.5 pl-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition border border-[#c1a35f]/20"
                    >
                      <PlusCircle size={13} className="text-[#c1a35f]" />
                      <span>Ajustar Puntos</span>
                    </button>
                  </div>
                )}
              </div>
 
            </div>
          ))}
        </div>
      )}
 
      {/* Club guidelines */}
      <div className="bg-[#0c0c0c] px-5 py-4 rounded-xl border border-[#2a2a2a] flex gap-3 text-xs text-[#f5f2ed]/50 items-start">
        <HelpCircle size={16} className="text-[#c1a35f]/50 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#f5f2ed]/80">¿Cómo funcionan los puntos Club Premium?</p>
          <p>Al procesar la cobranza de cualquier comanda se acumula automáticamente el <strong>10% del total de la cuenta</strong> en puntos para el cliente. Los puntos se pueden usar como crédito de cortesía en el restaurante a discreción del cajero (canjes de cortesía).</p>
        </div>
      </div>
    </div>
  );
}
