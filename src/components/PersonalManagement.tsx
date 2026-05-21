/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  ChefHat, 
  Plus, 
  Phone, 
  Trash2, 
  Search, 
  Clock, 
  UserCheck, 
  Activity, 
  ShieldAlert 
} from 'lucide-react';
import { Personal, Chef, Usuario } from '../types';

interface PersonalManagementProps {
  personal: Personal[];
  chefs: Chef[];
  usuarios: Usuario[];
  onAddPersonal: (newP: Omit<Personal, 'id' | 'activo'>) => void;
  onTogglePersonalActivo: (id: string) => void;
  onDelPersonal: (id: string) => void;
  onAddChef: (newC: Omit<Chef, 'id' | 'ordenesAsignadas'>) => void;
  onChangeChefEstado: (id: string, nuevoEstado: 'En Cocina' | 'Libre' | 'Descanso') => void;
  onDelChef: (id: string) => void;
  onAddUsuario: (newU: Omit<Usuario, 'id'>) => void;
  onDelUsuario: (id: string) => void;
}

export default function PersonalManagement({
  personal,
  chefs,
  usuarios,
  onAddPersonal,
  onTogglePersonalActivo,
  onDelPersonal,
  onAddChef,
  onChangeChefEstado,
  onDelChef,
  onAddUsuario,
  onDelUsuario,
}: PersonalManagementProps) {
  const [subTab, setSubTab] = useState<'servicio' | 'cocina' | 'cuentas'>('servicio');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states - Service Personal
  const [showPForm, setShowPForm] = useState(false);
  const [pNombre, setPNombre] = useState('');
  const [pRol, setPRol] = useState('Camarero');
  const [pTurno, setPTurno] = useState<'Mañana' | 'Tarde' | 'Noche'>('Mañana');
  const [pTelefono, setPTelefono] = useState('');

  // Form states - Waiter Users Accounts
  const [showUForm, setShowUForm] = useState(false);
  const [uNombre, setUNombre] = useState('');
  const [uUsuario, setUUsuario] = useState('');
  const [uClave, setUClave] = useState('');
  const [uRol, setURol] = useState<'administrador' | 'mesero' | 'cocinero'>('mesero');

  // Form states - Chefs
  const [showCForm, setShowCForm] = useState(false);
  const [cNombre, setCNombre] = useState('');
  const [cEspecialidad, setCEspecialidad] = useState('');
  const [cEstado, setCEstado] = useState<'En Cocina' | 'Libre' | 'Descanso'>('Libre');

  // Filter lists based on search
  const filteredPersonal = personal.filter(p => 
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChefs = chefs.filter(c => 
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.especialidad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit handlers
  const handleAddP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNombre.trim()) return;
    onAddPersonal({
      nombre: pNombre,
      rol: pRol,
      turno: pTurno,
      telefono: pTelefono || 'N/A'
    });
    // Reset form
    setPNombre('');
    setPRol('Camarero');
    setPTurno('Mañana');
    setPTelefono('');
    setShowPForm(false);
  };

  const handleAddC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cNombre.trim() || !cEspecialidad.trim()) return;
    onAddChef({
      nombre: cNombre,
      especialidad: cEspecialidad,
      estado: cEstado
    });
    // Reset form
    setCNombre('');
    setCEspecialidad('');
    setCEstado('Libre');
    setShowCForm(false);
  };

  const handleAddU = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uNombre.trim() || !uUsuario.trim() || !uClave.trim()) return;
    onAddUsuario({
      nombre: uNombre.trim(),
      usuario: uUsuario.trim().toLowerCase(),
      clave: uClave.trim(),
      rol: uRol
    });
    setUNombre('');
    setUUsuario('');
    setUClave('');
    setURol('mesero');
    setShowUForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#f5f2ed]">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-[#c1a35f] tracking-tight">Recursos Humanos</h1>
          <p className="text-[#f5f2ed]/50 text-xs md:text-sm">Organiza los camareros, cajeros y chefs en servicio del restaurante.</p>
        </div>
        
        {/* SubTab Toggle buttons */}
        <div className="inline-flex bg-[#0c0c0c] border border-[#2a2a2a] p-1 rounded-lg w-fit">
          <button
            id="subtab-servicio"
            onClick={() => { setSubTab('servicio'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition duration-150 ${
              subTab === 'servicio' 
                ? 'bg-[#c1a35f] text-[#0c0c0c] shadow-xs' 
                : 'text-[#f5f2ed]/50 hover:text-[#f5f2ed]'
            }`}
          >
            <Users size={14} />
            <span>Servicio y Caja ({personal.length})</span>
          </button>
          <button
            id="subtab-cocina"
            onClick={() => { setSubTab('cocina'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition duration-150 ${
              subTab === 'cocina' 
                ? 'bg-[#c1a35f] text-[#0c0c0c] shadow-xs' 
                : 'text-[#f5f2ed]/50 hover:text-[#f5f2ed]'
            }`}
          >
            <ChefHat size={14} />
            <span>Equipo de Cocina ({chefs.length})</span>
          </button>
          <button
            id="subtab-cuentas"
            onClick={() => { setSubTab('cuentas'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition duration-150 ${
              subTab === 'cuentas' 
                ? 'bg-[#c1a35f] text-[#0c0c0c] shadow-xs' 
                : 'text-[#f5f2ed]/50 hover:text-[#f5f2ed]'
            }`}
          >
            <UserCheck size={14} />
            <span>Cuentas de Acceso ({usuarios.length})</span>
          </button>
        </div>
      </div>

      {/* Control Tools Frame */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c1a35f]/60">
            <Search size={16} />
          </span>
          <input
            id="input-search-personal"
            type="text"
            placeholder={
              subTab === 'servicio' 
                ? 'Buscar personal por nombre o rol...' 
                : subTab === 'cocina' 
                ? 'Buscar chef por nombre o especialidad...' 
                : 'Buscar cuentas por nombre o usuario...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl text-sm focus:outline-none focus:border-[#c1a35f] transition text-[#f5f2ed] placeholder-[#f5f2ed]/25"
          />
        </div>

        {subTab === 'servicio' && (
          <button
            id="btn-add-personal-trigger"
            onClick={() => setShowPForm(!showPForm)}
            className="flex items-center justify-center gap-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition duration-150 cursor-pointer border border-[#c1a35f]/20 shadow-lg shadow-[#c1a35f]/5"
          >
            <Plus size={14} />
            <span>Agregar Personal</span>
          </button>
        )}
        {subTab === 'cocina' && (
          <button
            id="btn-add-chef-trigger"
            onClick={() => setShowCForm(!showCForm)}
            className="flex items-center justify-center gap-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition duration-150 cursor-pointer border border-[#c1a35f]/20 shadow-lg shadow-[#c1a35f]/5"
          >
            <Plus size={14} />
            <span>Agregar Chef</span>
          </button>
        )}
        {subTab === 'cuentas' && (
          <button
            id="btn-add-user-trigger"
            onClick={() => setShowUForm(!showUForm)}
            className="flex items-center justify-center gap-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition duration-150 cursor-pointer border border-[#c1a35f]/20 shadow-lg shadow-[#c1a35f]/5"
          >
            <Plus size={14} />
            <span>Crear Acceso de Mesero</span>
          </button>
        )}
      </div>

      {/* Forms Drawer/Collapsible */}
      {showPForm && subTab === 'servicio' && (
        <form onSubmit={handleAddP} className="bg-[#0c0c0c] p-6 rounded-xl border border-[#2a2a2a] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-in">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Nombre Completo</label>
            <input
              id="form-p-nombre"
              type="text"
              required
              placeholder="Ej. Roberto Martínez"
              value={pNombre}
              onChange={(e) => setPNombre(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Rol operativo</label>
            <select
              id="form-p-rol"
              value={pRol}
              onChange={(e) => setPRol(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
            >
              <option value="Camarero">Camarero</option>
              <option value="Cajero">Cajero</option>
              <option value="Hostess">Hostess</option>
              <option value="Gerente">Gerente</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Turno</label>
              <select
                id="form-p-turno"
                value={pTurno}
                onChange={(e) => setPTurno(e.target.value as any)}
                className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Teléfono</label>
              <input
                id="form-p-tel"
                type="text"
                placeholder="555-0909"
                value={pTelefono}
                onChange={(e) => setPTelefono(e.target.value)}
                className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
              />
            </div>
          </div>
          <div className="md:col-span-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPForm(false)}
              className="px-4 py-2 border border-[#2a2a2a] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#f5f2ed]/75 hover:bg-[#141414] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="form-p-submit"
              type="submit"
              className="px-4 py-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer border border-[#c1a35f]/20"
            >
              Registrar Empleado
            </button>
          </div>
        </form>
      )}

      {showCForm && subTab === 'cocina' && (
        <form onSubmit={handleAddC} className="bg-[#0c0c0c] p-6 rounded-xl border border-[#2a2a2a] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Nombre del Chef</label>
            <input
              id="form-c-nombre"
              type="text"
              required
              placeholder="Ej. Chef Sergio Valenzuela"
              value={cNombre}
              onChange={(e) => setCNombre(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Especialidad Gastronómica</label>
            <input
              id="form-c-especialidad"
              type="text"
              required
              placeholder="Ej. Mariscos y Ceviches"
              value={cEspecialidad}
              onChange={(e) => setCEspecialidad(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5 col-span-1 md:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Estado Inicial</label>
            <div className="flex gap-4">
              {['Libre', 'Descanso', 'En Cocina'].map((est) => (
                <label key={est} className="flex items-center gap-2 text-xs text-[#f5f2ed]/80 cursor-pointer">
                  <input
                    type="radio"
                    name="chef-estado-form"
                    value={est}
                    checked={cEstado === est}
                    onChange={() => setCEstado(est as any)}
                    className="accent-[#c1a35f]"
                  />
                  <span>{est}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCForm(false)}
              className="px-4 py-2 border border-[#2a2a2a] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#f5f2ed]/75 hover:bg-[#141414] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="form-c-submit"
              type="submit"
              className="px-4 py-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer border border-[#c1a35f]/20"
            >
              Registrar Chef
            </button>
          </div>
        </form>
      )}

      {showUForm && subTab === 'cuentas' && (
        <form onSubmit={handleAddU} className="bg-[#0c0c0c] p-6 rounded-xl border border-[#2a2a2a] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-in">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Nombre Completo</label>
            <input
              id="form-u-nombre"
              type="text"
              required
              placeholder="Ej. Carlos Mendoza (Mesero)"
              value={uNombre}
              onChange={(e) => setUNombre(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Usuario de Acceso</label>
            <input
              id="form-u-usuario"
              type="text"
              required
              placeholder="Ej. carlos99"
              value={uUsuario}
              onChange={(e) => setUUsuario(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Contraseña / PIN</label>
            <input
              id="form-u-clave"
              type="text"
              required
              placeholder="Ej. 1234"
              value={uClave}
              onChange={(e) => setUClave(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>
          <div className="space-y-1.5 md:col-span-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Rol de Sistema</label>
            <div className="flex gap-4 mt-1.5 flex-wrap">
              {[
                { val: 'mesero', label: 'Mesero (Pedidos + Cobros únicamente)' },
                { val: 'cocinero', label: 'Cocinero (Tomar y preparar pedidos)' },
                { val: 'administrador', label: 'Administrador (Acceso total)' }
              ].map((role) => (
                <label key={role.val} className="flex items-center gap-2 text-xs text-[#f5f2ed]/80 cursor-pointer">
                  <input
                    type="radio"
                    name="u-rol-form"
                    value={role.val}
                    checked={uRol === role.val}
                    onChange={() => setURol(role.val as any)}
                    className="accent-[#c1a35f]"
                  />
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowUForm(false)}
              className="px-4 py-2 border border-[#2a2a2a] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#f5f2ed]/75 hover:bg-[#141414] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="form-u-submit"
              type="submit"
              className="px-4 py-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer border border-[#c1a35f]/20"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
      )}

      {/* Lists Rendering */}
      {subTab === 'servicio' ? (
        filteredPersonal.length === 0 ? (
          <div className="bg-[#0c0c0c] text-center py-16 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/40 space-y-2">
            <ShieldAlert className="mx-auto text-[#c1a35f]/40" size={36} />
            <h3 className="text-[#c1a35f] font-serif italic text-base">No se encontró personal</h3>
            <p className="text-xs">Usa "Agregar Personal" para registrar a tu primer integrante en servicio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonal.map((p) => (
              <div 
                key={p.id} 
                className={`bg-[#141414] rounded-xl border p-5 transition duration-200 relative ${
                  p.activo ? 'border-[#2a2a2a] hover:border-[#c1a35f]/30' : 'border-[#2a2a2a]/45 bg-[#0c0c0c]/90 opacity-55'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono text-[#c1a35f] bg-[#0c0c0c] border border-[#c1a35f]/20 px-2 py-0.5 rounded uppercase tracking-wide">
                      {p.rol}
                    </span>
                    <h3 className="font-serif italic text-[#f5f2ed] text-base pt-1">{p.nombre}</h3>
                  </div>
                  <button
                    id={`btn-del-personal-${p.id}`}
                    onClick={() => onDelPersonal(p.id)}
                    className="p-1.5 text-[#f5f2ed]/30 hover:text-red-400 rounded-md hover:bg-neutral-800/40 transition cursor-pointer"
                    title="Eliminar empleado"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2a2a2a] space-y-2 text-xs text-[#f5f2ed]/80 bg-[#0c0c0c]/45 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#c1a35f]/50" />
                    <span>Turno: <strong className="text-[#f5f2ed]">{p.turno}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#c1a35f]/50" />
                    <span>Tel: <a href={`tel:${p.telefono}`} className="hover:underline font-mono text-[#f5f2ed]/90">{p.telefono}</a></span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                  <span className="text-xs text-[#f5f2ed]/55 flex items-center gap-1.5 font-medium">
                    <Activity size={13} className={p.activo ? 'text-emerald-400' : 'text-[#f5f2ed]/30'} />
                    <span>{p.activo ? 'Activo en Piso' : 'Inactivo'}</span>
                  </span>
                  <button
                    id={`btn-toggle-personal-${p.id}`}
                    onClick={() => onTogglePersonalActivo(p.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition border cursor-pointer ${
                      p.activo 
                        ? 'border-[#2a2a2a] text-[#f5f2ed]/70 hover:bg-[#1a1a1a]' 
                        : 'border-[#c1a35f]/30 text-[#c1a35f] bg-[#c1a35f]/5 hover:bg-[#c1a35f]/15'
                    }`}
                  >
                    {p.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : subTab === 'cocina' ? (
        // Chefs view
        filteredChefs.length === 0 ? (
          <div className="bg-[#0c0c0c] text-center py-16 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/40 space-y-2">
            <ShieldAlert className="mx-auto text-[#c1a35f]/40" size={36} />
            <h3 className="text-[#c1a35f] font-serif italic text-base">No se encontraron chefs</h3>
            <p className="text-xs">Usa "Agregar Chef" para registrar a tu primer profesional de cocina.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChefs.map((c) => (
              <div key={c.id} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-5 space-y-4 hover:border-[#c1a35f]/30 transition duration-150 relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#f5f2ed]/45">
                      <ChefHat size={12} className="text-[#c1a35f]/70" />
                      <span>Especialista</span>
                    </div>
                    <h3 className="font-serif italic text-[#f5f2ed] text-base">{c.nombre}</h3>
                  </div>
                  <button
                    id={`btn-del-chef-${c.id}`}
                    onClick={() => onDelChef(c.id)}
                    className="p-1.5 text-[#f5f2ed]/30 hover:text-red-400 rounded-md hover:bg-neutral-800/40 transition cursor-pointer"
                    title="Eliminar Chef"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="bg-[#0c0c0c] rounded-lg p-3 text-xs border border-[#2a2a2a]/60">
                  <span className="text-[#f5f2ed]/45 block uppercase text-[8px] tracking-wider font-mono">Línea de competencia</span>
                  <span className="font-serif font-bold text-[#c1a35f] text-sm mt-0.5 block">{c.especialidad}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#f5f2ed]/60">Carga de trabajo:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] border ${
                    c.ordenesAsignadas > 0 
                      ? 'bg-amber-950/20 text-[#c1a35f] border-[#c1a35f]/20' 
                      : 'bg-[#0c0c0c] text-[#f5f2ed]/50 border-[#2a2a2a]'
                  }`}>
                    {c.ordenesAsignadas} {c.ordenesAsignadas === 1 ? 'orden activa' : 'órdenes activas'}
                  </span>
                </div>

                <div className="border-t border-[#2a2a2a] pt-4 flex flex-col gap-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#f5f2ed]/45">Estado de Cocina</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Libre', 'En Cocina', 'Descanso'] as const).map((est) => (
                      <button
                        key={est}
                        id={`btn-chef-${c.id}-est-${est.replace(' ', '')}`}
                        onClick={() => onChangeChefEstado(c.id, est)}
                        className={`text-[11px] font-bold py-1.5 rounded-lg text-center transition cursor-pointer border ${
                          c.estado === est
                            ? est === 'En Cocina' 
                              ? 'bg-[#c1a35f]/15 text-[#c1a35f] border-[#c1a35f]/50 shadow-sm shadow-[#c1a35f]/5' 
                              : est === 'Libre'
                              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50 shadow-sm shadow-emerald-500/5'
                              : 'bg-neutral-800 text-[#f5f2ed] border-neutral-700'
                            : 'bg-[#0c0c0c] hover:bg-[#1c1c1c] text-[#f5f2ed]/55 border-[#2a2a2a]'
                        }`}
                      >
                        {est}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // User (Usuario/Mesero) Accounts View
        usuarios.filter(u => u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || u.usuario.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
          <div className="bg-[#0c0c0c] text-center py-16 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/40 space-y-2">
            <ShieldAlert className="mx-auto text-[#c1a35f]/40" size={36} />
            <h3 className="text-[#c1a35f] font-serif italic text-base">No se encontraron cuentas</h3>
            <p className="text-xs">Crea una nueva cuenta de acceso usando "Crear Acceso de Mesero".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuarios.filter(u => u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || u.usuario.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
              <div key={u.id} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-5 space-y-4 hover:border-[#c1a35f]/30 transition duration-150 relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#f5f2ed]/45">
                      <UserCheck size={12} className="text-[#c1a35f]/70" />
                      <span className="uppercase tracking-wider text-[#c1a35f] font-mono font-bold">{u.rol}</span>
                    </div>
                    <h3 className="font-serif italic text-[#f5f2ed] text-base">{u.nombre}</h3>
                  </div>
                  {u.usuario !== 'admin' && (
                    <button
                      id={`btn-del-user-${u.id}`}
                      onClick={() => onDelUsuario(u.id)}
                      className="p-1.5 text-[#f5f2ed]/30 hover:text-red-400 rounded-md hover:bg-neutral-800/40 transition cursor-pointer"
                      title="Eliminar Cuenta"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="bg-[#0c0c0c] rounded-lg p-3 text-xs border border-[#2a2a2a]/60 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#f5f2ed]/45 font-mono">Usuario login:</span>
                    <strong className="text-[#f5f2ed]/90 font-mono">{u.usuario}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#f5f2ed]/45 font-mono">Contraseña / PIN:</span>
                    <strong className="text-[#c1a35f] font-mono" style={{ WebkitTextSecurity: 'disc' }}>{u.clave}</strong>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-[#f5f2ed]/40 italic">
                  {u.rol === 'mesero' 
                    ? '✓ Acceso restringido a Pedidos (Comandas) y Cobros únicamente.' 
                    : u.rol === 'cocinero'
                    ? '🍳 Acceso restringido a cocina (Tomar y preparar comandas únicamente).'
                    : '★ Acceso administrativo ilimitado.'}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
