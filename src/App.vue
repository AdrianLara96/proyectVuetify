<template>
  <v-app>
    <HeaderComponent></HeaderComponent>
    <v-main>
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
