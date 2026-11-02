<script setup>
import { ref, computed, onMounted } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import { getAshDeck, DECK_SIZE } from '../services/pokeApi'

const deck = ref([])
const missing = ref(0)
const loading = ref(false)
const error = ref('')

const statusText = computed(() =>
  loading.value ? 'Armando el deck...' : `${deck.value.length} de ${DECK_SIZE} cartas`
)

async function loadDeck() {
  loading.value = true
  error.value = ''
  missing.value = 0

  try {
    const result = await getAshDeck(DECK_SIZE)
    deck.value = result.cards
    missing.value = result.missing
  } catch (err) {
    error.value = err.message
    deck.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadDeck)
</script>

<template>
  <main class="deck-view">
    <header class="deck-header">
      <div class="deck-cap" aria-hidden="true"></div>
      <div class="deck-heading">
        <h1 class="deck-title">El deck de Ash</h1>
        <p class="deck-subtitle">
          40 Pokémon que Ash ha tenido en sus viajes, elegidos al azar.
        </p>
      </div>

      <div class="deck-actions">
        <span class="deck-counter" aria-live="polite">{{ statusText }}</span>
        <button class="deck-button" :disabled="loading" @click="loadDeck">
          {{ loading ? 'Cargando...' : 'Barajar de nuevo' }}
        </button>
      </div>
    </header>

    <!-- Error -->
    <div v-if="error" class="deck-error" role="alert">
      <p>{{ error }}</p>
      <button class="deck-button" @click="loadDeck">Intentar otra vez</button>
    </div>

    <!-- Cargando: se muestran huecos para las cartas -->
    <section v-else-if="loading" class="deck-grid" aria-busy="true">
      <div v-for="n in DECK_SIZE" :key="n" class="card-placeholder">
        <span class="card-placeholder-ball"></span>
      </div>
    </section>

    <!-- Deck -->
    <template v-else>
      <p v-if="missing > 0" class="deck-warning">
        Solo se pudieron cargar {{ deck.length }} cartas ({{ missing }} no respondieron).
        Pulsa "Barajar de nuevo" para intentarlo otra vez.
      </p>
      <section class="deck-grid">
        <PokemonCard v-for="pokemon in deck" :key="pokemon.id" :pokemon="pokemon" />
      </section>
    </template>
  </main>
</template>

<style scoped src="../styles/deck.css"></style>
