<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Date Picker -->
        <v-date-picker
          v-model="selectedDate"
          @update:model-value="handleDateChange"
          show-adjacent-months
          color="primary"
        />

        <!-- Ladeanimation -->
        <div v-if="isLoading" class="mt-6 text-center">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <!-- Verfügbare Zeiten -->
        <div v-if="!isLoading && availableTimes.length" class="mt-6">
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

        <!-- Keine Zeiten -->
        <div v-else-if="!isLoading && showNoTimesMessage" class="mt-6 text-subtitle-1 text-center">
          Keine verfügbaren Zeiten gefunden.
        </div>


        <!-- Keine Zeiten -->
        <div v-else-if="showNoTimesMessage" class="mt-6 text-subtitle-1 text-center">
          Keine verfügbaren Zeiten gefunden.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Route und Parameter
const route = useRoute()
const barberId = route.params.barberId

// Reaktive States
const selectedDate = ref(null)
const availableTimes = ref([])
const selectedTime = ref(null)
const isLoading = ref(false)
const showNoTimesMessage = ref(false)

// Formatierte Anzeige des Datums
const formattedDate = computed(() => {
  return selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString('de-DE')
    : ''
})

// Hilfsfunktion zur Formatierung der Uhrzeit (z. B. [10, 15] → "10:15")
const formatTime = (timeArray) => {
  const [hour, minute] = timeArray
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(hour)}:${pad(minute)}`
}

// Datum für API umwandeln in YYYY-MM-DD
const formatDateForBackend = (date) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// Wenn ein neues Datum gewählt wurde
const handleDateChange = (newValue) => {
  selectedDate.value = newValue
  fetchAvailableTimes()
}

// Lade verfügbare Zeiten vom Backend
const fetchAvailableTimes = async () => {
  if (!selectedDate.value || !barberId) return

  const formatted = formatDateForBackend(selectedDate.value)
  isLoading.value = true
  showNoTimesMessage.value = false
  availableTimes.value = []

  try {
    const response = await fetch(
      `https://booking-backend-jnhl.onrender.com/api/time/by-date?barberId=${barberId}&date=${formatted}`
    )

    if (!response.ok) throw new Error('Fehler beim Laden der Zeiten')

    const data = await response.json()
    availableTimes.value = data // keine Filterung nötig!

    if (availableTimes.value.length === 0) {
      setTimeout(() => {
        showNoTimesMessage.value = true
      }, 1000)
    }

  } catch (error) {
    console.error('Fehler beim Abrufen der Zeiten:', error)
    setTimeout(() => {
      showNoTimesMessage.value = true
    }, 1000)
  } finally {
    isLoading.value = false
  }
}
</script>
