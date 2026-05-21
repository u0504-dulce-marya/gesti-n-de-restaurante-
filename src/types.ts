/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Personal {
  id: string;
  nombre: string;
  rol: string; // e.g., 'Camarero', 'Cajero', 'Gerente', 'Hostess'
  turno: 'Mañana' | 'Tarde' | 'Noche';
  telefono: string;
  activo: boolean;
}

export interface Chef {
  id: string;
  nombre: string;
  especialidad: string; // e.g., 'Carnes', 'Mariscos', 'Sushi', 'Repostería', 'General'
  estado: 'En Cocina' | 'Libre' | 'Descanso';
  ordenesAsignadas: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  mesaFav: string;
  puntos: number;
  activo: boolean;
}

export interface Platillo {
  id: string;
  nombre: string;
  categoria: 'Entradas' | 'Platos Fuertes' | 'Postres' | 'Bebidas';
  precio: number;
  tiempoMin: number; // cooking time in minutes
  ingredientes: string;
  disponible: boolean;
}

export interface ComandaItem {
  platilloId: string;
  nombre: string; // Cached for quick display
  precio: number; // Cached price
  cantidad: number;
}

export interface Comanda {
  id: string;
  codigo: string; // Display code like #COM-101
  numeroMesa: string;
  clienteId: string; // References Cliente
  chefId: string | null; // References Chef, can be null before prep
  camareroId: string; // References Personal (role Camarero)
  items: ComandaItem[];
  notas: string;
  estado: 'En Cola' | 'Prep' | 'Listo' | 'Entregado' | 'Cancelado';
  fecha: string; // ISO string
  total: number;
}

export interface Venta {
  id: string;
  comandaId: string;
  codigoComanda: string;
  fecha: string;
  total: number;
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  puntosGanados: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  usuario: string; // Login username
  clave: string; // Password / PIN
  rol: 'administrador' | 'mesero' | 'cocinero';
}
