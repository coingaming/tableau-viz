/* global tableau */
(function () {
  'use strict';

  const statusEl = document.getElementById('status');
  const wrapEl = document.getElementById('table-wrap');

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function cellText(dataValue) {
    if (dataValue == null) return '';
    if (typeof dataValue === 'object' && 'formattedValue' in dataValue) {
      return dataValue.formattedValue == null ? '' : String(dataValue.formattedValue);
    }
    if (typeof dataValue === 'object' && 'value' in dataValue) {
      return dataValue.value == null ? '' : String(dataValue.value);
    }
    return String(dataValue);
  }

  function renderTable(dataTable) {
    const columns = dataTable.columns || [];
    const rows = dataTable.data || [];

    if (!columns.length) {
      wrapEl.innerHTML = '<div class="empty"><strong>No fields assigned</strong><span>Drag fields onto the Data tile in the Marks card.</span></div>';
      setStatus('Waiting for fields');
      return;
    }

    const headers = columns.map((c, i) => {
      const name = c.fieldName || c.caption || c.name || ('Field ' + (i + 1));
      return '<th>' + escapeHtml(name) + '</th>';
    }).join('');

    const body = rows.map((row) => {
      const values = row.map(cellText);
      const rowLabel = values.join(' ').toLowerCase();
      const isTotal = /(^|\s)(grand\s+total|total)(\s|$)/i.test(rowLabel);
      const cells = values.map((value, i) => {
        const numeric = Number(String(value).replace(/[,\s€$£%]/g, '').replace(/\((.*)\)/, '-$1'));
        let cls = '';
        if (i > 0 && value !== '' && Number.isFinite(numeric)) {
          if (numeric < 0) cls = 'negative';
          else if (numeric > 0) cls = 'positive';
        }
        return '<td class="' + cls + '">' + escapeHtml(value) + '</td>';
      }).join('');
      return '<tr class="' + (isTotal ? 'total-row' : '') + '">' + cells + '</tr>';
    }).join('');

    wrapEl.innerHTML = '<table><thead><tr>' + headers + '</tr></thead><tbody>' + body + '</tbody></table>';
    setStatus(rows.length + ' rows · ' + columns.length + ' columns');
  }

  async function refresh() {
    try {
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      const reader = await worksheet.getSummaryDataReaderAsync();
      try {
        const dataTable = await reader.getAllPagesAsync();
        renderTable(dataTable);
      } finally {
        await reader.releaseAsync();
      }
    } catch (err) {
      console.error(err);
      wrapEl.innerHTML = '<div class="error">Could not read worksheet summary data.\n' +
        escapeHtml(err && err.message ? err.message : err) +
        '\n\nCheck that fields have been assigned to the Data tile and that the extension has permission to access summary data.</div>';
      setStatus('Data error');
    }
  }

  async function start() {
    try {
      if (!window.tableau || !tableau.extensions) {
        setStatus('Preview mode');
        return;
      }
      await tableau.extensions.initializeAsync();
      setStatus('Connected to Tableau');
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      worksheet.addEventListener(tableau.TableauEventType.SummaryDataChanged, refresh);
      await refresh();
    } catch (err) {
      console.error(err);
      setStatus('Initialization failed');
      wrapEl.innerHTML = '<div class="error">' + escapeHtml(err && err.message ? err.message : err) + '</div>';
    }
  }

  window.addEventListener('load', start);
}());
