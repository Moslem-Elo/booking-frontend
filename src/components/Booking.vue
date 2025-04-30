<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <v-card class="mx-auto" max-width="344" theme="dark">
    <v-img
      height="200px"
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      cover
    ></v-img>

    <v-card-title> Osama </v-card-title>

    <v-card-subtitle> 35 Jahre </v-card-subtitle>

    <v-card-actions>
      <v-btn color="orange-lighten-2" text="Explore"></v-btn>

      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="sass">

</style>
