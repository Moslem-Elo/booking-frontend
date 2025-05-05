<template>
  <v-container class="fill-height" max-width="1000">
    <div>
      <v-img
        class="mb-4"
        height="300"
        src="/PereDelCasoLogoTrns.png"
      />

      <div class="mb-8 text-center">
        <h1 class="text-h2 font-weight-bold">Willkommen</h1>
        <div class="text-body-2 font-weight-light mb-n1">bitte wählen.</div>

      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-check-circle" size="x-large"
            rounded="lg"
            variant="tonal"
            :to="'/barberlist'"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                Termin Buchen
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Wählen um bei einen Barber einen Termin zu buchen.
              </div>
            </template>
          </v-card>
        </v-col>

        <v-col v-for="link in links" :key="link.to" cols="6">
          <v-card
            class="py-4"
            color="surface-variant"
            :prepend-icon="link.icon"
            rounded="lg"
            :subtitle="link.subtitle"
            :title="link.title"
            variant="tonal"
            :to="link.to"
          />
        </v-col>


      </v-row>
    </div>
  </v-container>
</template>

<script setup>
  const links = [
    {
      to:'/cancel',
      icon: 'mdi-information',
      subtitle: 'Wählen um einen Termin zu stornieren',
      title: 'Termin Stornieren',
    },
    {
      to:'/',
      icon: 'mdi-access-point',
      subtitle: 'Wählen um sich mit Ihrem Unternehmen anzumelden',
      title: 'Anmelden',
    },
  ]
</script>
