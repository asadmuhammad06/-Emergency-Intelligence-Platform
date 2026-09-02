// Data: crowd-sourced reports submitted by operators/citizens and streamed to city subscribers.
const reports = new Map();
const subscribers = new Set();

export function normalizeCommunityReport(input) {
  if (!input || !input.category || !['road_block', 'sos', 'power_outage', 'water_shortage'].includes(input.category)) {
    throw new Error('A supported community report category is required');
  }
  const lat = Number(input.lat);
  const lon = Number(input.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Valid lat and lon are required');
  return {
    id: input.id || `community-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    category: input.category,
    type: 'community_report',
    severity: Math.max(1, Math.min(10, Math.round(Number(input.severity) || 5))),
    title: String(input.title || 'Community emergency report').slice(0, 160),
    description: String(input.description || '').slice(0, 2000),
    location: input.location || 'Community report',
    source: 'community-reported',
    timestamp: input.timestamp || new Date().toISOString(),
    needs: Array.isArray(input.needs) ? input.needs.map(String).slice(0, 10) : [],
    language: input.language || 'English',
    lat,
    lon,
    coords: [lat, lon],
    status: input.status || 'submitted'
  };
}

export function submitReport(input) {
  const report = normalizeCommunityReport(input);
  reports.set(report.id, report);
  subscribers.forEach(listener => listener(report));
  return report;
}

export function subscribeToReports(category, city, listener) {
  const callback = report => {
    const matchesCategory = !category || report.category === category;
    const matchesCity = Math.abs(report.lat - city.lat) <= 1.5 && Math.abs(report.lon - city.lon) <= 1.5;
    if (matchesCategory && matchesCity) listener(report);
  };
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function getReports(city) {
  return [...reports.values()].filter(report =>
    Math.abs(report.lat - city.lat) <= 1.5 && Math.abs(report.lon - city.lon) <= 1.5
  );
}
