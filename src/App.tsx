/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  UtensilsCrossed, 
  UsersRound, 
  ChefHat, 
  LineChart, 
  Store,
  LogIn,
  LogOut,
  Lock,
  Shield
} from 'lucide-react';

import { Personal, Chef, Cliente, Platillo, Comanda, Venta, Usuario } from './types';
import { 
  INITIAL_PERSONAL, 
  INITIAL_CHEFS, 
  INITIAL_CLIENTES, 
  INITIAL_PLATILLOS, 
  INITIAL_COMANDAS, 
  INITIAL_VENTAS 
} from './data/mockData';

import Dashboard from './components/Dashboard';
import PersonalManagement from './components/PersonalManagement';
import ClienteManagement from './components/ClienteManagement';
import PlatilloManagement from './components/PlatilloManagement';
import ComandaManagement from './components/ComandaManagement';
import VentaManagement from './components/VentaManagement';
import Login from './components/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core state engines
  const [personal, setPersonal] = useState<Personal[]>(() => {
    const saved = localStorage.getItem('rest_personal');
    return saved ? JSON.parse(saved) : INITIAL_PERSONAL;
  });

  const [chefs, setChefs] = useState<Chef[]>(() => {
    const saved = localStorage.getItem('rest_chefs');
    return saved ? JSON.parse(saved) : INITIAL_CHEFS;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('rest_clientes');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
  });

  const [platillos, setPlatillos] = useState<Platillo[]>(() => {
    const saved = localStorage.getItem('rest_platillos');
    return saved ? JSON.parse(saved) : INITIAL_PLATILLOS;
  });

  const [comandas, setComandas] = useState<Comanda[]>(() => {
    const saved = localStorage.getItem('rest_comandas');
    return saved ? JSON.parse(saved) : INITIAL_COMANDAS;
  });

  const [ventas, setVentas] = useState<Venta[]>(() => {
    const saved = localStorage.getItem('rest_ventas');
    return saved ? JSON.parse(saved) : INITIAL_VENTAS;
  });

  // Core user accounts state engine
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('rest_usuarios');
    const defaultUsers: Usuario[] = [
      { id: 'u-admin', nombre: 'Administrador Manuel', usuario: 'admin', clave: 'admin', rol: 'administrador' },
      { id: 'u-mesero1', nombre: 'Carlos Mendoza (Mesero)', usuario: 'carlos', clave: '1234', rol: 'mesero' },
      { id: 'u-cocinero1', nombre: 'Juana Gómez (Cocina)', usuario: 'juana', clave: '5678', rol: 'cocinero' }
    ];
    if (saved) {
      try {
        const loaded: Usuario[] = JSON.parse(saved);
        // Ensure default users exist in the loaded list
        defaultUsers.forEach(defUser => {
          if (!loaded.some(u => u.usuario.toLowerCase() === defUser.usuario.toLowerCase())) {
            loaded.push(defUser);
          }
        });
        return loaded;
      } catch (e) {
        return defaultUsers;
      }
    }
    return defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('rest_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // State to toggle Nueva Comanda focus inside Comanda tab
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  // Auto-syncing persistence effect
  useEffect(() => {
    localStorage.setItem('rest_personal', JSON.stringify(personal));
  }, [personal]);

  useEffect(() => {
    localStorage.setItem('rest_chefs', JSON.stringify(chefs));
  }, [chefs]);

  useEffect(() => {
    localStorage.setItem('rest_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('rest_platillos', JSON.stringify(platillos));
  }, [platillos]);

  useEffect(() => {
    localStorage.setItem('rest_comandas', JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem('rest_ventas', JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    localStorage.setItem('rest_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rest_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rest_current_user');
    }
  }, [currentUser]);

  // Force mesero / cocinero to always stay in the comandas tab
  useEffect(() => {
    if (currentUser?.rol === 'mesero' || currentUser?.rol === 'cocinero') {
      setActiveTab('comandas');
    }
  }, [currentUser]);

  // -- HANDLERS: Personal --
  const handleAddPersonal = (newP: Omit<Personal, 'id' | 'activo'>) => {
    const id = `p-${Date.now()}`;
    const item: Personal = { ...newP, id, activo: true };
    setPersonal(prev => [...prev, item]);
  };

  const handleTogglePersonalActivo = (id: string) => {
    setPersonal(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  };

  const handleDelPersonal = (id: string) => {
    setPersonal(prev => prev.filter(p => p.id !== id));
  };

  // -- HANDLERS: Chefs --
  const handleAddChef = (newC: Omit<Chef, 'id' | 'ordenesAsignadas'>) => {
    const id = `ch-${Date.now()}`;
    const item: Chef = { ...newC, id, ordenesAsignadas: 0 };
    setChefs(prev => [...prev, item]);
  };

  const handleChangeChefEstado = (id: string, nuevoEstado: Chef['estado']) => {
    setChefs(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
  };

  const handleDelChef = (id: string) => {
    setChefs(prev => prev.filter(c => c.id !== id));
  };

  // -- HANDLERS: Clientes --
  const handleAddCliente = (newC: Omit<Cliente, 'id' | 'puntos' | 'activo'>) => {
    const id = `cl-${Date.now()}`;
    const item: Cliente = { ...newC, id, puntos: 0, activo: true };
    setClientes(prev => [...prev, item]);
  };

  const handleUpdatePuntos = (id: string, puntosCambio: number) => {
    setClientes(prev => prev.map(c => {
      if (c.id === id) {
        const nextPuntos = Math.max(0, c.puntos + puntosCambio);
        return { ...c, puntos: nextPuntos };
      }
      return c;
    }));
  };

  const handleDelCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  // -- HANDLERS: Platillos --
  const handleAddPlatillo = (newPl: Omit<Platillo, 'id' | 'disponible'>) => {
    const id = `pl-${Date.now()}`;
    const item: Platillo = { ...newPl, id, disponible: true };
    setPlatillos(prev => [...prev, item]);
  };

  const handleToggleDisponibilidad = (id: string) => {
    setPlatillos(prev => prev.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p));
  };

  const handleDelPlatillo = (id: string) => {
    setPlatillos(prev => prev.filter(p => p.id !== id));
  };

  // -- HANDLERS: Comandas & Ventas --
  const handleAddComanda = (newC: Omit<Comanda, 'id' | 'codigo' | 'fecha'>) => {
    const count = comandas.length + 1;
    const padding = count.toString().padStart(3, '0');
    const codigo = `COM-${padding}`;
    const id = `com-${Date.now()}`;
    const fecha = new Date().toISOString();

    const item: Comanda = { ...newC, id, codigo, fecha };
    setComandas(prev => [...prev, item]);
  };

  const handleUpdateComandaEstado = (id: string, nuevoEstado: Comanda['estado']) => {
    setComandas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
  };

  const handleAssignChef = (comandaId: string, chefId: string) => {
    // 1. Update chef's active work loads
    setChefs(prev => prev.map(ch => {
      if (ch.id === chefId) {
        return { ...ch, estado: 'En Cocina' as const, ordenesAsignadas: ch.ordenesAsignadas + 1 };
      }
      return ch;
    }));

    // 2. Update comanda with assigned chef
    setComandas(prev => prev.map(c => {
      if (c.id === comandaId) {
        return { ...c, chefId };
      }
      return c;
    }));
  };

  const handlePagarComanda = (comandaId: string, metodoPago: Venta['metodoPago']) => {
    const comanda = comandas.find(c => c.id === comandaId);
    if (!comanda) return;

    // 1. Generate VIP loyal points (10% of total)
    const puntosGanados = Math.floor(comanda.total / 10);
    handleUpdatePuntos(comanda.clienteId, puntosGanados);

    // 2. Build Venta record
    const idVenta = `v-${Date.now()}`;
    const nuevaVenta: Venta = {
      id: idVenta,
      comandaId,
      codigoComanda: comanda.codigo,
      fecha: new Date().toISOString(),
      total: comanda.total,
      metodoPago,
      puntosGanados
    };

    setVentas(prev => [...prev, nuevaVenta]);

    // 3. Discharge chef's workload if assigned
    if (comanda.chefId) {
      setChefs(prev => prev.map(ch => {
        if (ch.id === comanda.chefId) {
          const nextCount = Math.max(0, ch.ordenesAsignadas - 1);
          return { 
            ...ch, 
            ordenesAsignadas: nextCount,
            estado: nextCount === 0 ? 'Libre' as const : ch.estado 
          };
        }
        return ch;
      }));
    }

    // 4. Update comanda state to Delivered / Closed
    setComandas(prev => prev.map(c => c.id === comandaId ? { ...c, estado: 'Entregado' } : c));
  };

  const handleCancelarComanda = (comandaId: string) => {
    const comanda = comandas.find(c => c.id === comandaId);
    if (!comanda) return;

    // Release chef's workload if registered
    if (comanda.chefId) {
      setChefs(prev => prev.map(ch => {
        if (ch.id === comanda.chefId) {
          const nextCount = Math.max(0, ch.ordenesAsignadas - 1);
          return { 
            ...ch, 
            ordenesAsignadas: nextCount,
            estado: nextCount === 0 ? 'Libre' as const : ch.estado 
          };
        }
        return ch;
      }));
    }

    setComandas(prev => prev.map(c => c.id === comandaId ? { ...c, estado: 'Cancelado' } : c));
  };

  // -- HANDLERS: Usuarios --
  const handleAddUsuario = (newU: Omit<Usuario, 'id'>) => {
    const id = `u-${Date.now()}`;
    const item: Usuario = { ...newU, id };
    setUsuarios(prev => [...prev, item]);
  };

  const handleDelUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  // Quick Action trigger from Welcome Banner inside Dashboard
  const triggerNewOrderForm = () => {
    setActiveTab('comandas');
    setShowNewOrderForm(true);
  };

  if (!currentUser) {
    return <Login usuarios={usuarios} onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#f5f2ed] flex flex-col font-sans selection:bg-[#c1a35f]/30 selection:text-white">
      
      {/* Top Main Navigation Header Banner */}
      <header className="bg-[#0c0c0c] border-b border-[#2a2a2a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo Identity */}
            <div className="flex items-center gap-3">
              <div className="bg-[#141414] text-[#c1a35f] p-2.5 rounded-xl border border-[#2a2a2a]">
                <Store size={22} className="stroke-[2]" />
              </div>
              <div>
                <span className="font-serif text-2xl italic text-[#c1a35f] tracking-tight block">La Estancia del Sabor</span>
                <span className="text-[10px] text-[#f5f2ed]/40 font-mono tracking-widest block uppercase">Sistema Integral de Control</span>
              </div>
            </div>
 
            {/* Live indicators status */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-[#141414] px-4- pb-2 pt-2 px-3.5 py-1.5 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/80">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                <span>Caja Operativa</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] px-3.5 py-1.5 rounded-xl border border-[#2a2a2a] text-[#f5f2ed]/80">
                <span>Mesas Libres: <strong className="text-[#c1a35f]">11/15</strong></span>
              </div>
            </div>
 
          </div>
        </div>
      </header>
 
      {/* Main Structural Framework Body */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Left Side menu rail (Desktop) & Top Carousel menu (Mobile) */}
        <nav className="flex flex-col gap-1.5 w-full md:w-64 shrink-0 bg-[#141414] p-4 rounded-2xl border border-[#2a2a2a] h-fit sticky top-28">
          <span className="text-[10px] font-extrabold text-[#c1a35f] uppercase tracking-widest px-3 pb-3 block border-b border-[#2a2a2a]/40 mb-2">Menú Principal</span>
          
          {currentUser.rol === 'administrador' && (
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all-custom ${
                activeTab === 'dashboard'
                  ? 'bg-[#1c1c1c] text-[#c1a35f] border border-[#c1a35f]/30'
                  : 'text-[#f5f2ed]/60 hover:text-[#f5f2ed] hover:bg-[#1c1c1c]/50'
              }`}
            >
              <LayoutDashboard size={16} className="opacity-80" />
              <span>Escritorio Principal</span>
            </button>
          )}

          <button
            id="nav-comandas"
            onClick={() => { setActiveTab('comandas'); setShowNewOrderForm(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all-custom ${
              activeTab === 'comandas'
                ? 'bg-[#1c1c1c] text-[#c1a35f] border border-[#c1a35f]/30'
                : 'text-[#f5f2ed]/60 hover:text-[#f5f2ed] hover:bg-[#1c1c1c]/50'
            }`}
          >
            <Ticket size={16} className="opacity-80" />
            <span>Comandas / Tickets</span>
          </button>

          {currentUser.rol === 'administrador' && (
            <>
              <button
                id="nav-platillos"
                onClick={() => setActiveTab('platillos')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all-custom ${
                  activeTab === 'platillos'
                    ? 'bg-[#1c1c1c] text-[#c1a35f] border border-[#c1a35f]/30'
                    : 'text-[#f5f2ed]/60 hover:text-[#f5f2ed] hover:bg-[#1c1c1c]/50'
                }`}
              >
                <UtensilsCrossed size={16} className="opacity-80" />
                <span>Menú & Alimentos</span>
              </button>

              <button
                id="nav-clientes"
                onClick={() => setActiveTab('clientes')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all-custom ${
                  activeTab === 'clientes'
                    ? 'bg-[#1c1c1c] text-[#c1a35f] border border-[#c1a35f]/30'
                    : 'text-[#f5f2ed]/60 hover:text-[#f5f2ed] hover:bg-[#1c1c1c]/50'
                }`}
              >
                <UsersRound size={16} className="opacity-80" />
                <span>Clientes VIP</span>
              </button>

              <button
                id="nav-personal"
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all-custom ${
                  activeTab === 'personal'
                    ? 'bg-[#1c1c1c] text-[#c1a35f] border border-[#c1a35f]/30'
                    : 'text-[#f5f2ed]/60 hover:text-[#f5f2ed] hover:bg-[#1c1c1c]/50'
                }`}
              >
                <ChefHat size={16} className="opacity-80" />
                <span>Staff & Chefs</span>
              </button>

              <button
                id="nav-ventas"
                onClick={() => setActiveTab('ventas')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all-custom ${
                  activeTab === 'ventas'
                    ? 'bg-[#1c1c1c] text-[#c1a35f] border border-[#c1a35f]/30'
                    : 'text-[#f5f2ed]/60 hover:text-[#f5f2ed] hover:bg-[#1c1c1c]/50'
                }`}
              >
                <LineChart size={16} className="opacity-80" />
                <span>Ventas & Auditoría</span>
              </button>
            </>
          )}

          <div className="border-t border-[#2a2a2a]/80 mt-4 pt-4 space-y-3">
            <div className="px-2">
              <p className="font-semibold text-xs truncate text-[#f5f2ed]" title={currentUser.nombre}>
                {currentUser.nombre}
              </p>
              <p className="text-[10px] text-[#c1a35f] font-mono uppercase tracking-wider font-bold mt-0.5">
                {currentUser.rol}
              </p>
            </div>
            <button
              id="btn-logout"
              onClick={() => setCurrentUser(null)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#2a2a2a]/80 hover:bg-[#c1a35f]/10 hover:text-[#c1a35f] text-red-400 font-bold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              <LogOut size={12} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
 
        {/* Dynamic Display workspace Content */}
        <main className="flex-grow bg-[#141414] border border-[#2a2a2a] p-6 sm:p-8 rounded-2xl min-h-[500px]">
          {activeTab === 'dashboard' && (
            <Dashboard 
              personal={personal}
              chefs={chefs}
              clientes={clientes}
              platillos={platillos}
              comandas={comandas}
              ventas={ventas}
              setActiveTab={setActiveTab}
              onQuickActionNewOrder={triggerNewOrderForm}
            />
          )}

          {activeTab === 'comandas' && (
            <ComandaManagement 
              comandas={comandas}
              personal={personal}
              chefs={chefs}
              clientes={clientes}
              platillos={platillos}
              onAddComanda={handleAddComanda}
              onUpdateComandaEstado={handleUpdateComandaEstado}
              onAssignChef={handleAssignChef}
              onPagarComanda={handlePagarComanda}
              onCancelarComanda={handleCancelarComanda}
              showNewOrderForm={showNewOrderForm}
              setShowNewOrderForm={setShowNewOrderForm}
              currentUserRole={currentUser?.rol}
            />
          )}

          {activeTab === 'platillos' && (
            <PlatilloManagement 
              platillos={platillos}
              onAddPlatillo={handleAddPlatillo}
              onToggleDisponibilidad={handleToggleDisponibilidad}
              onDelPlatillo={handleDelPlatillo}
            />
          )}

          {activeTab === 'clientes' && (
            <ClienteManagement 
              clientes={clientes}
              onAddCliente={handleAddCliente}
              onUpdatePuntos={handleUpdatePuntos}
              onDelCliente={handleDelCliente}
            />
          )}

          {activeTab === 'personal' && (
            <PersonalManagement 
              personal={personal}
              chefs={chefs}
              usuarios={usuarios}
              onAddPersonal={handleAddPersonal}
              onTogglePersonalActivo={handleTogglePersonalActivo}
              onDelPersonal={handleDelPersonal}
              onAddChef={handleAddChef}
              onChangeChefEstado={handleChangeChefEstado}
              onDelChef={handleDelChef}
              onAddUsuario={handleAddUsuario}
              onDelUsuario={handleDelUsuario}
            />
          )}

          {activeTab === 'ventas' && (
            <VentaManagement 
              ventas={ventas}
            />
          )}
        </main>
 
      </div>
 
      {/* Footer copyright */}
      <footer className="bg-[#0c0c0c] border-[#2a2a2a] border-t mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#f5f2ed]/30 font-mono tracking-wider">
          <span>&copy; {new Date().getFullYear()} LA ESTANCIA DEL SABOR &bull; HAUTE CUISINE MANAGEMENT</span>
        </div>
      </footer>
 
    </div>
  );
}
