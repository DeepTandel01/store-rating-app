import React, { useState } from 'react';

const SortableTable = ({ columns, data, onRowClick }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (!field) return;
    if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const va = a[sortField] ?? '';
    const vb = b[sortField] ?? '';
    const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const arrow = (field) => {
    if (sortField !== field) return <span style={{ color: 'var(--text-dim)', marginLeft: 4 }}>⇅</span>;
    return <span style={{ color: 'var(--accent)', marginLeft: 4 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => col.sortable !== false && handleSort(col.key)}>
                {col.label}{col.sortable !== false && arrow(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                No records found
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={row.id ?? i} onClick={() => onRowClick && onRowClick(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
