export const SELECT_COPY = {
  openHint: 'Abre la lista',
  search: 'Buscar',
  loading: 'Cargando…',
  noResults: (query: string) => `Nada coincide con "${query}".`,
  triggerLabel: (label: string, valueLabel: string | undefined) => (valueLabel ? `${label}, ${valueLabel}` : label),
} as const;
