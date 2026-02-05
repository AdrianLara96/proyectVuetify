<template>
  <v-app class="app-layout">
    <HeaderComponent></HeaderComponent>

    <v-main class="main-content">
      <router-view></router-view>
    </v-main>
    
    <FooterComponent></FooterComponent>
  </v-app>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  name: 'App',

  components: {
    HeaderComponent,
    FooterComponent
  },

  data: () => ({
    //
  }),
}
</script>
