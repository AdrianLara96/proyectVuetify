<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card
            elevation="8"
            rounded="xl"
            class="pa-6 calendar-card"
        >
          <v-card-title class="text-h5 font-weight-bold text-primary">
            Calendario mensual de eventos
          </v-card-title>

          <v-divider class="my-4" color="accent" />

          <v-calendar
            v-model="focus"
            :events="events"
            type="month"
            color="primary"
            event-height="auto"
            class="calendar-large"
          >
            <!-- Slot de evento event personalizado -->
            <template #event="slotProps">
                <div
                    class="event-cell"
                    @click="openEvent(slotProps)"
                    style="cursor: pointer;"
                >
                <span class="event-title"> {{ slotProps.event.title }} </span>
                </div>
            </template>
          </v-calendar>
        </v-card>
      </v-col>
    </v-row>

    <!-- Evento dialogo que se abre con @click -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="text-h6 text-primary">
          {{ selectedEvent?.title }}
        </v-card-title>

        <v-card-text>
          <p class="text-body-1 mb-2">
            📅 {{ formatDate(selectedEvent?.start) }}
          </p>
          <p class="text-body-2">
            {{ selectedEvent?.description }}
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const focus = ref(new Date().toISOString().substring(0, 10))
const dialog = ref(false)
const selectedEvent = ref(null)

const events = ref([
  {
    title: 'Revisión de proyecto',
    start: '2026-02-10',
    description: 'Revisión de avances del proyecto Vuetify',
    color: 'primary',
  },
  {
    title: 'Entrega borrador proyecto',
    start: '2026-02-15',
    description: 'Entrega final del módulo Vue + Vuetify',
    color: 'secondary',
  },
  {
    title: 'Aprender v-calendar',
    start: '2026-02-06',
    description: 'Explorar eventos interactivos en Vuetify',
    color: 'info',
  },
])

function openEvent(slotEvent) {
    selectedEvent.value = slotEvent.event || slotEvent
    dialog.value = true
}

// Formateo simple de fecha
function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
}
</script>