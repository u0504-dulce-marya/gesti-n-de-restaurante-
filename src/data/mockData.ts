/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Personal, Chef, Cliente, Platillo, Comanda, Venta } from '../types';

export const INITIAL_PERSONAL: Personal[] = [
  { id: 'p-1', nombre: 'Carlos Mendoza', rol: 'Camarero', turno: 'Mañana', telefono: '555-0123', activo: true },
  { id: 'p-2', nombre: 'Andrea Rojas', rol: 'Camarero', turno: 'Tarde', telefono: '555-0199', activo: true },
  { id: 'p-3', nombre: 'Sofía Castro', rol: 'Cajero', turno: 'Noche', telefono: '555-2244', activo: true },
  { id: 'p-4', nombre: 'Manuel Guerrero', rol: 'Hostess', turno: 'Mañana', telefono: '555-9081', activo: true },
  { id: 'p-5', nombre: 'Lucía Fernández', rol: 'Camarero', turno: 'Noche', telefono: '555-4433', activo: true }
];

export const INITIAL_CHEFS: Chef[] = [
  { id: 'ch-1', nombre: 'Chef Héctor Altamirano', especialidad: 'Carnes a la Parrilla', estado: 'En Cocina', ordenesAsignadas: 1 },
  { id: 'ch-2', nombre: 'Chef Elena Rostova', especialidad: 'Comida Italiana & Pastas', estado: 'Libre', ordenesAsignadas: 0 },
  { id: 'ch-3', nombre: 'Chef Marcos Shin', especialidad: 'Sushi & Mariscos', estado: 'En Cocina', ordenesAsignadas: 1 },
  { id: 'ch-4', nombre: 'Chef Julia Benítez', especialidad: 'Repostería Fina', estado: 'Descanso', ordenesAsignadas: 0 }
];

export const INITIAL_CLIENTES: Cliente[] = [
  { id: 'cl-1', nombre: 'Alejandro Gaviria', telefono: '555-7832', email: 'alejandro.g@mail.com', mesaFav: 'Mesa 4 (Terraza)', puntos: 120, activo: true },
  { id: 'cl-2', nombre: 'Mariana Silva', telefono: '555-3012', email: 'mariana.silva@mail.com', mesaFav: 'Mesa 12 (Ventana)', puntos: 45, activo: true },
  { id: 'cl-3', nombre: 'Roberto Gómez', telefono: '555-9988', email: 'roberto.g@mail.com', mesaFav: 'Barra 2', puntos: 280, activo: true },
  { id: 'cl-4', nombre: 'Ximena Paredes', telefono: '555-1122', email: 'ximena.p@mail.com', mesaFav: 'Mesa 8 (Interior)', puntos: 85, activo: true },
  { id: 'cl-5', nombre: 'Fernando Ruiz', telefono: '555-4455', email: 'fernando.r@mail.com', mesaFav: 'Mesa 2 (Terraza)', puntos: 10, activo: true }
];

export const INITIAL_PLATILLOS: Platillo[] = [
  // Entradas
  { id: 'pl-1', nombre: 'Nachos Supremos', categoria: 'Entradas', precio: 145.00, tiempoMin: 10, ingredientes: 'Totopos crujientes, queso fundido, frijoles refritos, jalapeños, guacamole y pico de gallo', disponible: true },
  { id: 'pl-2', nombre: 'Empanadas de Viento (3 pzas)', categoria: 'Entradas', precio: 95.00, tiempoMin: 8, ingredientes: 'Masa fina rellena de queso, espolvoreadas con azúcar glass y salsa chimichurri', disponible: true },
  { id: 'pl-3', nombre: 'Ceviche Clásico de Pescado', categoria: 'Entradas', precio: 175.00, tiempoMin: 12, ingredientes: 'Cachama o corvina marinada en limón norteño, cebolla morada, cilantro y camote dulce', disponible: true },

  // Platos Fuertes
  { id: 'pl-4', nombre: 'Arrachera Imperial (300g)', categoria: 'Platos Fuertes', precio: 320.00, tiempoMin: 20, ingredientes: 'Corte magro de res a la parrilla, acompañado de una papa al horno y cebollitas cambray', disponible: true },
  { id: 'pl-5', nombre: 'Fetuccini Alfredo con Camarones', categoria: 'Platos Fuertes', precio: 245.00, tiempoMin: 15, ingredientes: 'Fideos fetuccini en crema Alfredo artesanal de parmesano, con camarones ajo y mantequilla', disponible: true },
  { id: 'pl-6', nombre: 'Tacos Dorados de Barbacoa (4 pzas)', categoria: 'Platos Fuertes', precio: 160.00, tiempoMin: 10, ingredientes: 'Tortilla de maíz frita rellena de barbacoa de borrego, crema, queso cotija y salsa verde', disponible: true },
  { id: 'pl-7', nombre: 'Hamburguesa Sabor Ahumado', categoria: 'Platos Fuertes', precio: 195.00, tiempoMin: 14, ingredientes: 'Carne angus ahumada, queso cheddar fundido, tocino crujiente, cebolla caramelizada, papas fritas', disponible: true },

  // Postres
  { id: 'pl-8', nombre: 'Volcán de Chocolate', categoria: 'Postres', precio: 110.00, tiempoMin: 15, ingredientes: 'Bizcocho tibio de chocolate amargo con centro líquido de fudge caliente y helado de vainilla', disponible: true },
  { id: 'pl-9', nombre: 'Pastel de Tres Leches con Cajeta', categoria: 'Postres', precio: 85.00, tiempoMin: 5, ingredientes: 'Bizcocho esponjoso bañado en tres leches dulces, cubierto con cajeta quemada y nueces tostadas', disponible: true },

  // Bebidas
  { id: 'pl-10', nombre: 'Margarita de Maracuyá Especial', categoria: 'Bebidas', precio: 125.00, tiempoMin: 5, ingredientes: 'Tequila reposado, licor de naranja, pulpa fresca de maracuyá y escarchado de chamoy con chile', disponible: true },
  { id: 'pl-11', nombre: 'Limonada de Hierbabuena (Frapé)', categoria: 'Bebidas', precio: 55.00, tiempoMin: 4, ingredientes: 'Zumo de limón fresco licuado con hielo, hojas de hierbabuena fresca y jarabe natural', disponible: true },
  { id: 'pl-12', nombre: 'Café Espresso Doble', categoria: 'Bebidas', precio: 60.00, tiempoMin: 3, ingredientes: 'Extracción concentrada de granos de café de altura orgánico (Coatepec)', disponible: true }
];

export const INITIAL_COMANDAS: Comanda[] = [
  {
    id: 'com-1',
    codigo: 'COM-081',
    numeroMesa: 'Mesa 4',
    clienteId: 'cl-1',
    chefId: 'ch-1',
    camareroId: 'p-1',
    items: [
      { platilloId: 'pl-1', nombre: 'Nachos Supremos', precio: 145.00, cantidad: 1 },
      { platilloId: 'pl-4', nombre: 'Arrachera Imperial (300g)', precio: 320.00, cantidad: 1 },
      { platilloId: 'pl-11', nombre: 'Limonada de Hierbabuena (Frapé)', precio: 55.00, cantidad: 1 }
    ],
    notas: 'Término de la carne bien cocido. Sin jalapeños en los nachos.',
    estado: 'Prep',
    fecha: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
    total: 520.00
  },
  {
    id: 'com-2',
    codigo: 'COM-082',
    numeroMesa: 'Barra 2',
    clienteId: 'cl-3',
    chefId: 'ch-3',
    camareroId: 'p-2',
    items: [
      { platilloId: 'pl-3', nombre: 'Ceviche Clásico de Pescado', precio: 175.00, cantidad: 1 },
      { platilloId: 'pl-10', nombre: 'Margarita de Maracuyá Especial', precio: 125.00, cantidad: 2 }
    ],
    notas: 'Muy picante el ceviche por favor.',
    estado: 'Listo',
    fecha: new Date(Date.now() - 40 * 60000).toISOString(), // 40 min ago
    total: 425.00
  },
  {
    id: 'com-3',
    codigo: 'COM-083',
    numeroMesa: 'Mesa 12',
    clienteId: 'cl-2',
    chefId: null,
    camareroId: 'p-1',
    items: [
      { platilloId: 'pl-5', nombre: 'Fetuccini Alfredo con Camarones', precio: 245.00, cantidad: 1 },
      { platilloId: 'pl-8', nombre: 'Volcán de Chocolate', precio: 110.00, cantidad: 1 },
      { platilloId: 'pl-11', nombre: 'Limonada de Hierbabuena (Frapé)', precio: 55.00, cantidad: 1 }
    ],
    notas: 'Llevar bebida de inmediato y el postre al final.',
    estado: 'En Cola',
    fecha: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    total: 410.00
  }
];

export const INITIAL_VENTAS: Venta[] = [
  {
    id: 'v-1',
    comandaId: 'com-old-1',
    codigoComanda: 'COM-078',
    fecha: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    total: 355.00,
    metodoPago: 'Efectivo',
    puntosGanados: 35
  },
  {
    id: 'v-2',
    comandaId: 'com-old-2',
    codigoComanda: 'COM-079',
    fecha: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    total: 680.00,
    metodoPago: 'Tarjeta',
    puntosGanados: 68
  },
  {
    id: 'v-3',
    comandaId: 'com-old-3',
    codigoComanda: 'COM-080',
    fecha: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hour ago
    total: 215.00,
    metodoPago: 'Tarjeta',
    puntosGanados: 21
  },
  // Ventas de días anteriores para simular historial de ventas
  {
    id: 'v-y-1',
    comandaId: 'com-y-1',
    codigoComanda: 'COM-070',
    fecha: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    total: 1250.00,
    metodoPago: 'Tarjeta',
    puntosGanados: 125
  },
  {
    id: 'v-y-2',
    comandaId: 'com-y-2',
    codigoComanda: 'COM-071',
    fecha: new Date(Date.now() - 25 * 3600000).toISOString(), // 1 day and 1h ago
    total: 940.00,
    metodoPago: 'Transferencia',
    puntosGanados: 94
  },
  {
    id: 'v-y-3',
    comandaId: 'com-y-3',
    codigoComanda: 'COM-072',
    fecha: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), // 2 days ago
    total: 1850.00,
    metodoPago: 'Tarjeta',
    puntosGanados: 185
  },
  {
    id: 'v-y-4',
    comandaId: 'com-y-4',
    codigoComanda: 'COM-073',
    fecha: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), // 3 days ago
    total: 1540.00,
    metodoPago: 'Efectivo',
    puntosGanados: 154
  },
  {
    id: 'v-y-5',
    comandaId: 'com-y-5',
    codigoComanda: 'COM-074',
    fecha: new Date(Date.now() - 4 * 24 * 3600000).toISOString(), // 4 days ago
    total: 2100.00,
    metodoPago: 'Tarjeta',
    puntosGanados: 210
  },
  {
    id: 'v-y-6',
    comandaId: 'com-y-6',
    codigoComanda: 'COM-075',
    fecha: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), // 5 days ago
    total: 1320.00,
    metodoPago: 'Efectivo',
    puntosGanados: 132
  },
  {
    id: 'v-y-7',
    comandaId: 'com-y-7',
    codigoComanda: 'COM-076',
    fecha: new Date(Date.now() - 6 * 24 * 3600000).toISOString(), // 6 days ago
    total: 1780.00,
    metodoPago: 'Transferencia',
    puntosGanados: 178
  }
];
