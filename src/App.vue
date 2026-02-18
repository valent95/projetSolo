<template>
  <v-app>
    <v-app-bar color="teal-darken-1" elevation="2">
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-pharmacy" class="mr-2"></v-icon>
        Pharmacie ISIS
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <PharmacyList />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app border class="justify-center text-caption text-grey">
      &copy; 2026 - Mini-Projet Web ISIS
    </v-footer>
  </v-app>
</template>

<script setup>
import PharmacyList from './components/PharmacyList.vue';
</script>