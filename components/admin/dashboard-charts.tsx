"use client"

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ERPMetrics } from '@/lib/types'

const chartColors = ['#0284c7', '#16a34a', '#dc2626', '#f59e0b']

interface DashboardChartsProps {
  metrics: ERPMetrics
}

export function DashboardCharts({ metrics }: DashboardChartsProps) {
  const barData = [
    { label: 'Fornecedores', value: metrics.totalSuppliers },
    { label: 'Produtos', value: metrics.totalProducts },
    { label: 'Vendas', value: metrics.totalSales },
    { label: 'Estoque', value: metrics.stockAvailable },
  ]

  const pieData = [
    { name: 'Entradas', value: metrics.entries },
    { name: 'Saídas', value: metrics.exits },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Resumo Rápido</h2>
        <div className="h-72 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Entradas vs Saídas</h2>
        <div className="h-72 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40} paddingAngle={4}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
