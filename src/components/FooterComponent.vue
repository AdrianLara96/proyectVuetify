<!--Aquí va el footer de la web-->
<template>
    <v-footer
        app
        elevation="4"
        class="footer"
    >
        <v-container>
            <v-row 
            justify="center" 
            class="text-center">
                <v-col cols="12" sm="auto" class="text-center">
               
                    <p class="text-body-2 text-secondary mb-1">
                        © Proyecto de App Web de 
                        <strong class="text-primary">Adrián Lara Moncayo</strong>
                    </p>

                    <v-divider class="my-1" color="accent" />

                    <v-icon size="18" color="primary" class="mr-1">
                        mdi-vuetify
                    </v-icon>

                    <p class="text-caption text-info mt-1">
                        Vue · Vuetify · Material Design
                    </p>
                </v-col>

            </v-row>
        </v-container>    
    </v-footer>
</template>

<script setup>
</script>