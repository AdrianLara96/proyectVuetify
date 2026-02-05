<!--Aquí va la cabecera/header de la web-->

<template>
    
    <v-app-bar
        app
        color="primary"
        elevation="4"
    >
        <!-- Menú hamburguesa (solo móvil) -->
        <v-app-bar-nav-icon
            v-if="isMobile"
            @click="drawer = !drawer"
        />

        <!-- Titulo -->
        <v-toolbar-title class="font-weight-bold">
            Web-Lab con Vuetify
        </v-toolbar-title>

        <v-spacer/>

        <!-- Menú desktop -->
        <template v-if="!isMobile">
            <v-btn
                v-for="item in menuItems"
                :key="item.title"
                :to="item.route"
                
                variant="text"
                class="text-white"
            >
                {{ item.title }}
            </v-btn>
        </template>

    </v-app-bar>

    <!-- Drawer (móvil) -->
    <v-navigation-drawer
        v-model="drawer"
        temporary
        location="left"
    >
        <v-list nav>
            <v-list-item
                v-for="item in menuItems"
                :key="item.title"
                :to="item.route"
                @click="drawer = false"
            >
                <v-list-item-title> {{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { useDisplay } from 'vuetify'

    const drawer = ref(false)

    // Definimos breakpoints Vuetify
    const { mdAndUp } = useDisplay()
    const isMobile = computed(() => !mdAndUp.value)

    // Definimos un array de botones con título y route
    const menuItems = [  
        { title: 'Inicio', route: '/' },
        { title: 'Películas', route: '/datatable'},
        { title: 'Calendario', route: '/calendar'},
        { title: 'Clima', route: '/weather'},
        { title: 'Pokédex', route: '/pokedex'},
        { title: 'HelloWorld', route: '/helloworld'}
    ]
</script>