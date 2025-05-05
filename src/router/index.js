// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Beispielseiten importieren
import Home from '@/components/Home.vue'
import BarberList from '@/components/BarberList.vue'
import BookingSuccess from "@/components/BookingSuccess.vue";
import Cancel from "@/components/Cancel.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/barberlist', component: BarberList },
  {
    path: '/booking/:barberId',
    name: 'BookingCalendar',
    component: () => import('@/components/BarberBooking.vue')
  },
  {
    path: '/buchung-erfolgreich',
    name: 'BookingSuccess',
    component: BookingSuccess,
  },
  {
    path: '/cancel',
    name: 'Cancel',
    component: Cancel
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
