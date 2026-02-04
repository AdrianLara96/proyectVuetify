<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card
          elevation="8"
          rounded="xl"
          class="pa-8 process-card text-center"
        >
          <v-card-title class="text-h5 font-weight-bold text-primary justify-center">
            🚧 Estamos trabajando en ello
          </v-card-title>

          <v-divider class="my-4" color="accent" />

          <v-card-text>
            <v-typography variant="h6" class="mb-3 text-secondary">
              Esta web aún está en desarrollo
            </v-typography>

            <v-divider class="my-4" color="accent"/>

            <v-typography class="mb-6">
              Estamos explorando nuevas características de
              <strong class="text-primary">Vuetify</strong> para integrarlas
              correctamente en la aplicación.
              <br />
              ¡Muy pronto habrá nuevas funcionalidades disponibles! 🚀
            </v-typography>

            <v-sheet
              color="accent"
              rounded="lg"
              class="pa-4 d-flex justify-center"
            >
              <v-img
                src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif"
                alt="Trabajando en ello"
                max-width="320"
                aspect-ratio="1"
                cover
                class="rounded-lg elevation-4"
              />
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>