<template>
    <v-row class="fill-height">
        <v-col>
            <!-- Encabezado del calendario -->
            <v-sheet height="64">
                <v-toolbar flat>
                <v-btn
                    class="me-4"
                    color="grey-darken-2"
                    variant="outlined"
                    @click="setToday"
                >
                    Today
                </v-btn>
                <v-btn
                    color="grey-darken-2"
                    size="small"
                    variant="text"
                    icon
                    @click="prev"
                >
                    <v-icon size="small">
                    mdi-chevron-left
                    </v-icon>
                </v-btn>
                <v-btn
                    color="grey-darken-2"
                    size="small"
                    variant="text"
                    icon
                    @click="next"
                >
                    <v-icon size="small">
                    mdi-chevron-right
                    </v-icon>
                </v-btn>
                <v-toolbar-title v-if="calendar">
                    {{ calendar.title }}
                </v-toolbar-title>
                <v-menu location="bottom end">
                    <template v-slot:activator="{ props }">
                    <v-btn
                        color="grey-darken-2"
                        variant="outlined"
                        v-bind="props"
                    >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon end>
                        mdi-menu-down
                        </v-icon>
                    </v-btn>
                    </template>
                    <v-list>
                    <v-list-item @click="type = 'day'">
                        <v-list-item-title>Diario</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                        <v-list-item-title>Semanal</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                        <v-list-item-title>Mensual</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 días</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
                </v-toolbar>
            </v-sheet>

            <!-- Calendario -->
            <v-sheet height="600">
                <v-calendar
                    ref="calendar"
                    v-model="focus"
                    :event-start="eventStart"
                    :event-end="eventEnd"
                    :event-color="getEventColor"
                    :events="formattedEvents"
                    :type="type"
                    color="primary"
                    @click:date="viewDay"
                    @click:event="showEvent"
                    @click:more="viewDay"
                />
                <v-menu
                    v-model="selectedOpen"
                    :activator="selectedElement"
                    :close-on-content-click="false"
                    location="end"
                >
                    <v-card
                        color="grey-lighten-4"
                        min-widht="350px"
                        flat
                    >
                    <v-toolbar
                        :color="selectedEvent.color"
                        dark
                    >
                        <v-btn icon @click="editEvent(selectedEvent)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                            <v-btn icon @click="deleteSelectedEvent">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <span v-html="selectedEvent.details || ''"></span>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                color="secondary"
                                variant="text"
                                @click="selectedOpen = false"
                            > 
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-sheet>
        </v-col>
    </v-row>

    <!-- Diálogo para crear/editar eventos -->
    <v-dialog
        v-model="dialogEdit"
        max-width="500px"
    >
        <v-card>

            <v-card-title>
                {{ editingEvent.id ? 'Edit Event' : 'New Event' }}
            </v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="editingEvent.name"
                    label="Event Name"
                    required
                ></v-text-field>
                <v-textarea
                    v-model="editingEvent.details"
                    label="Details"
                ></v-textarea>
                <v-select
                    v-model="editingEvent.color"
                    :items="colorOptions"
                    label="Color"
                    item-value="value"
                    item-title="text"
                    :return-object="false"
                ></v-select>
                <v-checkbox
                    v-model="editingEvent.allDay"
                    label="All Day Event"
                ></v-checkbox>

                <div class="d-flex flex-wrap">
                    <div class="flex-fill mr-2">
                        <label class="text-caption">Start Date</label> <!-- Añadir fecha de inicio del evento -->
                        <v-text-field
                            v-model="editingEvent.startDate"
                            type="date"
                            density="compact"
                        ></v-text-field>
                    </div>
                    
                    <div class="flex-fill mr-2" v-show="!editingEvent.allDay">
                        <label class="text-caption">Start Time</label> <!-- Añadir hora de inicio del evento -->
                        <v-text-field
                            v-model="editingEvent.startTime"
                            type="time"
                            density="compact"
                        ></v-text-field>
                    </div>
                </div>

                <div class="d-flex flex-wrap mt-4">
                    <div class="flex-fill mr-2">
                        <label class="text-caption">End Date</label>
                            <v-text-field
                                v-model="editingEvent.endDate"
                                type="date"
                                density="compact"
                            ></v-text-field>
                    </div>

                    <div class="flex-fill ml-2" v-show="!editingEvent.allDay">
                        <label class="text-caption">End Time</label>
                        <v-text-field
                            v-model="editingEvent.endTime"
                            type="time"
                            density="compact"
                        ></v-text-field>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="dialogEdit = false"
                >
                    Cancel  <!-- Cancelar edición/adicción de evento -->
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="saveEvent"
                >
                    Save <!-- Editar/Añadir evento -->
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Botón flotante para añadir eventos -->
    <div class="floating-button-container">
        <v-btn
            icon="mdi-plus"
            size="large"
            color="primary"
            variant="elevated"
            @click="openAddEventForm"
        />
    </div>

    <!-- <template>
                <div class="pa-4 text-center dialog-editar">
                    <v-dialog
                    v-model="dialog"
                    max-width="600"
                    >
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn
                        class="text-none font-weight-regular"
                        prepend-icon="mdi-account"
                        text="Edit Profile"
                        variant="tonal"
                        v-bind="activatorProps"
                        ></v-btn>
                    </template>

                    <v-card
                        prepend-icon="mdi-account"
                        title="User Profile"
                    >
                        <v-card-text>
                        <v-row dense>
                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                label="First name*"
                                required
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                hint="example of helper text only on focus"
                                label="Middle name"
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                hint="example of persistent helper text"
                                label="Last name*"
                                persistent-hint
                                required
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                label="Email*"
                                required
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                label="Password*"
                                type="password"
                                required
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                label="Confirm Password*"
                                type="password"
                                required
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            sm="6"
                            >
                            <v-select
                                :items="['0-17', '18-29', '30-54', '54+']"
                                label="Age*"
                                required
                            ></v-select>
                            </v-col>

                            <v-col
                            cols="12"
                            sm="6"
                            >
                            <v-autocomplete
                                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                label="Interests"
                                auto-select-first
                                multiple
                            ></v-autocomplete>
                            </v-col>
                        </v-row>

                        <small class="text-caption text-medium-emphasis">*indicates required field</small>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            text="Close"
                            variant="plain"
                            @click="dialog = false"
                        ></v-btn>

                        <v-btn
                            color="primary"
                            text="Save"
                            variant="tonal"
                            @click="dialog = false"
                        ></v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </div>
                </template>

        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :activator="selectedElement"
          :close-on-content-click="false"
          location="end"
        >
          <v-card
            color="grey-lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="secondary"
                variant="text"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row> -->

</template>

<script setup>
import { onMounted, ref, shallowRef, computed, watch } from 'vue'

const dialogEdit = shallowRef(false)
const calendar = ref()

// Definimos biblioteca de colores
const colorOptions = [
    { text: 'Blue', value: 'blue' },
    { text: 'Red', value: 'red' },
    { text: 'Green', value: 'green' },
    { text: 'Purple', value: 'purple' },
    { text: 'Orange', value: 'orange' },
    { text: 'Pink', value: 'pink' },
    { text: 'Teal', value: 'teal' }
]

const typeToLabel = {  
    month: 'Mensual',
    week: 'Semanal',
    day: 'Diario',
    '4day': '4 Días',
}
const focus = ref('')
const type = ref('month')
const selectedEvent = ref({})
const selectedElement = ref(null)
const selectedOpen = ref(false)
const rawEvents = ref([])
const editingEvent = ref({
    id: null,
    name: '',
    details: '',
    startDate: '',
    endDate: '',
    startTime: null,
    endTime: null,
    allDay: true,
    color: 'blue'
})

// Formatear eventos para que el calendario los lea correctamente
const formattedEvents = computed(() => {
  return rawEvents.value.map(event => {
    let start = event.start
    let end = event.end

    if (typeof start === 'string' && start.includes('T')) {
        const date = new Date(start)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        start = `${year}-${month}-${day} ${hours}:${minutes}`
    }

    if (typeof end === 'string' && end.includes('T')) {
        const date = new Date(end)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        end = `${year}-${month}-${day} ${hours}:${minutes}`
    }

    return {
        id: event.id,
      name: event.name,
      start: start,
      end: end,
      color: event.color,
      timed: event.timed,
      details: event.details
    }
  })
})

const eventStart = ref('start')
const eventEnd = ref('end')

onMounted(() => { // Evento desde el localStorage para inicializar
    const savedEvents = localStorage.getItem('calendarEvents')
    if (savedEvents) {
        rawEvents.value = JSON.parse(savedEvents)
    } else {
        // Inicializar con algunos eventos de ejemplo si no hay datos guardados
        rawEvents.value = [
            {
                id: 1,
                name: 'Meeting',
                start: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')} 09:00`,
                end: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')} 10:00`,
                color: 'blue',
                timed: true
            }
        ]
        // Guardar los eventos iniciales
        localStorage.setItem('calendarEvents', JSON.stringify(rawEvents.value))
        }
    
    calendar.value?.checkChange()
})

// Guardar eventos en localStorage cada vez que cambien
watch(rawEvents, (newEvents) => {
  try {
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents))
  } catch (error) {
    console.error('Error saving events to localStorage:', error)
  }
}, { deep: true })

// Funciones:

function viewDay (nativeEvent, { date }) {
    focus.value = date
    type.value = 'day'
}

function getEventColor (event) {
    return event.color
}

function setToday () {
    focus.value = ''
}

function prev () {
    calendar.value.prev()
}

function next () {
    calendar.value.next()
}

function showEvent (nativeEvent, { event }) {
    const open = () => {
        selectedEvent.value = event
        selectedElement.value = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
    }
    if (selectedOpen.value) {
      selectedOpen.value = false
      requestAnimationFrame(() => requestAnimationFrame(() => open()))
    } else {
      open()
    }
    nativeEvent.stopPropagation()
}

function editEvent(event) {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    editingEvent.value = {
        id: event.id,
        name: event.name,
        details: event.details || '',
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        allDay: !event.timed,
        color: event.color
    }
    if (!event.timed) { 
        editingEvent.value.startTime = null
        editingEvent.value.endTime = null
    } else {
        editingEvent.value.startTime = formatTime(startDate)
        editingEvent.value.endTime = formatTime(endDate)
    }

    selectedOpen.value = false
    dialogEdit.value = true
}

function deleteSelectedEvent() {
    if (selectedEvent.value && selectedEvent.value.id) {
        deleteEventById(selectedEvent.value.id);
        selectedOpen.value = false;
    }
}

function deleteEventById(eventId) {
    console.log('Deleting event with ID:', eventId); // Para depuración
    console.log('Type of ID:', typeof eventId); // Para depuración
    console.log('Current events before deletion:', rawEvents.value); // Para depuración

    // Buscar y eliminar el evento independientemente del tipo de ID
    rawEvents.value = rawEvents.value.filter(e => {
        // Comparar como strings para manejar IDs con caracteres especiales
        return String(e.id) !== String(eventId);
    });
  
    console.log('Events after deletion:', rawEvents.value); // Para depuración
}

function openAddEventForm() {
    editingEvent.value = {
        id: null,
        name: '',
        details: '',
        startDate: formatDate(new Date()),
        endDate: formatDate(new Date()),
        startTime: formatTime(new Date()),
        endTime: formatTime(new Date(Date.now() + 1000 * 60 * 60)),
        allDay: false,
        color: 'blue'
    }
    dialogEdit.value = true
}

function saveEvent() {
    if (!editingEvent.value.name.trim()) { // Validar si el campo 'nombre del evento' está completo
        alert('Event name is required')
        return
    }

    const startDateTime = combineDateAndTime(
        editingEvent.value.startDate, 
        editingEvent.value.allDay ? '00:00' : editingEvent.value.startTime
    )

    const endDateTime = combineDateAndTime(
        editingEvent.value.endDate, 
        editingEvent.value.allDay ? '23:59' : editingEvent.value.endTime
    )

    const event = {
        id: editingEvent.value.id || Date.now(), // Generar ID si es nuevo
        name: editingEvent.value.name,
        details: editingEvent.value.details,
        start: startDateTime,
        end: endDateTime,
        color: editingEvent.value.color,
        timed: !editingEvent.value.allDay
    }

    if (editingEvent.value.id) {
        // Actualizar evento existente - comparar como strings
        const index = rawEvents.value.findIndex(e => String(e.id) === String(event.id));
        if (index !== -1) {
            rawEvents.value[index] = event;
        }
    } else {
        // Agregar nuevo evento
        rawEvents.value.push(event)
    }

    dialogEdit.value = false
}

// Funciones auxiliares:

function formatDate(date) {
    return new Date(date).toISOString().substr(0, 10)
}

function formatTime(date) {
    return new Date(date).toTimeString().substr(0, 5)
}

function combineDateAndTime(dateStr, timeStr) {
    if (!timeStr) return new Date(dateStr).toISOString()
    return new Date(`${dateStr}T${timeStr}`).toISOString()
}
</script>

<style scoped>
.mr-2 {
  margin-right: 8px;
}
.ml-2 {
  margin-left: 8px;
}
</style>