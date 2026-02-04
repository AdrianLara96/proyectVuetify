<!-- Home -->
<template>
    <v-container class="py-10">
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card
                    elevation="8"
                    rounded="x1"
                    class="pa-6 home-card"
                >
                    <v-card-title class="text-h5 font-weight-bold text-primary">
                        ¿Qué es Vuetify?
                    </v-card-title>

                    <v-divider class="my-4" color="accent"/>

                    <v-card-text>
                        <v-typography variant="h6" class="mb-4 text-secondary">
                            Probamos las funcionalidades de Vuetify en esta web.
                        </v-typography>

                        <v-divider class="my-2" color="secondary"/>

                        <v-typography class="mb-3">
                            Vuetify es un framework de componentes que sigue las especificaciones del 
                            <strong>Material Design</strong> de Google.
                        </v-typography>

                        <v-typography class="mb-3">
                            Está construido sobre Vue.js, uno de los frameworks de JavaScript más populares y versátiles.
                        </v-typography>

                        <v-typography class="mb-6">
                            Vuetify proporciona una vasta colección de componentes UI listos para usar,
                            responsivos y accesibles, facilitando enormemente la tarea de diseño de interfaces.
                        </v-typography>

                        <v-sheet
                            color="accent"
                            rounded="lg"
                            class="pa-4 d-flex justify-center"
                        >
                            <v-img
                            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW9mZTR4ZDBjcHNlNXM3Zm56eG1ueDBmczk3cXgwbmQwNmppaDJyayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JqmupuTVZYaQX5s094/giphy.gif"
                            alt="Gif desarrollando"
                            max-width="400"
                            class="mx-auto"
                            aspect-ratio="1"
                            cover
                            />
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup></script>