<template>
  <v-card class="mx-auto" max-width="300">
    <v-img
      :src="'data:image/jpeg;base64,' + barber.profileImage"
      height="200px"
      cover
    />
    <v-card-title>{{ barber.name }}</v-card-title>

    <v-card-actions>
      <v-btn color="#C5A253" @click="$emit('book', barber)">Termin buchen</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'BarberCard',
  props: {
    barber: Object,
  },
}
</script>
