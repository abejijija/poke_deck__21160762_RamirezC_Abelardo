# Deck de Ash

Aplicación hecha con **Vue 3** y **Vite** que arma un deck de **40 cartas** con Pokémon que Ash ha tenido en sus viajes, usando `fetch` y la [PokeAPI](https://pokeapi.co/).

## Qué muestra cada carta
- Nombre, número de Pokédex y PS
- Imagen oficial
- Tipo(s) en español
- 2 habilidades con su descripción en español
- Ataque, defensa y velocidad (en barras), altura, peso y experiencia base

## Cómo funciona
1. `src/utils/ashPokemon.js` tiene la lista de Pokémon de Ash (por id).
2. Se mezcla la lista y se toman 40, sin repetir.
3. Se piden a la PokeAPI en lotes de 10 (no todos a la vez).
4. Si un Pokémon no tiene imagen o tiene menos de 2 habilidades, se pide otro de la lista.
5. Los Pokémon y habilidades ya consultados se guardan en memoria para no repetir peticiones.
6. Si no se logran las 40 cartas, la pantalla avisa.

## Instalación
```bash
npm install
npm run dev
```
Abrir la dirección que muestra Vite (normalmente http://localhost:5173).

## Estructura
```
src/
├── components/PokemonCard.vue
├── services/pokeApi.js
├── styles/ (main.css, deck.css, pokemon-card.css)
├── utils/ (ashPokemon.js, pokemonTypes.js)
├── views/DeckView.vue
├── App.vue
└── main.js
```
