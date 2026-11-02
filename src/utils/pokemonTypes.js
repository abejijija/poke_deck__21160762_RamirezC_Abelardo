// Nombre en español y color de cada tipo
export const POKEMON_TYPES = {
  normal:   { name: 'Normal',    color: '#b5b09a' },
  fire:     { name: 'Fuego',     color: '#ff8a3d' },
  water:    { name: 'Agua',      color: '#4f9bff' },
  electric: { name: 'Eléctrico', color: '#ffd93b' },
  grass:    { name: 'Planta',    color: '#6fcf5b' },
  ice:      { name: 'Hielo',     color: '#8fe3e6' },
  fighting: { name: 'Lucha',     color: '#e0533d' },
  poison:   { name: 'Veneno',    color: '#b45fc9' },
  ground:   { name: 'Tierra',    color: '#d9b45a' },
  flying:   { name: 'Volador',   color: '#a3b5ff' },
  psychic:  { name: 'Psíquico',  color: '#ff6f9f' },
  bug:      { name: 'Bicho',     color: '#a8c93a' },
  rock:     { name: 'Roca',      color: '#c2b26a' },
  ghost:    { name: 'Fantasma',  color: '#8a72c4' },
  dragon:   { name: 'Dragón',    color: '#7a5cff' },
  dark:     { name: 'Siniestro', color: '#8a7062' },
  steel:    { name: 'Acero',     color: '#a9b8cc' },
  fairy:    { name: 'Hada',      color: '#f5a0cf' }
}

export function getTypeInfo(type) {
  return POKEMON_TYPES[type] ?? { name: type, color: '#b5b09a' }
}
