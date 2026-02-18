<template>
  <v-card class="mb-4 pa-4 d-flex align-center" variant="outlined">
    <v-col cols="3">
      <div class="text-h6 font-weight-bold">{{ medicament.nom }}</div>
    </v-col>

    <v-col cols="3">
      <div class="text-body-1 text-grey-darken-1">{{ medicament.forme }}</div>
    </v-col>

    <v-col cols="2">
      <div class="text-h5 primary--text">{{ medicament.qte }}</div>
    </v-col>

    <v-col cols="2">
      <v-img :src="medicament.photo" height="50" contain></v-img>
    </v-col>

    <v-col cols="2" class="d-flex flex-column gap-2">
      <div class="d-flex justify-end mb-2">
        <v-btn color="error" size="small" variant="outlined" @click="$emit('delete', medicament.id)">
          Supprimer
        </v-btn>
        <v-btn color="primary" size="small" variant="outlined" class="ml-2" @click="$emit('edit', medicament)">
          Modifier
        </v-btn>
      </div>
      <div class="d-flex justify-end">
        <v-btn color="success" size="x-small" icon="mdi-plus" class="mr-2" @click="$emit('increment', medicament)"></v-btn>
        <v-btn color="warning" size="x-small" icon="mdi-minus" @click="$emit('decrement', medicament)"></v-btn>
      </div>
    </v-col>
  </v-card>
</template>

<script setup>
// Props: données reçues du parent
defineProps({
  medicament: {
    type: Object,
    required: true
  }
});

// Events: actions remontées au parent
defineEmits(['delete', 'edit', 'increment', 'decrement']);
</script>