<template>
    <v-container class="py-8">
        <v-row>
            <v-col cols="12">
                <h2 class="text-h5 mb-4 text-primary">Pokédex</h2>
            </v-col>

            <!-- Buscador -->
            <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="search"
                    label="Nombre del Pokémon"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    clearable
                    @keyup.enter="searchPokemon"
                />
            </v-col>

            <!-- Botón: opción xs y opción normal -->


            <v-col cols="12" sm="6" md="2">
                <v-btn
                    v-if="$vuetify.display.xs || $vuetify.display.sm && $vuetify.display.width < 500"
                    color="primary"
                    class="mt-sm-0 mt-2"
                    block
                    @click="searchPokemon"
                    style="min-height: 48px;"
                >
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <v-btn
                    v-else
                    color="primary"
                    class="mt-sm-0 mt-2"
                    block
                    @click="searchPokemon"
                    style="white-space: normal; padding-top: 8px; padding-bottom: 8px;"
                >
                    <span class="text-wrap">Buscar Pokémon</span>
                </v-btn>
            
            </v-col>
    
            <v-divider/>
      
            <!-- Loading -->
            <v-col cols="12" class="text-center" v-if="loading">
                <v-progress-circular indeterminate size="48" />
            </v-col>

            <!-- Cards -->
            <template v-if="pokemons.length > 0">
                <v-col
                    v-for="pokemon in pokemons"
                    :key="pokemon.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                >
                    <v-card
                        elevation="6"
                        rounded="xl"
                        class="pa-4 text-center hover-card"
                        @click="openPokemon(pokemon)"
                    >
                        <v-img
                            :src="pokemon.image"
                            height="120"
                            contain
                            class="mb-2"
                        />

                            <h3 class="text-h6 text-capitalize">
                                {{ pokemon.name }}
                            </h3>

                            <div class="my-2">
                                <v-chip
                                    v-for="type in pokemon.types"
                                    :key="type"
                                    :color="typeColors[type] || 'grey'"
                                    class="ma-1"
                                    size="small"
                                    variant="outlined"
                                >
                                    {{ type }}
                                </v-chip>
                            </div>

                            <v-chip variant="outlined" size="small">
                                #{{ pokemon.id }}
                            </v-chip>
                        </v-card>
                    </v-col>
                </template>

                <!-- Mensaje de error si no se encuentra el Pokémon -->
                <v-col
                    v-else-if="search && pokemons.length === 0 && !loading"
                    cols="12"
                    sm="8"
                    offset-sm="2"
                    md="6"
                    offset-md="3"
                >
                    <v-card class="pa-6 text-center elevation-4">
                        <v-card-title class="text-h6 text--primary">
                            Pokémon no encontrado
                        </v-card-title>
                        <v-card-text class="text-body-1">
                            No se encontró ningún Pokémon con el nombre "{{ search }}".
                        </v-card-text>
                        <v-icon size="64" color="warning">
                            mdi-alert-circle-outline
                        </v-icon>
                    </v-card>
                </v-col>

                <!-- Contador de páginas -->
                <v-col cols="12" class="d-flex justify-center mt-6">
                    <div class="text-body-2">
                    Página {{ currentPage }} de {{ totalPages }}
                    </div>
                </v-col>
                <!-- Controles de paginación -->
                <v-col cols="12" class="d-flex justify-center mt-2">
                    <v-btn
                        :disabled="!previousUrl"
                        @click="fetchByUrl(previousUrl)"
                        color="secondary"
                        variant="outlined"
                        class="mx-2"
                    >
                        <v-icon v-if="$vuetify.display.xs">mdi-chevron-left</v-icon>
                        <span v-else>Anterior</span>
                    </v-btn>

                    <v-btn
                        :disabled="!nextUrl"
                        @click="fetchByUrl(nextUrl)"
                        color="primary"
                        variant="flat"
                        class="mx-2"
                    >
                        <v-icon v-if="$vuetify.display.xs">mdi-chevron-right</v-icon>
                        <span v-else>Siguiente</span>
                    </v-btn>
                </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="500">
        <v-card v-if="selectedPokemon">
            <v-card-title class="text-h5 text-primary text-capitalize">
                {{ selectedPokemon.name }} #{{ selectedPokemon.id }}
            </v-card-title>
            
            <v-divider />
            
            <v-card-text class="text-center">
                <div class="d-flex justify-center my-4">
                    <v-img
                        :src="selectedPokemon.image"
                        max-width="200"
                        contain
                    />
                </div>
                <div class="mb-2 text-center">
                    <v-chip
                        v-for="type in selectedPokemon.types"
                        :key="type"
                        :color="typeColors[type] || 'grey'"
                        dark
                        class="ma-1"
                    >
                        {{ type }}
                    </v-chip>
                </div>

                <v-row class="mt-4" dense>
                    <v-col cols="6">
                        <strong>Altura:</strong> {{ selectedPokemon.height / 10 }} m
                    </v-col>
                    <v-col cols="6">
                        <strong>Peso:</strong> {{ selectedPokemon.weight / 10 }} kg
                    </v-col>
                </v-row>

                <v-divider class="my-2" />

                <div v-for="stat in selectedPokemon.stats" :key="stat.name" class="my-2 d-flex align-center justify-center">
                    <span class="text-subtitle-2 text-capitalize me-2" style="width: 80px;">
                        {{ stat.name }}
                    </span>

                    <div style="width: 150px; height: 16px; background: #e0e0e0; border-radius: 12px; overflow: hidden; margin-right: 8px;">
                        <div
                        :style="{
                            width: (stat.value / 255 * 100) + '%',
                            background: '#AEDDFF', /* tu color principal claro */
                            height: '100%',
                            borderRadius: '12px',
                            transition: 'width 0.3s'
                        }"
                        ></div>
                    </div>

                    <span class="text-subtitle-2 font-weight-medium" style="width: 30px;">
                        {{ stat.value }}
                    </span>
                </div>

            </v-card-text>
            <v-card-actions>
        
                <v-spacer />
        
                <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-else class="pa-6 text-center">
            <v-progress-circular indeterminate size="48" />
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const pokemons = ref([])
const search = ref('')
const loading = ref(false)
const dialog = ref(false)
const selectedPokemon = ref(null)

// Estados para la paginación con los enlaces que proporciona la API
const nextUrl = ref(null)
const previousUrl = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

const limit = 16    // Definimos el tamaño de página

// definimos mapa de colores por tipo
const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
}

onMounted(() => {
    fetchByUrl('https://pokeapi.co/api/v2/pokemon')
})

async function fetchByUrl(url) {
    if (!url) return

    loading.value = true
    pokemons.value = []

    try {
        const res = await fetch(url)
        const data = await res.json()

        // Actualizamos los enlaces de la paginación
        nextUrl.value = data.next
        previousUrl.value = data.previous 

        // Calculamos página actual y total
        const offset = new URLSearchParams(new URL(url).search).get('offset') || 0
        currentPage.value = Math.floor(offset / limit) + 1
        totalPages.value = Math.ceil(data.count / limit)

        const detailed = await Promise.all(
            data.results.map(p => fetch(p.url).then(r => r.json()))
        )

        pokemons.value = detailed.map(p => ({
            id: p.id,
            name: p.name,
            image: p.sprites.other['official-artwork'].front_default,
            types: p.types.map(t => t.type.name),
        }))
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

async function searchPokemon() {
    if (!search.value) {
        
        // Si limpiamos búsqueda, volvemos a la primera página
        fetchByUrl('https://pokeapi.co/api/v2/pokemon/')
        return
    }

    loading.value = true
    pokemons.value = []

    try {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${search.value.toLowerCase()}`
        )

        if (!res.ok) throw new Error('Pokémon no encontrado')

        const p = await res.json()

        pokemons.value = [{
            id: p.id,
            name: p.name,
            image: p.sprites.other['official-artwork'].front_default,
            types: p.types.map(t => t.type.name),
        }]
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

async function openPokemon(pokemon) {
    dialog.value = true
    selectedPokemon.value = null // reseteamos antes

    try {
        const identifier = pokemon.id || pokemon.name
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier.toString()}`)

        if (!res.ok) throw new Error('No se pudo cargar la información del Pokémon')

        const data = await res.json()

        selectedPokemon.value = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map(t => t.type.name),
        stats: data.stats.map(s => ({ name: s.stat.name, value: Number(s.base_stat) || 0 })),
        height: data.height,
        weight: data.weight,
        }
    } catch (err) {
        console.error(err)
        dialog.value = false
    }
}
</script>