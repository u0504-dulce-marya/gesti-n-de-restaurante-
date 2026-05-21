/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Coins, 
  Activity, 
  Calendar, 
  Award, 
  Search, 
  FileText, 
  X,
  Printer
} from 'lucide-react';
import { Venta } from '../types';

interface VentaManagementProps {
  ventas: Venta[];
}

export default function VentaManagement({ ventas }: VentaManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  // Financial statistics
  const totalSalesRevenue = ventas.reduce((sum, v) => sum + v.total, 0);
  const avgTicket = ventas.length > 0 ? totalSalesRevenue / ventas.length : 0;
  
  // Total points awarded
  const totalPuntosGanados = ventas.reduce((sum, v) => sum + v.puntosGanados, 0);

  // Payment methods calculation
  const cashSales = ventas.filter(v => v.metodoPago === 'Efectivo');
  const cardSales = ventas.filter(v => v.metodoPago === 'Tarjeta');
  const transferSales = ventas.filter(v => v.metodoPago === 'Transferencia');

  const cashTotal = cashSales.reduce((a, b) => a + b.total, 0);
  const cardTotal = cardSales.reduce((a, b) => a + b.total, 0);
  const transferTotal = transferSales.reduce((a, b) => a + b.total, 0);

  // Preferred payment method simple determination
  let preferredMethod = 'Efectivo';
  if (cardTotal > cashTotal && cardTotal > transferTotal) preferredMethod = 'Tarjeta';
  else if (transferTotal > cashTotal && transferTotal > cardTotal) preferredMethod = 'Transferencia';

  // 1. Chart Data: Daily sales grouping for the last 7 days
  const getSalesForPastDays = () => {
    const daysData: { [key: string]: number } = {};
    const dateNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Pre-populate past 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
      daysData[dateString] = 0;
    }

    // Accumulate actual sales matching dates
    ventas.forEach(v => {
      const saleDate = new Date(v.fecha);
      const formatted = saleDate.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
      if (daysData[formatted] !== undefined) {
        daysData[formatted] += v.total;
      } else {
        // Just in case it fallback outside but within dates
        daysData[formatted] = v.total;
      }
    });

    return Object.entries(daysData).map(([dayName, totalSales]) => ({
      name: dayName,
      Ingreso: parseFloat(totalSales.toFixed(2))
    }));
  };

  const areaChartData = getSalesForPastDays();

  // 2. Chart Data: Pie breakdown of payment methods (Elegant Gold Shades)
  const pieChartData = [
    { name: 'Efectivo', value: parseFloat(cashTotal.toFixed(2)), color: '#c1a35f' },
    { name: 'Tarjeta', value: parseFloat(cardTotal.toFixed(2)), color: '#e5d5b8' },
    { name: 'Transferencia', value: parseFloat(transferTotal.toFixed(2)), color: '#8e7039' }
  ].filter(item => item.value > 0);

  // Filter Sales list based on query
  const filteredVentas = [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .filter(v => 
      v.codigoComanda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.metodoPago.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.total.toString().includes(searchQuery)
    );

  const handlePrintReceipt = (id: string) => {
    setPrintStatus(`Ticket #${id.slice(0,6).toUpperCase()} enviado a la terminal de barra...`);
    setTimeout(() => {
      setPrintStatus(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#f5f2ed]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif italic text-[#c1a35f] tracking-tight">Análisis Contable y Ventas</h1>
        <p className="text-[#f5f2ed]/55 text-xs md:text-sm">Audita las transacciones comerciales, ingresos acumulados e indicadores financieros.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/15 transition duration-150">
          <div className="p-3 bg-[#0c0c0c] text-[#c1a35f] border border-[#c1a35f]/10 rounded-lg">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#f5f2ed]/45 block">Facturación Total</span>
            <span className="text-xl font-bold font-serif text-[#f5f2ed]">${totalSalesRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/15 transition duration-150">
          <div className="p-3 bg-[#0c0c0c] text-[#c1a35f] border border-[#c1a35f]/10 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#f5f2ed]/45 block">Ticket Promedio</span>
            <span className="text-xl font-bold font-serif text-[#f5f2ed]">${avgTicket.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/15 transition duration-150">
          <div className="p-3 bg-[#0c0c0c] text-[#c1a35f] border border-[#c1a35f]/10 rounded-lg">
            <CreditCard size={20} />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#f5f2ed]/45 block">Canal Preferido</span>
            <span className="text-base font-serif italic font-bold text-[#c1a35f]">{preferredMethod}</span>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2a2a2a] flex items-center gap-4 hover:border-[#c1a35f]/15 transition duration-150">
          <div className="p-3 bg-[#0c0c0c] text-[#c1a35f] border border-[#c1a35f]/10 rounded-lg">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#f5f2ed]/45 block">Estímulos Premium</span>
            <span className="text-xl font-bold font-serif text-[#f5f2ed]">{totalPuntosGanados} pts</span>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales trend - Area chart (Takes 2 cols) */}
        <div className="lg:col-span-2 bg-[#141414] rounded-xl border border-[#2a2a2a] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2a2a2a]/60 pb-3">
            <h3 className="font-serif italic text-sm font-semibold text-[#f5f2ed] flex items-center gap-1.5">
              <Calendar className="text-[#c1a35f]/70" size={15} />
              <span>Facturación Diaria (Últimos 7 días)</span>
            </h3>
            <span className="text-[9px] bg-[#0c0c0c] text-[#c1a35f] font-mono tracking-wide px-2 py-0.5 rounded border border-[#c1a35f]/10">Tendencia ($MXN)</span>
          </div>

          <div className="h-64 mt-4 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c1a35f" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#c1a35f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0c0c', borderColor: '#2a2a2a', color: '#f5f2ed' }}
                  itemStyle={{ color: '#c1a35f' }}
                  formatter={(value) => [`$${value}`, 'Ingreso']} 
                />
                <Area type="monotone" dataKey="Ingreso" stroke="#c1a35f" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share of methods - Pie chart (Takes 1 col) */}
        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-5 space-y-4 flex flex-col justify-between">
          <div className="border-b border-[#2a2a2a]/60 pb-3">
            <h3 className="font-serif italic text-sm font-semibold text-[#f5f2ed] flex items-center gap-1.5">
              <Activity className="text-[#c1a35f]/70" size={15} />
              <span>Porcentaje sobre Métodos</span>
            </h3>
          </div>

          {pieChartData.length === 0 ? (
            <div className="text-center py-16 text-[#f5f2ed]/40 text-xs my-auto italic">
              Esperando registros comerciales...
            </div>
          ) : (
            <>
              <div className="h-44 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0c0c0c', borderColor: '#2a2a2a', color: '#f5f2ed' }}
                      itemStyle={{ color: '#c1a35f' }}
                      formatter={(value) => [`$${value}`, 'Recaudado']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="space-y-2 mt-2">
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: item.color }}></span>
                      <span className="font-semibold text-[#f5f2ed]/75">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#f5f2ed]">
                      {((item.value / totalSalesRevenue) * 100).toFixed(1)}% <span className="text-[#f5f2ed]/45 text-[10px] font-mono">(${item.value})</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Live Sales Logs Data block */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-serif italic text-[#f5f2ed]">Historial Diario de Auditoría</h2>
          
          {/* Internal search */}
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c1a35f]/60">
              <Search size={14} />
            </span>
            <input
              id="input-search-ventas"
              type="text"
              placeholder="Código, método..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg text-xs focus:outline-none focus:border-[#c1a35f]"
            />
          </div>
        </div>

        {/* Sales Table log */}
        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] overflow-hidden shadow-xs">
          {filteredVentas.length === 0 ? (
            <div className="text-center py-12 text-sm text-[#f5f2ed]/40 italic">
              No se encontraron registros de cobros hoy.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#f5f2ed]/80 whitespace-nowrap">
                <thead className="bg-[#0c0c0c] text-[9px] font-bold uppercase text-[#f5f2ed]/40 tracking-wider border-b border-[#2a2a2a]">
                  <tr>
                    <th className="p-4">Folio de venta</th>
                    <th className="p-4">Ref. Comanda</th>
                    <th className="p-4">Fecha y Hora</th>
                    <th className="p-4">Método de Pago</th>
                    <th className="p-4">Puntos VIP emitidos</th>
                    <th className="p-4 text-right">Invoiced ($MXN)</th>
                    <th className="p-4 text-center">Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]/60">
                  {filteredVentas.map((v) => (
                    <tr key={v.id} className="hover:bg-black/25 transition">
                      <td className="p-4 font-mono font-bold text-[#f5f2ed]/45">{v.id.slice(0, 8).toUpperCase()}</td>
                      <td className="p-4 font-mono font-bold text-[#c1a35f]">{v.codigoComanda}</td>
                      <td className="p-4">
                        {new Date(v.fecha).toLocaleDateString('es-MX', { month: '2-digit', day: '2-digit' })}{' '}
                        {new Date(v.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-semibold">{v.metodoPago}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-[#c1a35f] bg-[#c1a35f]/5 border border-[#c1a35f]/25 px-2.5 py-0.5 rounded font-mono font-bold">
                          <Award size={12} className="text-[#c1a35f]" />
                          <span>+{v.puntosGanados} pts</span>
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-[#c1a35f]">${v.total.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <button
                          id={`btn-open-ticket-log-${v.id}`}
                          onClick={() => setSelectedVenta(v)}
                          className="px-2.5 py-1.5 bg-[#0c0c0c] border border-[#2a2a2a] hover:bg-[#1f1f1f] text-[#c1a35f] hover:text-[#b0914e] font-bold rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer"
                        >
                          Ver Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Ticket/Receipt drawer */}
      {selectedVenta && (
        <div className="fixed inset-0 bg-[#000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div id="receipt-modal" className="bg-[#141414] w-full max-w-sm rounded-xl p-6 shadow-2xl border border-[#2a2a2a] space-y-4 font-mono text-[#f5f2ed] animate-scale-up relative">
            <button 
              onClick={() => { setSelectedVenta(null); setPrintStatus(null); }}
              className="absolute top-4 right-4 text-[#f5f2ed]/45 hover:text-[#f5f2ed] p-1 rounded-lg cursor-pointer transition duration-150"
            >
              <X size={16} />
            </button>

            {/* Receipt visual layout */}
            <div className="text-center pt-2 space-y-1">
              <h4 className="font-serif italic font-bold text-base text-[#c1a35f] leading-tight">LA ESTANCIA DEL SABOR</h4>
              <p className="text-[9px] text-[#f5f2ed]/40 uppercase tracking-widest">Reg. Fiscal #A-901-78-9001</p>
              <p className="text-[9px] text-[#f5f2ed]/40">Av. Paseo de las Lomas 101, CDMX</p>
            </div>

            <div className="border-t border-dashed border-[#2a2a2a] pt-3 space-y-1 text-[10px] text-[#f5f2ed]/70">
              <div className="flex justify-between">
                <span>TICKET ID:</span>
                <span className="font-bold text-[#f5f2ed]">{selectedVenta.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>REF COMANDA:</span>
                <span className="font-bold text-[#f5f2ed]">{selectedVenta.codigoComanda}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA:</span>
                <span>{new Date(selectedVenta.fecha).toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between">
                <span>FORMA PAGO:</span>
                <span className="font-bold text-[#c1a35f]">{selectedVenta.metodoPago.toUpperCase()}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#2a2a2a] pt-3 text-[10px] space-y-1.5">
              <div className="flex justify-between font-bold text-[#f5f2ed]">
                <span>CONCEPTO</span>
                <span>TOTAL</span>
              </div>
              <div className="flex justify-between text-[#f5f2ed]/55">
                <span>Consumo General Alimentos y Bebidas</span>
                <span>${(selectedVenta.total / 1.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#f5f2ed]/55">
                <span>IVA Trasladado (16.00%)</span>
                <span>${(selectedVenta.total - (selectedVenta.total / 1.16)).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t-2 border-double border-[#2a2a2a] pt-3 text-xs flex justify-between font-bold text-[#c1a35f]">
              <span>PAGO TOTAL:</span>
              <span>${selectedVenta.total.toFixed(2)} MXN</span>
            </div>

            <div className="border-t border-dashed border-[#2a2a2a] pt-3 text-center space-y-2">
              <div className="inline-flex items-center justify-center gap-1 text-[10px] text-[#c1a35f] bg-[#c1a35f]/5 border border-[#c1a35f]/20 px-3 py-1 rounded-lg font-bold">
                <Award size={11} className="text-[#c1a35f]" />
                <span>Puntos Club: +{selectedVenta.puntosGanados} pts</span>
              </div>
              <p className="text-[10px] text-[#f5f2ed]/40 italic">¡Gracias por ser un cliente VIP!</p>
            </div>

            {printStatus && (
              <div className="bg-[#c1a35f]/10 border border-[#c1a35f]/25 text-center text-[10px] text-[#c1a35f] py-2 rounded-lg font-mono animate-pulse">
                {printStatus}
              </div>
            )}

            <button
              onClick={() => handlePrintReceipt(selectedVenta.id)}
              className="w-full flex items-center justify-center gap-1.5 bg-[#c1a35f] hover:bg-[#b0914e] text-[#0c0c0c] font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer border border-[#c1a35f]/20"
            >
              <Printer size={13} />
              <span>Imprimir Ticket de Venta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
