<template>
  <v-card class="barber-card" outlined>
    <v-img
      v-if="barber.profileImage"
      :src="'data:image/jpeg;base64,' + barber.profileImage"
      height="200px"
      cover
    />
    <v-img
      v-else
      src="/default-image.png"
      height="auto"
      cover
    />

    <v-card-title class="text-center">{{ barber.name }}</v-card-title>

    <v-card-actions class="justify-center">
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

<style scoped>
.barber-card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-height: 500px;
}
</style>
