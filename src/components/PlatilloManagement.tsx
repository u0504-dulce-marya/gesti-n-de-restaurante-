/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Utensils, 
  Search, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  DollarSign, 
  Flame, 
  FileText,
  AlertCircle 
} from 'lucide-react';
import { Platillo } from '../types';

interface PlatilloManagementProps {
  platillos: Platillo[];
  onAddPlatillo: (newPl: Omit<Platillo, 'id' | 'disponible'>) => void;
  onToggleDisponibilidad: (id: string) => void;
  onDelPlatillo: (id: string) => void;
}

export default function PlatilloManagement({
  platillos,
  onAddPlatillo,
  onToggleDisponibilidad,
  onDelPlatillo,
}: PlatilloManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | 'Entradas' | 'Platos Fuertes' | 'Postres' | 'Bebidas'>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<'Entradas' | 'Platos Fuertes' | 'Postres' | 'Bebidas'>('Platos Fuertes');
  const [precio, setPrecio] = useState('');
  const [tiempoMin, setTiempoMin] = useState('');
  const [ingredientes, setIngredientes] = useState('');

  // Filtering Logic
  const filteredPlatillos = platillos.filter(p => {
    const matchesCategory = selectedCategory === 'Todas' || p.categoria === selectedCategory;
    const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.ingredientes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.trim() || !tiempoMin.trim()) return;

    onAddPlatillo({
      nombre,
      categoria,
      precio: parseFloat(precio),
      tiempoMin: parseInt(tiempoMin, 10),
      ingredientes: ingredientes || 'Receta general estándar del chef.'
    });

    // Reset Form
    setNombre('');
    setCategoria('Platos Fuertes');
    setPrecio('');
    setTiempoMin('');
    setIngredientes('');
    setShowAddForm(false);
  };
  return (
    <div className="space-y-6 animate-fade-in text-[#f5f2ed]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-[#c1a35f] tracking-tight">Menú de Alimentos y Bebidas</h1>
          <p className="text-[#f5f2ed]/55 text-xs md:text-sm">Gestiona los platillos del catálogo general, sus precios y disponibilidad.</p>
        </div>
        <button
          id="btn-add-platillo-trigger"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition duration-150 cursor-pointer border border-[#c1a35f]/20 shadow-lg shadow-[#c1a35f]/10"
        >
          <Plus size={14} />
          <span>Agregar Platillo</span>
        </button>
      </div>

      {/* Add Platillo Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#0c0c0c] p-6 rounded-xl border border-[#2a2a2a] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-in">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Nombre del Platillo / Bebida</label>
            <input
              id="form-pl-nombre"
              type="text"
              required
              placeholder="Ej. Salmón Glaseado al Maple"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Categoría</label>
            <select
              id="form-pl-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f]"
            >
              <option value="Entradas">Entradas</option>
              <option value="Platos Fuertes">Platos Fuertes</option>
              <option value="Postres">Postres</option>
              <option value="Bebidas">Bebidas</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Precio ($MXN)</label>
              <input
                id="form-pl-precio"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="240.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm font-mono font-bold text-[#c1a35f] focus:outline-none focus:border-[#c1a35f] placeholder-[#c1a35f]/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Cocción (minutos)</label>
              <input
                id="form-pl-tiempo"
                type="number"
                min="1"
                required
                placeholder="15"
                value={tiempoMin}
                onChange={(e) => setTiempoMin(e.target.value)}
                className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] placeholder-[#f5f2ed]/20"
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#f5f2ed]/50">Ingredientes y Descripción (Visible al cocer)</label>
            <textarea
              id="form-pl-ingredientes"
              rows={2}
              placeholder="Ej. Filete de salmón fresco 200g, esparragos tiernos, reducción de miel de arce y puré rústico de patata"
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-[#f5f2ed] focus:outline-none focus:border-[#c1a35f] resize-none placeholder-[#f5f2ed]/20"
            />
          </div>

          <div className="md:col-span-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[#2a2a2a] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#f5f2ed]/75 hover:bg-[#141414] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="form-pl-submit"
              type="submit"
              className="px-4 py-2 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer border border-[#c1a35f]/20"
            >
              Dar de Alta Platillo
            </button>
          </div>
        </form>
      )}

      {/* Categories Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border-b border-[#2a2a2a] pb-4">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
          {(['Todas', 'Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'] as const).map(cat => (
            <button
              key={cat}
              id={`tab-cat-${cat.replace(' ', '')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border shrink-0 cursor-pointer transition duration-150 ${
                selectedCategory === cat
                  ? 'bg-[#c1a35f] text-[#0c0c0c] border-[#c1a35f] shadow-md shadow-[#c1a35f]/5'
                  : 'bg-[#0c0c0c] text-[#f5f2ed]/60 border-[#2a2a2a] hover:bg-[#141414] hover:text-[#f5f2ed]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Searching input */}
        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c1a35f]/60">
            <Search size={14} />
          </span>
          <input
            id="input-search-platillos"
            type="text"
            placeholder="Buscar por platillo o ingredientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg text-xs focus:outline-none focus:border-[#c1a35f] transition text-[#f5f2ed] placeholder-[#f5f2ed]/20"
          />
        </div>
      </div>

      {/* Grid of Dishes */}
      {filteredPlatillos.length === 0 ? (
        <div className="bg-[#0c0c0c] text-center py-16 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/40">
          <Utensils className="mx-auto text-[#c1a35f]/40 mb-2" size={36} />
          <h3 className="text-[#c1a35f] font-serif italic text-base">No hay platillos en esta sección</h3>
          <p className="text-xs">Usa "Agregar Platillo" para dar de alta nuevas opciones gastronómicas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlatillos.map((p) => (
            <div 
              key={p.id} 
              className={`bg-[#141414] rounded-xl border p-5 flex flex-col justify-between transition duration-150 relative ${
                p.disponible ? 'border-[#2a2a2a] hover:border-[#c1a35f]/30' : 'border-[#2a2a2a]/45 bg-[#0c0c0c]/90 opacity-55'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold font-mono text-[#c1a35f] bg-[#0c0c0c] border border-[#c1a35f]/20 px-2 py-0.5 rounded uppercase tracking-wide">
                    {p.categoria}
                  </span>
                  <button
                    id={`btn-del-platillo-${p.id}`}
                    onClick={() => onDelPlatillo(p.id)}
                    className="p-1.5 text-[#f5f2ed]/30 hover:text-red-400 rounded-md hover:bg-neutral-800/40 transition cursor-pointer"
                    title="Eliminar del menú"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div>
                  <h3 className="font-serif italic text-[#f5f2ed] text-base leading-tight">{p.nombre}</h3>
                  <p className="text-[#f5f2ed]/60 text-xs mt-1.5 leading-snug line-clamp-3" title={p.ingredientes}>
                    {p.ingredientes}
                  </p>
                </div>
              </div>

              {/* Specs block */}
              <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-[#f5f2ed]/70">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#c1a35f]/50" />
                  <span>Prep: <strong className="text-[#f5f2ed]">{p.tiempoMin} min</strong></span>
                </div>
                <div className="flex items-center gap-0.5 text-[#c1a35f] font-mono font-bold text-sm">
                  <DollarSign size={13} className="text-[#c1a35f]/50" />
                  <span>{p.precio.toFixed(2)}</span>
                </div>
              </div>

              {/* Status and Action bar */}
              <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${p.disponible ? 'text-emerald-400' : 'text-[#f5f2ed]/40'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.disponible ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-500'}`}></span>
                  <span>{p.disponible ? 'Disponible' : 'Agotado'}</span>
                </span>
                
                <button
                  id={`btn-toggle-dispo-${p.id}`}
                  onClick={() => onToggleDisponibilidad(p.id)}
                  className="flex items-center gap-1 text-xs text-[#f5f2ed]/60 hover:text-[#c1a35f] cursor-pointer transition duration-150"
                >
                  {p.disponible ? (
                    <>
                      <span>Marcar Agotado</span>
                      <ToggleRight size={18} className="text-[#c1a35f]" />
                    </>
                  ) : (
                    <>
                      <span>Habilitar</span>
                      <ToggleLeft size={18} className="text-[#f5f2ed]/30" />
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Quick notice */}
      <div className="bg-amber-950/20 p-4 rounded-xl border border-[#c1a35f]/15 flex gap-2.5 text-xs text-[#f5f2ed]/80">
        <AlertCircle size={16} className="text-[#c1a35f] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#c1a35f]">Consejo de Operaciones:</strong> Si un ingrediente clave (como el salmón o camarón) se agota en la despensa, marque el platillo como <strong className="text-[#c1a35f]">Agotado</strong>. Esto impedirá de forma automática que los camareros lo seleccionen en la pantalla de Nueva Comanda, evitando malentendidos con los clientes VIP.
        </p>
      </div>
    </div>
  );
}
