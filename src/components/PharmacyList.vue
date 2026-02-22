<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h2 class="text-h4 text-primary">Gestion du stock</h2>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-alert v-else-if="medicaments.length === 0" type="info" variant="tonal" class="mb-4">
      Aucun médicament dans le stock. Ajoutez-en un !
    </v-alert>

    <div v-else>
      <MedicineCard 
        v-for="med in medicaments" 
        :key="med.id" 
        :medicament="med"
        @delete="deleteMedicament"
        @edit="openEditForm"
        @increment="incrementQte"
        @decrement="decrementQte"
      />
    </div>

    <v-row class="mt-4">
      <v-col>
        <v-btn block color="primary" size="large" prepend-icon="mdi-plus" @click="openAddForm">
          Ajouter un médicament
        </v-btn>
      </v-col>
    </v-row>

    <MedicineForm 
      v-model="showForm" 
      :medicamentToEdit="selectedMedicament" 
      @save="handleSave"
    />
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PharmacyService from '@/services/PharmacyService'; // Assure-toi que le chemin est bon
import MedicineCard from './MedecineCard.vue';
import MedicineForm from './MedecineForm.vue';

// --- État (Reactive State) ---
const medicaments = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedMedicament = ref(null);
const snackbar = ref({ show: false, text: '', color: 'success' });

// --- Méthodes ---

// 1. Charger la liste [cite: 35]
const loadMedicaments = async () => {
  loading.value = true;
  try {
    const response = await PharmacyService.getAll();
    medicaments.value = response.data;
  } catch (error) {
    showNotification("Erreur lors du chargement des données", "error");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Cycle de vie : on charge dès que le composant est monté
onMounted(loadMedicaments);

// 2. Supprimer [cite: 37]
const deleteMedicament = async (id) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) return;
  
  try {
    await PharmacyService.delete(id);
    medicaments.value = medicaments.value.filter(m => m.id !== id); // Optimiste UI update
    showNotification("Médicament supprimé avec succès");
  } catch (error) {
    showNotification("Impossible de supprimer", "error");
  }
};

// 3. Gestion Formulaire (Ajout/Modif)
const openAddForm = () => {
  selectedMedicament.value = null; // null indique un AJOUT [cite: 36]
  showForm.value = true;
};

const openEditForm = (med) => {
  selectedMedicament.value = med; // objet indique une MODIFICATION [cite: 40]
  showForm.value = true;
};

const handleSave = async (medData) => {
  try {
    if (medData.id) {
      // Update
      await PharmacyService.update(medData);
      showNotification("Médicament modifié");
    } else {
      // Create
      await PharmacyService.add(medData);
      showNotification("Médicament ajouté");
    }
    await loadMedicaments(); // Recharger la liste pour être sûr
  } catch (error) {
    showNotification("Erreur lors de la sauvegarde", "error");
  }
};

// 4. Gestion Quantité (+1 / -1) [cite: 38, 39]
const updateQte = async (med, change) => {
  const newQte = med.qte + change;
  if (newQte < 0) return; // Pas de stock négatif

  // On crée une copie pour l'envoi
  const updatedMed = { ...med, qte: newQte };
  
  try {
    // Optimistic UI update (mise à jour visuelle immédiate pour la réactivité)
    const index = medicaments.value.findIndex(m => m.id === med.id);
    if (index !== -1) medicaments.value[index].qte = newQte;

    await PharmacyService.update(updatedMed);
  } catch (error) {
    // Si ça échoue, on remet l'ancienne valeur
    await loadMedicaments();
    showNotification("Erreur de mise à jour du stock", "error");
  }
};

const incrementQte = (med) => updateQte(med, 1);
const decrementQte = (med) => updateQte(med, -1);

// Helper Notification
const showNotification = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};
</script>