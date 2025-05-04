<template>
  <div class="barber-list">
    <BarberCard
      v-for="barber in barbers"
      :key="barber.id"
      :barber="barber"
      @book="handleBook"
    />
  </div>
</template>

<script>
import BarberCard from './BarberCard.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'BarberList',
  components: { BarberCard },
  data() {
    return {
      barbers: [],
    }
  },
  mounted() {
    fetch('https://booking-backend-jnhl.onrender.com/api/barbers/get-all')
      .then(res => res.json())
      .then(data => {
        this.barbers = data
      })
  },
  setup() {
    const router = useRouter()

    const handleBook = (barber) => {
      router.push({ name: 'BookingCalendar', params: { barberId: barber.id } })
    }

    return { handleBook }
  }
}
</script>

<style scoped>
.barber-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
