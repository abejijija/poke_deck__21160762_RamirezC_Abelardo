<script setup>
import { computed } from 'vue'
import { getTypeInfo } from '../utils/pokemonTypes'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const types = computed(() => props.pokemon.types.map(getTypeInfo))
const mainType = computed(() => types.value[0])

// Número de Pokédex con formato: 25 -> 025
const formattedId = computed(() => String(props.pokemon.id).padStart(3, '0'))

// El color del tipo principal pinta la carta
const cardStyle = computed(() => ({ '--type-color': mainType.value.color }))

// Las estadísticas se dibujan como barras (el máximo base es 255)
const stats = computed(() => {
  const s = props.pokemon.stats
  return [
    { label: 'Ataque', value: s.attack },
    { label: 'Defensa', value: s.defense },
    { label: 'Velocidad', value: s.speed }
  ].map((item) => ({
    ...item,
    percent: item.value === null ? 0 : Math.min(100, Math.round((item.value / 255) * 100))
  }))
})

const show = (value) => (value === null ? '?' : value)
</script>

<template>
  <article class="pokemon-card" :style="cardStyle">
    <header class="card-top">
      <span class="card-number">#{{ formattedId }}</span>
      <h2 class="card-name">{{ pokemon.name }}</h2>
      <span class="card-hp">{{ show(pokemon.stats.hp) }} PS</span>
    </header>

    <figure class="card-image">
      <img :src="pokemon.image" :alt="pokemon.name" loading="lazy" />
    </figure>

    <div class="card-types">
      <span
        v-for="type in types"
        :key="type.name"
        class="type-badge"
        :style="{ backgroundColor: type.color }"
      >
        {{ type.name }}
      </span>
    </div>

    <p class="card-size">{{ pokemon.height }} m de alto y {{ pokemon.weight }} kg de peso</p>

    <section class="card-abilities">
      <div v-for="(ability, index) in pokemon.abilities" :key="index" class="ability">
        <h3>
          {{ ability.name }}
          <small v-if="ability.hidden">(oculta)</small>
        </h3>
        <p>{{ ability.description }}</p>
      </div>
    </section>

    <ul class="card-stats">
      <li v-for="item in stats" :key="item.label">
        <span class="stat-label">{{ item.label }}</span>
        <span class="stat-bar"><span class="stat-fill" :style="{ width: item.percent + '%' }"></span></span>
        <strong class="stat-value">{{ show(item.value) }}</strong>
      </li>
    </ul>

    <p class="card-exp">Experiencia base: {{ show(pokemon.baseExperience) }}</p>
  </article>
</template>

<style scoped src="../styles/pokemon-card.css"></style>
