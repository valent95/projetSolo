<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditMode ? 'Modifier le médicament' : 'Ajouter un médicament' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="localMedicament.nom" label="Nom" required></v-text-field>
          <v-text-field v-model="localMedicament.forme" label="Forme (ex: Gouttes)" required></v-text-field>
          <v-text-field v-model.number="localMedicament.qte" type="number" label="Quantité" required></v-text-field>
          <v-text-field v-model="localMedicament.photo" label="URL Photo (Optionnel)"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="close">Annuler</v-btn>
        <v-btn color="blue darken-1" text @click="save">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean, // Pour contrôler l'ouverture du dialog
  medicamentToEdit: Object // Si null, c'est un ajout
});

const emit = defineEmits(['update:modelValue', 'save']);

const isOpen = ref(props.modelValue);
const isEditMode = ref(false);
const localMedicament = ref({ nom: '', forme: '', qte: 0, photo: '' });

// Synchronisation de l'ouverture du dialog
watch(() => props.modelValue, (val) => {
  isOpen.value = val;
});

watch(() => isOpen.value, (val) => {
  emit('update:modelValue', val);
});

// Initialisation des données si on est en mode édition
watch(() => props.medicamentToEdit, (newVal) => {
  if (newVal) {
    localMedicament.value = { ...newVal }; // Copie pour ne pas modifier directement
    isEditMode.value = true;
  } else {
    localMedicament.value = { nom: '', forme: '', qte: 0, photo: '' };
    isEditMode.value = false;
  }
});

function close() {
  isOpen.value = false;
}

function save() {
  emit('save', localMedicament.value);
  close();
}
</script>