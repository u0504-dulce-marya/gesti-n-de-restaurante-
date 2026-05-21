/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, Lock, LogIn, ShieldCheck, KeyRound, ChefHat } from 'lucide-react';
import { Usuario } from '../types';

interface LoginProps {
  usuarios: Usuario[];
  onLoginSuccess: (user: Usuario) => void;
}

export default function Login({ usuarios, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const lowercaseUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verify credentials
    const foundUser = usuarios.find(
      (u) => u.usuario.toLowerCase() === lowercaseUser && u.clave === cleanPass
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      setError('Credenciales incorrectas. Verifique el nombre de usuario o contraseña.');
    }
  };

  const fillCredentials = (userVal: string, passVal: string) => {
    setUsername(userVal);
    setPassword(passVal);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#f5f2ed] flex flex-col justify-center items-center p-4 font-sans relative selection:bg-[#c1a35f]/35 selection:text-white overflow-hidden">
      
      {/* Soft decorative background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#c1a35f]/2.5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-neutral-900/30 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto bg-[#0f0f0f] text-[#c1a35f] p-4 rounded-2xl border border-[#232323] w-fit shadow-xl shadow-black/40">
            <Store size={32} className="stroke-[1.5]" />
          </div>
          <div>
            <h1 className="font-serif italic text-3xl md:text-4xl text-[#c1a35f] tracking-tight">La Estancia del Sabor</h1>
            <p className="text-[#f5f2ed]/55 text-xs tracking-widest uppercase font-mono mt-1">Alta Cocina &bull; Control Interno</p>
          </div>
        </div>

        {/* Login Main Card */}
        <div className="bg-[#0f0f0f] border border-[#232323] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-black/80">
          <div className="space-y-1.5">
            <h2 className="text-lg font-serif italic text-[#f5f2ed]">Ingreso al Sistema</h2>
            <p className="text-xs text-[#f5f2ed]/50">Rellena tus credenciales autorizadas por administración.</p>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-900/40 text-red-300 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-pulse">
              <span className="font-bold shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#f5f2ed]/55 font-mono">Nombre de Usuario</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#c1a35f]/60">
                  <UserIcon />
                </span>
                <input
                  id="login-username"
                  type="text"
                  required
                  placeholder="Ej. carlos"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#161616] border border-[#272727] rounded-xl text-sm focus:outline-none focus:border-[#c1a35f] transition text-[#f5f2ed] placeholder-[#f5f2ed]/25"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#f5f2ed]/55 font-mono">Contraseña / PIN</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#c1a35f]/60">
                  <Lock size={15} />
                </span>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="Ej. 1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#161616] border border-[#272727] rounded-xl text-sm focus:outline-none focus:border-[#c1a35f] transition text-[#f5f2ed] placeholder-[#f5f2ed]/25 font-mono"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-[#c1a35f]/10"
            >
              <LogIn size={15} />
              <span>Entrar al Sistema</span>
            </button>
          </form>

          {/* Quick Demo Credentials Selector */}
          <div className="border-t border-[#232323] pt-5 space-y-3">
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#f5f2ed]/45 block font-mono">Cuentas Preconfiguradas (Demostración)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'admin')}
                className="flex flex-col text-left p-2.5 rounded-xl border border-[#232323] bg-[#121212] hover:border-[#c1a35f]/30 hover:bg-[#151515] transition cursor-pointer text-[11px]"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#c1a35f] font-serif italic mb-0.5">
                  <ShieldCheck size={11} />
                  <span>Administrador</span>
                </div>
                <span className="text-[9px] text-[#f5f2ed]/50 font-mono">User: admin</span>
                <span className="text-[9px] text-[#f5f2ed]/50 font-mono">Pass: admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('carlos', '1234')}
                className="flex flex-col text-left p-2.5 rounded-xl border border-[#232323] bg-[#121212] hover:border-[#c1a35f]/30 hover:bg-[#151515] transition cursor-pointer text-[11px]"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#c1a35f] font-serif italic mb-0.5">
                  <KeyRound size={11} />
                  <span>Mesero Carlos</span>
                </div>
                <span className="text-[9px] text-[#f5f2ed]/50 font-mono">User: carlos</span>
                <span className="text-[9px] text-[#f5f2ed]/50 font-mono">Pass: 1234</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('juana', '5678')}
                className="flex flex-col text-left p-2.5 rounded-xl border border-[#232323] bg-[#121212] hover:border-[#c1a35f]/30 hover:bg-[#151515] transition cursor-pointer text-[11px]"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#c1a35f] font-serif italic mb-0.5">
                  <ChefHat size={11} />
                  <span>Cocinera Juana</span>
                </div>
                <span className="text-[9px] text-[#f5f2ed]/50 font-mono">User: juana</span>
                <span className="text-[9px] text-[#f5f2ed]/50 font-mono">Pass: 5678</span>
              </button>
            </div>
          </div>
        </div>

        {/* Brand small footing */}
        <p className="text-center text-[10px] text-[#f5f2ed]/25 font-mono uppercase tracking-widest leading-none">
          &copy; {new Date().getFullYear()} La Estancia del Sabor &bull; Seguridad Certificada
        </p>

      </div>
    </div>
  );
}

// Simple internal icon to dodge typescript named imports constraints
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
