<!-- API Key: 1fda55c0d07b342bd557378b871d9e93 -->
<!-- API Key 2: f44cdc3a6cb7004fb91e1823eefe953e -->
<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="8" rounded="xl" class="pa-6 text-center">
          <v-card-title class="text-h5 text-primary">
            Clima actual
          </v-card-title>

          <v-divider class="my-4" />

          <!-- Búsqueda por ciudad -->
          <v-text-field
            v-model="city"
            label="Buscar ciudad"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            @keyup.enter="getWeatherByCity"
          />

          <v-btn
            color="primary"
            class="mb-4"
            @click="getWeatherByCity"
            :loading="loading"
          >
            Buscar
          </v-btn>

          <v-divider class="my-4" />

          <!-- Resultado -->
          <div v-if="weather">
            <h3 class="text-h6 mb-1">{{ locationLabel }}</h3>

            <img
              :src="iconUrl"
              alt="icono clima"
              width="80"
            />

            <p class="text-body-1">
              {{ weather.weather[0].description }}
            </p>

            <p class="text-h5 text-primary">
              {{ weather.main.temp }} °C
            </p>

            <p class="text-body-2 text-secondary">
              Sensación térmica: {{ weather.main.feels_like }} °C
            </p>
          </div>

          <!-- Error -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const city = ref('')
const weather = ref(null)
const loading = ref(false)
const error = ref(null)
const locationType = ref('') // 'geo' | 'city'

const API_KEY = '1fda55c0d07b342bd557378b871d9e93'

// Al montar el componente → geolocalización
onMounted(() => {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    (position) => {
      getWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      )
    },
    () => {
      // Si el usuario rechaza permisos, no pasa nada
      console.info('Geolocalización no permitida')
    }
  )
})

// Clima por coordenadas
async function getWeatherByCoords(lat, lon) {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message)
    }

    weather.value = await res.json()
    locationType.value = 'geo'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Clima por ciudad
async function getWeatherByCity() {
  if (!city.value) return

  loading.value = true
  error.value = null

  try {
    const cityEncoded = encodeURIComponent(city.value)

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityEncoded}&units=metric&lang=es&appid=${API_KEY}`
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message)
    }

    weather.value = await res.json()
    locationType.value = 'city'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Texto según origen
const locationLabel = computed(() => {
  if (!weather.value) return ''
  return locationType.value === 'geo'
    ? `Tu ubicación · ${weather.value.name}`
    : weather.value.name
})

// Icono
const iconUrl = computed(() => {
  if (!weather.value) return ''
  return `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@2x.png`
})
</script>