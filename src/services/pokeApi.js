// Servicio que se comunica con la PokeAPI usando fetch
import { ASH_POKEMON } from '../utils/ashPokemon'

const API_URL = 'https://pokeapi.co/api/v2'

export const DECK_SIZE = 40
const BATCH_SIZE = 10 // peticiones al mismo tiempo, para no saturar la API

// Cachés en memoria: si un Pokémon o habilidad ya se pidió, no se vuelve a pedir
const abilityCache = new Map()
const pokemonCache = new Map()

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${url}`)
  }
  return response.json()
}

function capitalize(text) {
  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Mezcla una lista (Fisher-Yates)
function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Nombre y descripción en español de una habilidad
function getAbility(ability) {
  const { name, url } = ability

  if (!abilityCache.has(url)) {
    const request = getJson(url)
      .then((data) => {
        const nameEs = data.names.find((n) => n.language.name === 'es')
        const flavorEs = data.flavor_text_entries.filter((f) => f.language.name === 'es').pop()
        const effectEn = data.effect_entries.find((e) => e.language.name === 'en')

        return {
          name: nameEs?.name ?? capitalize(name),
          description: (flavorEs?.flavor_text ?? effectEn?.short_effect ?? 'Sin descripción.')
            .replace(/\s+/g, ' ')
            .trim()
        }
      })
      .catch(() => ({ name: capitalize(name), description: 'Sin descripción.' }))

    abilityCache.set(url, request)
  }

  return abilityCache.get(url)
}

// Consulta un Pokémon por id. Regresa null si no sirve para la carta.
async function fetchPokemon(id) {
  const data = await getJson(`${API_URL}/pokemon/${id}`)

  const image =
    data.sprites?.other?.['official-artwork']?.front_default ?? data.sprites?.front_default

  if (!image || data.abilities.length < 2) return null

  const abilities = await Promise.all(
    data.abilities.slice(0, 2).map(async ({ ability, is_hidden }) => ({
      ...(await getAbility(ability)),
      hidden: is_hidden
    }))
  )

  // Si falta una estadística se guarda null (la carta muestra "?")
  const stat = (statName) => data.stats.find((s) => s.stat.name === statName)?.base_stat ?? null

  return {
    id: data.id,
    name: capitalize(data.name),
    image,
    types: data.types.map((t) => t.type.name),
    height: data.height / 10, // decímetros -> metros
    weight: data.weight / 10, // hectogramos -> kilogramos
    baseExperience: data.base_experience ?? null,
    stats: {
      hp: stat('hp'),
      attack: stat('attack'),
      defense: stat('defense'),
      speed: stat('speed')
    },
    abilities
  }
}

export function getPokemon(id) {
  if (!pokemonCache.has(id)) {
    const request = fetchPokemon(id).catch((err) => {
      pokemonCache.delete(id) // si falló, se permite reintentar después
      throw err
    })
    pokemonCache.set(id, request)
  }
  return pokemonCache.get(id)
}

// Arma un deck con Pokémon de Ash al azar, sin repetir, pidiéndolos por lotes.
// Regresa { cards, missing } para poder avisar si faltaron cartas.
export async function getAshDeck(size = DECK_SIZE) {
  const pending = shuffle(ASH_POKEMON)
  const cards = []

  while (cards.length < size && pending.length > 0) {
    const batch = pending.splice(0, Math.min(BATCH_SIZE, size - cards.length))
    const results = await Promise.allSettled(batch.map(getPokemon))

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) cards.push(result.value)
    })
  }

  if (cards.length === 0) {
    throw new Error('No se pudo cargar ningún Pokémon. Revisa tu conexión a internet.')
  }

  return { cards, missing: size - cards.length }
}
