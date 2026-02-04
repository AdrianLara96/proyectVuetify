<!--Aquí va la cabecera de la web-->

<template>
    <v-app-bar
        flat
        height="70"
        class="header-bar"
        color="primary"
        dark
    >
    
        <v-toolbar-title class="header-title">
            Web Cinéfila con Vuetify 3
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.link"
            text
            class="nav-button"
        >
            {{ item.title }}
        </v-btn>
            
    </v-app-bar>

</template>

<script setup>
    import { ref } from 'vue'

    // Definimos un array de botones con título y link
    const navItems = ref([  
    
        { title: 'Inicio', link: '/' },
        { title: 'DataTable', link: '/datatable'},
        { title: 'Calendario', link: '/process'},
        { title: 'HelloWorld', link: '/helloworld'}
    ])
</script>