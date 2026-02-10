<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <v-card elevation="8" rounded="xl" class="pa-6">
          <v-card-title class="text-h5 text-primary d-flex align-center">
            <v-icon class="mr-2">mdi-weather-cloudy</v-icon>
            Previsión del tiempo
          </v-card-title>

          <v-divider class="my-4" />

          <!-- Barra de búsqueda por ciudad -->
          <v-row class="mb-6">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="city"
                label="Buscar ciudad"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
                @keyup.enter="getWeatherByCity"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                color="primary"
                variant="tonal"
                block
                prepend-icon="mdi-crosshairs-gps"
                @click="getLocation"
                :loading="loadingGeo"
              >
                Mi ubicación
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-4" />

          <!-- Tabs para diferentes vistas -->
          <v-tabs v-model="activeTab" bg-color="primary" grow  class="weather-tabs mb-6">
            <v-tab value="current">
              <v-icon class="mr-1">mdi-weather-cloudy</v-icon>
              Clima actual
            </v-tab>
            <v-tab value="hourly">
              <v-icon class="mr-1">mdi-clock-time-three-outline</v-icon>
              Intervalos horarios
            </v-tab>
            <v-tab value="daily">
              <v-icon class="mr-1">mdi-calendar-week</v-icon>
              Próximos 5 días
            </v-tab>
            <v-tab value="details">
              <v-icon class="mr-1">mdi-information</v-icon>
              Detalles
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab" bg-color="primary" grow class="mb-6">
            <!-- Clima actual -->
            <v-window-item value="current">
              <v-card-text class="text-center">
               <div v-if="weather">
                  <h3 class="text-h6 mb-1">{{ locationLabel }}</h3>

                  <img
                    :src="iconUrl"
                    :alt="weather.weather[0].description"
                    width="100"
                    class="mb-2"
                  />

                  <p class="text-h4 font-weight-bold text-primary my-2">
                    {{ Math.round(weather.main.temp) }} °C
                  </p>

                  <p class="text-body-1 mb-4">
                    {{ weather.weather[0].description }}
                  </p>    
                  
                  <v-row justify="center" class="mb-4">
                    <v-col cols="6" md="3">
                      <div class="text-caption font-weight-medium">Sensación térmica</div>
                      <div class="text-subtitle-1">{{ Math.round(weather.main.feels_like) }} °C</div>
                   </v-col>
                    <v-col cols="6" md="3">
                      <div class="text-caption font-weight-medium">Humedad</div>
                      <div class="text-subtitle-1">{{ weather.main.humidity }}%</div>
                    </v-col>
                    <v-col cols="6" md="3">
                      <div class="text-caption font-weight-medium">Viento</div>
                      <div class="text-subtitle-1">{{ (weather.wind.speed * 3.6).toFixed(1) }} km/h</div>
                    </v-col>
                    <v-col cols="6" md="3">
                      <div class="text-caption font-weight-medium">Presión</div>
                      <div class="text-subtitle-1">{{ weather.main.pressure }} hPa</div>
                    </v-col>
                  </v-row>

                  <!-- Índice UV -->
                  <div v-if="uvData" class="mb-4">
                    <v-divider class="my-4" />
                    <div class="d-flex align-center justify-center">
                      <v-icon class="mr-2" :color="uvColor">mdi-white-balance-sunny</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">Índice UV: {{ uvData.value }}</span>
                      <v-chip size="small" :color="uvColor" class="ml-2">
                        {{ uvLevel }}
                      </v-chip>
                    </div>
                    <p class="text-caption text-center mt-1">{{ uvRecommendation }}</p>
                  </div>

                  <!-- Calidad del aire -->
                  <div v-if="airQuality">
                    <v-divider class="my-4" />
                    <div class="d-flex align-center justify-center">
                      <v-icon class="mr-2" :color="aqiColor">mdi-air-filter</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">Calidad del aire:</span>
                      <v-chip size="small" :color="aqiColor" class="ml-2">
                        {{ aqiLevel }}
                      </v-chip>
                    </div>
                  </div>
                </div>

                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mt-4"
                >
                  {{ error }}
                </v-alert>
              </v-card-text>
            </v-window-item>

            <!-- Tab: Previsión por hora -->
            <v-window-item value="hourly">
              <v-card-text>
                <div v-if="hourlyForecast.length === 0" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                  <p class="mt-4">Cargando previsión por hora...</p>
                </div>
                <v-row v-else>
                  <v-col
                    v-for="(hour, index) in hourlyForecast.slice(0, 24)"
                    :key="index"
                    cols="6"
                    sm="4"
                    md="3"
                    lg="2"
                  >
                  <v-card
                      variant="outlined"
                      class="pa-3 text-center"
                      :color="index === 0 ? 'primary-lighten-5' : ''"
                    >
                    <div class="text-caption font-weight-medium mb-1">
                        {{ formatHour(hour.dt) }}
                      </div>
                      <img
                        :src="`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
                        :alt="hour.weather[0].description"
                        width="40"
                        class="mb-1"
                      />
                      <div class="text-subtitle-1 font-weight-bold">
                        {{ Math.round(hour.main.temp) }}°
                      </div>
                      <div class="text-caption">
                        {{ Math.round(hour.main.feels_like) }}°
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-window-item>

            <!-- Tab: Previsión de 5 días -->
            <v-window-item value="daily">
              <v-card-text>
                <div v-if="dailyForecast.length === 0" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                  <p class="mt-4">Cargando previsión de 5 días...</p>
                </div>
                <v-timeline v-else density="compact" side="end">
                  <v-timeline-item
                    v-for="(day, index) in dailyForecast"
                    :key="index"
                    :dot-color="getDayColor(index)"
                    size="small"
                  >
                  <v-card variant="outlined" class="pa-4">
                      <v-row align="center">
                        <v-col cols="12" md="3" class="text-center">
                          <div class="text-h6 font-weight-bold">
                            {{ formatDay(day.dt) }}
                          </div>
                          <div class="text-caption">
                            {{ getDayOfWeek(day.dt) }}
                          </div>
                        </v-col>
                        <v-col cols="12" md="3" class="text-center">
                          <img
                            :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                            :alt="day.weather[0].description"
                            width="60"
                          />
                          <div class="text-caption">{{ day.weather[0].description }}</div>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-row>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Máx</div>
                              <div class="text-h6 font-weight-bold" :class="getTempColor(day.temp.max)">
                                {{ Math.round(day.temp.max) }}°
                              </div>
                            </v-col>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Mín</div>
                              <div class="text-h6 font-weight-bold" :class="getTempColor(day.temp.min)">
                                {{ Math.round(day.temp.min) }}°
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-row>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Humedad</div>
                              <div>{{ day.humidity }}%</div>
                            </v-col>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Viento</div>
                              <div>{{ (day.wind_speed * 3.6).toFixed(1) }} km/h</div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-window-item>

            <!-- Tab: Detalles adicionales -->
            <v-window-item value="details">
              <v-card-text>
                <div v-if="!weather" class="text-center py-8">
                  <p class="text-subtitle-1">Selecciona una ubicación para ver los detalles</p>
                </div>

                <div v-else>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card variant="tonal" class="pa-4 mb-4">
                        <v-card-title class="text-h6">
                          <v-icon class="mr-2">mdi-map-marker</v-icon>
                        Ubicación
                        </v-card-title>
                        <v-card-text>
                          <p class="text-subtitle-1 mb-1">{{ weather.name }}, {{ weather.sys.country }}</p>
                          <p class="text-caption mb-0">
                            Lat: {{ weather.coord.lat.toFixed(4) }} | 
                            Lon: {{ weather.coord.lon.toFixed(4) }}
                          </p>
                        </v-card-text>
                      </v-card>

                      <v-card variant="tonal" class="pa-4 mb-4">
                        <v-card-title class="text-h6">
                          <v-icon class="mr-2">mdi-thermometer</v-icon>
                          Temperatura
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Temperatura actual</div>
                              <div class="text-h6">{{ Math.round(weather.main.temp) }}°C</div>
                            </v-col>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Sensación térmica</div>
                              <div class="text-h6">{{ Math.round(weather.main.feels_like) }}°C</div>
                            </v-col>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Mínima</div>
                              <div class="text-subtitle-1">{{ Math.round(weather.main.temp_min) }}°C</div>
                            </v-col>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Máxima</div>
                              <div class="text-subtitle-1">{{ Math.round(weather.main.temp_max) }}°C</div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="tonal" class="pa-4 mb-4">
                        <v-card-title class="text-h6">
                          <v-icon class="mr-2">mdi-water</v-icon>
                          Humedad y Presión
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="6">
                              <div class="text-caption font-weight-medium">Humedad</div>
                              <div class="text-h6">{{ weather.main.humidity }}%</div>
                            </v-col>
                             <v-col cols="6">
                              <div class="text-caption font-weight-medium">Presión</div>
                              <div class="text-h6">{{ weather.main.pressure }} hPa</div>
                            </v-col>
                            <v-col cols="12" v-if="weather.visibility !== undefined">
                              <div class="text-caption font-weight-medium">Visibilidad</div>
                              <div class="text-subtitle-1">{{ (weather.visibility / 1000).toFixed(1) }} km</div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>

                      <v-card variant="tonal" class="pa-4" v-if="airQuality">
                        <v-card-title class="text-h6">
                          <v-icon class="mr-2">mdi-molecule</v-icon>
                          Contaminantes
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="6" v-for="(value, pollutant) in airQuality.list?.[0]?.components" :key="pollutant">
                              <div class="text-caption font-weight-medium">{{ getPollutantName(pollutant) }}</div>
                              <div class="text-subtitle-2">{{ value }} µg/m³</div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Alertas meteorológicas -->
                  <div v-if="alerts.length > 0" class="mt-4">
                    <v-card-title class="text-h6">
                      <v-icon class="mr-2">mdi-alert</v-icon>
                      Alertas meteorológicas
                    </v-card-title>
                    <v-alert
                      v-for="(alert, index) in alerts"
                      :key="index"
                      :type="getAlertType(alert.event)"
                      variant="tonal"
                      class="mb-2"
                    >
                    <template v-slot:title>
                        {{ alert.event }}
                      </template>
                      <template v-slot:text>
                        <div class="text-caption">
                          {{ formatAlertTime(alert.start) }} - {{ formatAlertTime(alert.end) }}
                        </div>
                        <div class="mt-2">{{ alert.description }}</div>
                      </template>
                    </v-alert>
                  </div>
                </div>
              </v-card-text>
            </v-window-item>
          </v-window>

          <!-- Error general -->
          <v-card-text v-if="error && activeTab === 'current'" class="text-center">
            <v-alert type="error" variant="tonal">
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { trunkSelectStrategy } from 'vuetify/lib/composables/nested/selectStrategies'

const city = ref('')
const weather = ref(null)
const loading = ref(false)
const loadingGeo = ref(false)
const error = ref(null)
const locationType = ref('') // 'geo' | 'city'
const activeTab = ref('current')
const uvData = ref(null)
const airQuality = ref(null)
const hourlyForecast = ref([])
const dailyForecast = ref([])
const alerts = ref([])

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
  loadingGeo.value = true
  error.value = null

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al obtener el clima')
    }

    weather.value = await res.json()
    locationType.value = 'geo'

    // Ahora vamos a obtener algunos datos adicionales
    await fetchAdditionalData(lat, lon)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
    loadingGeo.value = false
  }
}

// Clima por ciudad
async function getWeatherByCity() {
  if (!city.value.trim()) return

  loading.value = true
  error.value = null

  try {
    const cityEncoded = encodeURIComponent(city.value)

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityEncoded}&units=metric&lang=es&appid=${API_KEY}`
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Ciudad no encontrada')
    }

    weather.value = await res.json()
    locationType.value = 'city'

    // Obtenemos datos adicionales
    await fetchAdditionalData(weather.value.coord.lat, weather.value.coord.long)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Obtener ubicación actual
function getLocation() {
  if (!navigator.geolocation) {
    error.value = 'Geolocalización no soportada por tu navegador'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      getWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      )
    },
    (err) => {
      error.value = 'No se pudo obtener tu ubicación. Verifica los permisos.'
      console.error('Error de geolocalización:', err)
    }
  )
}

// Obtener datos adicionales (UV, aire, previsión)
async function fetchAdditionalData(lat, lon) {
  try {
    // Índice UV
    const uvRes = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    )
    if (uvRes.ok) {
      uvData.value = await uvRes.json()
    }

    // Calidad del aire
    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    )
    if (airRes.ok) {
      airQuality.value = await airRes.json()
    }

    // Previsión de 5 días / 3 horas
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    )
    if (forecastRes.ok) {
      const forecastData = await forecastRes.json()
      
      // Previsión por hora (primeras 24 horas)
      hourlyForecast.value = forecastData.list.slice(0, 24)
      
      // Previsión diaria (agrupar por día)
      dailyForecast.value = processDailyForecast(forecastData.list)
    }

    // One Call API para alertas (puede no estar disponible con API key gratuita)
    try {
      const oneCallRes = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&units=metric&lang=es&appid=${API_KEY}`
      )
      if (oneCallRes.ok) {
        const oneCallData = await oneCallRes.json()
        alerts.value = oneCallData.alerts || []
      }
    } catch (oneCallError) {
      console.log('One Call API no disponible con esta clave')
    }

  } catch (err) {
    console.error('Error al obtener datos adicionales:', err)
  }
}

// Procesar previsión diaria
function processDailyForecast(forecastList) {
  const days = {}
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toISOString().split('T')[0]

    if (!days[dayKey]) {
      days[dayKey] = {
        dt: item.dt,
        temp: {
          max: item.main.temp_max,
          min: item.main.temp_min
        },
        weather: item.weather,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pressure: item.main.pressure
      }
    } else {
      days[dayKey].temp.max = Math.max(days[dayKey].temp.max, item.main.temp_max)
      days[dayKey].temp.min = Math.min(days[dayKey].temp.min, item.main.temp_min)
    }
  })
  
  return Object.values(days).slice(1, 6) // Excluir hoy y tomar próximos 5 días
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

// Índice UV - color y nivel
const uvColor = computed(() => {
  if (!uvData.value) return 'gray'
  const value = uvData.value.value
  if (value <= 2) return 'green'
  if (value <= 5) return 'yellow'
  if (value <= 7) return 'orange'
  if (value <= 10) return 'red'
  return 'purple'
})

const uvLevel = computed(() => {
  if (!uvData.value) return ''
  const value = uvData.value.value
  if (value <= 2) return 'Bajo'
  if (value <= 5) return 'Moderado'
  if (value <= 7) return 'Alto'
  if (value <= 10) return 'Muy alto'
  return 'Extremo'
})

const uvRecommendation = computed(() => {
  if (!uvData.value) return ''
  const value = uvData.value.value
  if (value <= 2) return 'Puedes estar al aire libre sin protección.'
  if (value <= 5) return 'Usa protector solar si estarás mucho tiempo al aire libre.'
  if (value <= 7) return 'Protección solar necesaria. Busca sombra en horas centrales.'
  if (value <= 10) return 'Protección extra necesaria. Evita el sol entre 10am y 4pm.'
  return 'Protección máxima. Permanece en interiores durante las horas centrales.'
})

// Calidad del aire - color y nivel
const aqiColor = computed(() => {
  if (!airQuality.value?.list?.[0]) return 'gray'
  const aqi = airQuality.value.list[0].main.aqi
  const colors = ['green', 'yellow', 'orange', 'red', 'purple']
  return colors[aqi - 1] || 'gray'
})

const aqiLevel = computed(() => {
  if (!airQuality.value?.list?.[0]) return ''
  const aqi = airQuality.value.list[0].main.aqi
  const levels = ['Bueno', 'Razonable', 'Moderado', 'Malo', 'Muy malo']
  return levels[aqi - 1] || 'Desconocido'
})

// Formateo de fechas
const formatHour = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDay = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short' 
  })
}

const getDayOfWeek = (timestamp) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[new Date(timestamp * 1000).getDay()]
}

const formatAlertTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Colores y utilidades
const getDayColor = (index) => {
  const colors = ['blue', 'green', 'orange', 'purple', 'red']
  return colors[index] || 'gray'
}

const getTempColor = (temp) => {
  if (temp < 0) return 'text-blue'
  if (temp < 10) return 'text-cyan'
  if (temp < 20) return 'text-green'
  if (temp < 30) return 'text-orange'
  return 'text-red'
}

const getPollutantName = (key) => {
  const names = {
    'co': 'CO',
    'no': 'NO',
    'no2': 'NO₂',
    'o3': 'O₃',
    'so2': 'SO₂',
    'pm2_5': 'PM2.5',
    'pm10': 'PM10',
    'nh3': 'NH₃'
  }
  return names[key] || key
}

const getAlertType = (event) => {
  const lowerEvent = event.toLowerCase()
  if (lowerEvent.includes('tormenta') || lowerEvent.includes('severe')) return 'error'
  if (lowerEvent.includes('lluvia') || lowerEvent.includes('rain')) return 'warning'
  if (lowerEvent.includes('calor') || lowerEvent.includes('heat')) return 'error'
  if (lowerEvent.includes('frío') || lowerEvent.includes('cold')) return 'info'
  return 'warning'
}
</script>