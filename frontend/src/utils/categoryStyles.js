const CATEGORY_COLORS = {
  RUNTIME: '#61dafb',
  DATABASE: '#2dd4bf',
  NETWORK: '#58a6ff',
  BUILD: '#f97316',
  DEPLOY: '#a371f7',
  CONFIG: '#d29922',
  PERFORMANCE: '#3fb950',
  SECURITY: '#f85149',
  OTHER: '#8b949e',
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] ?? '#58a6ff';
}
