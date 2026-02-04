<!--Aquí va el footer de la web-->
<template>
    <v-footer
        app
        class="footer"
        elevation="6"
        height="75"
    >
        <v-container>
            <v-row justify="center">
                <v-col cols="12" class="text-center">
                    <v-typography variant="body2" class="text-secondary">
                         © Proyecto de App Web de <strong class="text-primary">Adrián Lara Moncayo</strong>
                    </v-typography>
                    <v-divider class="my-1" color="accent"/>
                    <v-icon size="18" color="primary" class="mr-1">
                        mdi-vuetify
                    </v-icon>
                    <v-typography variant="caption" class="text-info mt-1">
                        Vue · Vuetify · Material Design
                    </v-typography>
                </v-col>
            </v-row>
        </v-container>    
    </v-footer>
</template>

<script setup>
</script>