// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Beispielseiten importieren
import Home from '@/components/Home.vue'
import BarberList from '@/components/BarberList.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/barberlist', component: BarberList },
  {
    path: '/booking/:barberId',
    name: 'BookingCalendar',
    component: () => import('@/components/BarberBooking.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
