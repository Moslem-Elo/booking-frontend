<template>
  <v-container class="text-center mt-10" max-width="600">
    <h1 class="text-h5 font-weight-bold mb-4">Buchung stornieren</h1>

    <v-form v-model="formValid" ref="formRef">
      <v-text-field
        v-model="bookingId"
        label="Buchungsnummer eingeben"
        outlined
        required
        :rules="[
          v => !!v || 'Buchungsnummer erforderlich',
          v => /^[0-9]+$/.test(v) || 'Nur Zahlen erlaubt'
        ]"
      />

      <v-btn
        color="error"
        class="mt-4"
        :disabled="!formValid || isLoading"
        @click="cancelBooking"
      >
        Stornieren
      </v-btn>
    </v-form>

    <!-- Ladeanimation -->
    <div v-if="isLoading" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Erfolgsnachricht -->
    <div v-if="successMessage" class="mt-6">
      <v-alert type="success" border="start" elevation="2">
        {{ successMessage }}
      </v-alert>
      <v-btn color="primary" class="mt-4" to="/">Zurück zur Startseite</v-btn>
    </div>

    <!-- Fehlermeldung -->
    <div v-if="errorMessage" class="mt-6">
      <v-alert type="error" border="start" elevation="2">
        {{ errorMessage }}
      </v-alert>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const bookingId = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const formValid = ref(false)
const formRef = ref(null)

const cancelBooking = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(
      `https://booking-backend-jnhl.onrender.com/api/bookings/delete/${bookingId.value}`,
      { method: 'DELETE' }
    )

    if (!response.ok) throw new Error('Fehler beim Löschen der Buchung.')

    successMessage.value = `Buchung mit Nummer ${bookingId.value} wurde erfolgreich gelöscht.`
    bookingId.value = ''
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Buchung konnte nicht Storniert werden. Bitte überprüfe die Nummer.'
  } finally {
    isLoading.value = false
  }
}
</script>
