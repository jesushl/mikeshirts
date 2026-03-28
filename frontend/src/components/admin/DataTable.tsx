import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
  className?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  rowKey: (row: T) => string | number
  onRowClick?: (row: T) => void
}

export default function DataTable<T>({ columns, data, loading, emptyMessage, rowKey, onRowClick }: Props<T>) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wide py-3 px-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-border/50">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-3">
                    <div className="h-4 bg-brand-lighter rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted text-sm">
        {emptyMessage ?? 'Sin datos'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className={`text-left text-xs font-semibold text-text-muted uppercase tracking-wide py-3 px-3 ${col.className ?? ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-border/50 ${
                i % 2 === 0 ? 'bg-brand-lighter/20' : ''
              } ${onRowClick ? 'cursor-pointer hover:bg-accent/5' : ''} transition-colors`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`py-3 px-3 text-sm ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
