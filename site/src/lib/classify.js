export const classifyDI = (di) => (di >= 0.9 ? 'good' : di >= 0.8 ? 'warn' : 'bad');
export const classifyEO = (eo) => (eo <= 0.05 ? 'good' : eo <= 0.15 ? 'warn' : 'bad');
export const classifyFS = (fs) => (fs >= 80 ? 'good' : fs >= 60 ? 'warn' : 'bad');

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tz = -date.getTimezoneOffset();
  const sign = tz >= 0 ? '+' : '-';
  const tzh = pad(Math.floor(Math.abs(tz) / 60));
  const tzm = pad(Math.abs(tz) % 60);
  return (
    `${pad(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} · ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
    `UTC${sign}${tzh}:${tzm}`
  );
}
