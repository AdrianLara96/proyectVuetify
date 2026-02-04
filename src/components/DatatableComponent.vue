<!-- Este componente muestra una tabla de películas obtenidas desde una API -->
<template>
    <v-container class="py-8">
        <v-card 
            class="pa-6 datatable-card" 
            elevation="8" 
            rounded="x1"
        >
            <!-- Titulo del componente -->
            <v-card-title class="text-h5 font-weight-bold text-primary">Películas de 2025</v-card-title>
            
            <v-divider class="my-4" color="accent"/>

            <!-- Filtros -->
            <v-row class="mb-4" dense>
                <v-col cols="12" sm="6" md="4">
                    <!-- Filtrado de información de idioma de la tabla -->
                    <v-select
                        v-model="selectedCountry"
                        :items="['Todos', 'Español', 'Extranjero']"
                        label="Filtrar por idioma"
                        variant="outlined"
                        density="confortable"
                        color="primary"
                    />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <!-- Filtrado de información de año de la tabla -->
                    <v-select
                        v-model="selectedYear"
                        :items="['Todos', ...years]"
                        label="Filtrar por año"
                        variant="outlined"
                        density="confortable"
                        color="primary"
                    />
                </v-col>
            </v-row>
            
            <!-- Tabla con parámetros -->
            <v-data-table
                :headers="headers" 
                :items="filteredMovies"
                :loading="loading"
                loading-text="Cargando películas..."
                fixed-header
                height="450"
                class="datatable elevation-4"
                density="confortable"
            >
                <!-- 
                * Así lo haríamos en un principio, pero nos encontrmoas con problemas con la configuracion de ESLint
                * Por lo tanto, vamos a usar un solo slot-item global, en vez de por columnas

                * Añadimos rating personalizado para mejorar visualmente la tabla 
                <template v-slot:item.vote_average="{ value }">
                <v-rating
                    :model-value="value / 2"
                    color="amber"
                    readonly
                    half-increments
                />
                </template>

                * Añadimos formato de fecha personalizado 
                <template v-slot:item.release_date="{ value }">
                    {{ new Date(value).toLocaleDateString() }}
                </template>
                -->

                <!-- Este es el slot:item global que afectará a toda la tabla -->
                <template v-slot:item="{ item, index }">

                    <!-- item.colums son valores procesados; item contiene el objeto original -->
                    <tr :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
                        <td class="font-weight-medium">{{ item.title }}</td>

                        <td> <!-- Formato fechas -->
                            {{ new Date(item.release_date).toLocaleDateString() }}
                        </td>

                        <td> <!-- Formato valoración -->
                            <v-rating
                                :model-value="item.vote_average / 2"
                                color="amber"
                                readonly
                                half-increments
                                size="small"
                            />
                        </td>
                        <td> <!-- Formato país -->
                            <v-chip 
                                :color="item.country === 'Español' ? 'red lighten-2' : 'blue lighten-2'"
                                variant="flat"
                                size="small"
                                class="text-white"
                            >
                                {{ item.country }}
                            </v-chip>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import axios from 'axios'

    const movies = ref([])
    const selectedCountry = ref('Todos')
    const currentYear = new Date().getFullYear()
    const loading = ref(false)

    const filteredMovies = computed(() => {
        return movies.value.filter(movie => {
            // Filtramos por país
            const countryMatch = selectedCountry.value === 'Todos' || movie.country === selectedCountry.value

            // Filtramos por año
            const yearMatch = 
                selectedYear.value === 'Todos' ||
                new Date(movie.release_date).getFullYear() === Number(selectedYear.value)
            
            return countryMatch && yearMatch
        })
    })

    const years = []
    for (let y = 2020; y <= currentYear; y++) {
        years.push(y)
    }

    const selectedYear = ref('Todos') // filtro año por defecto

    // Definimos los parámetros de la tabla con title (cabecera) y key (dato en la columna)
    const headers = [
        { title: 'Título', key: 'title' },
        { title: 'Fecha de estreno', key: 'release_date' },
        { title: 'Valoración', key: 'vote_average' },
        { title: 'Idioma', key: 'country'}
    ]

    // definimos la variable fetchMovies como la función que va a dar lugar a la consulta de la API
    // carga de datos asíncrona
    const fetchMovies = async () => {
        
        // manejo de estado loading
        loading.value = true
        
        try {
            const pages = [1, 2, 3, 4, 5] // Recorremos 5 páginas de la API para obtener 100 películas (20 pel/pag)
            const allResponses = await Promise.all(
                pages.map(page =>
                    axios.get(
                    'https://api.themoviedb.org/3/discover/movie',
                    {
                        params: {
                            api_key: '847fca328dbc509f10291f462db75108',
                            //primary_release_date: 2025,
                            sort_by: 'popularity.desc',
                            page
                        }
                    })
                )
            )
            
            const allMovies = allResponses.flatMap(response => response.data.results)

            console.log(allMovies.length)
            /*
            * movies.value = response.data.results --> esto no filtra los datos antes de meterlos en la tabla
            * vamos a transformar los datos antes de meterlos en la tabla con 'map'
            * filtramos de la siguiente manera: 'key': 'item.keyAPI'
            * en este caso el 'item' de la datatable es 'movie' como vemos en la template
            */
            movies.value = allMovies.map(movie => ({
                id: movie.id,
                title: movie.title,
                release_date: movie.release_date,
                vote_average: movie.vote_average,

                /*
                * Vamos a filtrar las películas que sean producidas en España
                * La API devuelve: original_language : "en"
                * Por eso vamos a mapear aquellas películas que incluyan 'es' y su propiedad será 'España'
                * Aquellas que no, su propiedad será 'Extranjera'
                * Nos aseguramos de que es un array antes de acceder, 
                * prevenimos que no esté definida original_language en algunas películas
                */
                country: movie.original_language === 'es' ? 'Español' : 'Extranjero'
            }))
            
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    // Hacemos que se ejecute la función en cuanto se cargue el componente
    onMounted(fetchMovies)
</script>