<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">

        <!-- Service Auswahl -->
        <v-select
          v-model="selectedService"
          :items="services"
          :item-title="formatServiceLabel"
          item-value="id"
          label="Wähle einen Service"
          return-object
          outlined
        />

        <!-- Date Picker -->
        <v-date-picker
          v-if="selectedService && holidaysLoaded"
          v-model="selectedDate"
          :allowed-dates="isAllowedDate"
          @update:model-value="handleDateChange"
          show-adjacent-months
          color="#C5A253"
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

        <!-- Buchungsbutton -->
        <div v-if="selectedTime && selectedService && selectedDate && !showBookingForm" class="mt-6">
          <v-btn color="#C5A253" @click="showBookingForm = true">Termin buchen</v-btn>
        </div>

        <!-- Buchungsformular -->
        <div v-if="showBookingForm" class="mt-4">
          <v-text-field v-model="customerName" label="Dein Vor- und Nachname" outlined required />
          <v-text-field v-model="customerEmail" label="Deine E-Mail" outlined required />
          <v-text-field
            v-model="customerPhone"
            label="Deine Telefonnummer"
            outlined
            required
            type="tel"
            placeholder="+49 176 12345678"
            :rules="[validatePhone]"
          />
          <v-btn color="success" class="mt-2" @click="submitBooking">Buchung absenden</v-btn>
        </div>

      </v-col>
    </v-row>

    <!-- Absendeanimation -->
    <div v-if="isSubmitting" class="mt-4 text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// States
const barberId = route.params.barberId
const services = ref([])
const selectedService = ref(null)
const selectedDate = ref(null)
const availableTimes = ref([])
const selectedTime = ref(null)
const isLoading = ref(false)
const showNoTimesMessage = ref(false)
const showBookingForm = ref(false)
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const isSubmitting = ref(false)
const holidays = ref([])
const holidaysLoaded = ref(false)

const validatePhone = (value) => {
  const regex = /^[+0-9\s()-]{7,20}$/
  return regex.test(value) || 'Bitte eine gültige Telefonnummer eingeben.'
}

const toIsoDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

const loadHolidays = async () => {
  const year = new Date().getFullYear()
  try {
    const res = await fetch(`https://booking-backend-jnhl.onrender.com/api/holidays?year=${year}`)
    if (!res.ok) throw new Error('Feiertage konnten nicht geladen werden.')
    holidays.value = await res.json()
  } catch (err) {
    console.error('Fehler beim Laden der Feiertage:', err)
  } finally {
    holidaysLoaded.value = true
  }
}

const formatServiceLabel = (service) => {
  if (!service) return ''
  return `${service.name} – ${service.price.toFixed(2)}€ (${service.duration} Min.)`
}

const formatTime = (timeArray) => {
  const [hour, minute] = timeArray
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

const formattedDate = computed(() => {
  return selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString('de-DE')
    : ''
})

const formatDateForBackend = (date) => {
  return toIsoDate(date)
}

const isAllowedDate = (date) => {
  const iso = toIsoDate(date)
  const d = new Date(date)
  const isSunday = d.getDay() === 0
  return !isSunday && !holidays.value.includes(iso)
}

const fetchServices = async () => {
  try {
    const res = await fetch('https://booking-backend-jnhl.onrender.com/api/services/all')
    if (!res.ok) throw new Error('Fehler beim Laden der Services')
    services.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

const fetchAvailableTimes = async () => {
  if (!selectedDate.value || !barberId || !selectedService.value) return

  const formatted = formatDateForBackend(selectedDate.value)
  isLoading.value = true
  showNoTimesMessage.value = false
  availableTimes.value = []
  selectedTime.value = null
  showBookingForm.value = false

  try {
    const response = await fetch(
      `https://booking-backend-jnhl.onrender.com/api/time/by-date?barberId=${barberId}&date=${formatted}`
    )

    if (!response.ok) throw new Error('Fehler beim Laden der Zeiten')

    const data = await response.json()
    const serviceDuration = selectedService.value.duration
    const timeToMinutes = ([h, m]) => h * 60 + m

    availableTimes.value = data.filter((slot, index) => {
      let total = 0
      let current = index

      while (current < data.length && total < serviceDuration) {
        const curr = data[current]
        const prevEnd = current > index ? timeToMinutes(data[current - 1].endTime) : null
        const currStart = timeToMinutes(curr.startTime)
        const currEnd = timeToMinutes(curr.endTime)

        if (current === index || currStart === prevEnd) {
          total += currEnd - currStart
          current++
        } else break
      }

      return total >= serviceDuration
    })

    if (availableTimes.value.length === 0) {
      setTimeout(() => {
        showNoTimesMessage.value = true
      }, 1000)
    }
  } catch (error) {
    console.error(error)
    setTimeout(() => {
      showNoTimesMessage.value = true
    }, 1000)
  } finally {
    isLoading.value = false
  }
}

watch(selectedService, () => {
  selectedDate.value = null
  selectedTime.value = null
  availableTimes.value = []
  showBookingForm.value = false
  showNoTimesMessage.value = false
})

const handleDateChange = (newValue) => {
  selectedDate.value = newValue
  fetchAvailableTimes()
}

const submitBooking = async () => {
  if (!customerName.value || !customerEmail.value || !customerPhone.value) {
    alert('Bitte Name, E-Mail und Telefonnummer eingeben.')
    return
  }

  isSubmitting.value = true

  const [hour, minute] = selectedTime.value.split(':').map(Number)
  const startDate = new Date(selectedDate.value)
  startDate.setHours(hour, minute)
  const endDate = new Date(startDate)
  endDate.setMinutes(endDate.getMinutes() + selectedService.value.duration)

  const payload = {
    barber: {id: Number(barberId)},
    services: {id: selectedService.value.id},
    date: formatDateForBackend(selectedDate.value),
    start_time: selectedTime.value,
    end_time: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
    customer_name: customerName.value,
    customer_email: customerEmail.value,
    customer_phone: customerPhone.value // ← nur, wenn Backend das erwartet
  }

  try {
    const res = await fetch('https://booking-backend-jnhl.onrender.com/api/bookings/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Fehler bei der Buchung')
    router.push({name: 'BookingSuccess'})
  } catch (err) {
    console.error(err)
    alert('Buchung fehlgeschlagen.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchServices()
  loadHolidays()
})
</script>
