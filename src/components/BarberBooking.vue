<template>
  <v-container>
    <v-date-picker
      v-model="selectedDate"
      @update:model-value="handleDateChange"
      show-adjacent-months
      color="primary"
    />

    <div v-if="availableTimes.length" class="mt-6">
      <h3 class="text-h6 mb-4">Verfügbare Zeiten für {{ formattedDate }}</h3>
      <v-chip-group v-model="selectedTime" column mandatory>
        <v-chip
          v-for="time in availableTimes"
          :key="time.id"
          class="ma-1"
          color="gold"
          text-color="black"
          filter
          :value="formatTime(time.startTime)"
        >
          {{ formatTime(time.startTime) }}
        </v-chip>
      </v-chip-group>

    </div>

    <div v-else-if="selectedDate" class="mt-6 text-subtitle-1">
      Keine verfügbaren Zeiten gefunden.
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const formatTime = (timeArray) => {
  const [hour, minute] = timeArray
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(hour)}:${pad(minute)}`
}
const selectedTime = ref(null)


const route = useRoute()
const barberId = route.params.barberId

const selectedDate = ref(null)
const availableTimes = ref([])

const formattedDate = computed(() => {
  return selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString('de-DE')
    : ''
})

const formatDateForBackend = (date) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0] // "YYYY-MM-DD"
}

const handleDateChange = (newValue) => {
  selectedDate.value = newValue
  fetchAvailableTimes()
}

const fetchAvailableTimes = async () => {
  if (!selectedDate.value || !barberId) return

  const formatted = formatDateForBackend(selectedDate.value)

  try {
    const response = await fetch(
      `https://booking-backend-jnhl.onrender.com/api/time/by-date?barberId=${barberId}&date=${formatted}`
    )
    if (!response.ok) throw new Error('Fehler beim Laden der Zeiten')
    const data = await response.json()
    availableTimes.value = data
  } catch (error) {
    console.error('Fehler beim Abrufen der Zeiten:', error)
    availableTimes.value = []
  }
}
</script>

<style scoped>
.v-container {
  max-width: 600px;
  margin: auto;
}
</style>
