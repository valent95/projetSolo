<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditMode ? 'Modifier le médicament' : 'Ajouter un médicament' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select 
            v-model="localMedicament.categorieCode" 
            :items="categories" 
            item-title="libelle" 
            :item-value="(item) => item.code"
            label="Catégorie" 
            required
            @update:model-value="(val) => { console.log('Catégorie sélectionnée:', val, 'Type:', typeof val); }"
          ></v-select>
          <v-text-field v-model="localMedicament.nom" label="Nom" required></v-text-field>
          <v-text-field v-model="localMedicament.quantiteParUnite" label="Quantité par Unité (ex: Boîte de 16 comprimés)" required></v-text-field>
          <v-text-field v-model.number="localMedicament.prixUnitaire" type="number" label="Prix Unitaire" required></v-text-field>
          <v-text-field v-model.number="localMedicament.unitesEnStock" type="number" label="Unités en Stock" required></v-text-field>
          <v-text-field v-model.number="localMedicament.unitesCommandees" type="number" label="Unités Commandées"></v-text-field>
          <v-text-field v-model.number="localMedicament.niveauDeReappro" type="number" label="Niveau de Réappro"></v-text-field>
          <v-checkbox v-model="localMedicament.indisponible" label="Indisponible"></v-checkbox>
          <v-text-field v-model="localMedicament.imageURL" label="URL Image (Optionnel)"></v-text-field>
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
  medicamentToEdit: Object, // Si null, c'est un ajout
  categories: Array // Liste des catégories depuis le parent
});

const emit = defineEmits(['update:modelValue', 'save']);

const isOpen = ref(props.modelValue);
const isEditMode = ref(false);
const categories = ref(props.categories || []);
const localMedicament = ref({ categorieCode: '', nom: '', quantiteParUnite: '', prixUnitaire: 0, unitesEnStock: 0, unitesCommandees: 0, niveauDeReappro: 0, indisponible: false, imageURL: '' });
// Synchronisation des catégories
watch(() => props.categories, (newVal) => {
  if (newVal) categories.value = newVal;
});
// Synchronisation de l'ouverture du dialog
watch(() => props.modelValue, (val) => {
  isOpen.value = val;
});

watch(() => isOpen.value, (val) => {
  emit('update:modelValue', val);
});

// Initialisation des données si on est en mode édition
watch(() => props.medicamentToEdit, (newVal) => {
  console.log("Reçu dans le formulaire:", newVal); // DEBUG
  if (newVal) {
    localMedicament.value = { ...newVal }; // Copie pour ne pas modifier directement
    console.log("categorieCode dans le formulaire:", localMedicament.value.categorieCode); // DEBUG
    console.log("categorie dans le formulaire:", localMedicament.value.categorie); // DEBUG
    isEditMode.value = true;
  } else {
    localMedicament.value = { categorieCode: '', nom: '', quantiteParUnite: '', prixUnitaire: 0, unitesEnStock: 0, unitesCommandees: 0, niveauDeReappro: 0, indisponible: false, imageURL: '' };
    isEditMode.value = false;
  }
});

function close() {
  isOpen.value = false;
}

function save() {
  if (!localMedicament.value.categorieCode) {
    alert('Veuillez sélectionner une catégorie');
    return;
  }
  console.log("Sauvegarde - Données du formulaire:", JSON.stringify(localMedicament.value, null, 2)); // DEBUG
  console.log("categorieCode =", localMedicament.value.categorieCode, "type:", typeof localMedicament.value.categorieCode);
  emit('save', localMedicament.value);
  close();
}
</script>