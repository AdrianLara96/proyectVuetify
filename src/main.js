import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createRouter, createWebHistory } from 'vue-router'

import './assets/css/styles.css'
import HomeComponent from './components/HomeComponent.vue'
import HelloWorld from './components/HelloWorld.vue'
import DatatableComponent from './components/DatatableComponent.vue'
import ProcessComponent from './components/ProcessComponent.vue'
import CalendarComponent from './components/CalendarComponent.vue'
import WeatherComponent from './components/WeatherComponent.vue'
import PokemonComponent from './components/PokemonComponent.vue'


const routes = [
  {path: '/', component: HomeComponent},
  {path: '/home', component: HomeComponent},
  {path: '/datatable', component: DatatableComponent},
  {path: '/helloworld', component: HelloWorld},
  {path: '/calendar', component: CalendarComponent},
  {path: '/weather', component: WeatherComponent},
  {path: '/pokedex', component: PokemonComponent},
  {path: '/:pathMatch(.*)*', component: ProcessComponent}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')