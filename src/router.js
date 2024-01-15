import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Objects from './pages/Objects.vue'
import Offers from './pages/Offers.vue'
import Deals from './pages/Deals.vue'
import Mobile from './pages/Mobile.vue'
import Needs from './pages/Needs.vue'
import Clients from './pages/Clients.vue'
import Rieltors from './pages/Rieltors.vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/offers', component: Offers },
    { path: '/deals', component: Deals },
    { path: '/mobile', component: Mobile },
    { path: '/objects', component: Objects }, 
    { path: '/needs', component: Needs },
    { path: '/clients', component: Clients },
    { path: '/rieltors', component: Rieltors },
  ] 
})

export default router