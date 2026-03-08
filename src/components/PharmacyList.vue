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
      Aucun médicament dans le stock ou erreur de chargement de la base de donnée
    </v-alert>

    <div v-else>
      <MedicineCard 
        v-for="med in medicaments" 
        :key="med.reference" 
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
      :categories="categories"
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
import axios from 'axios';
import PharmacyService from '@/services/PharmacyService'; // Assure-toi que le chemin est bon
import MedicineCard from './MedecineCard.vue';
import MedicineForm from './MedecineForm.vue';

// --- État (Reactive State) ---
const medicaments = ref([]);
const categories = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedMedicament = ref(null);
const snackbar = ref({ show: false, text: '', color: 'success' });

// --- Méthodes ---

// 1. Charger la liste [cite: 35]
const loadMedicaments = async () => {
  loading.value = true;
  try {
    const response = await PharmacyService.getMedicaments();
    console.log("Réponse du backend:", response.data); // DEBUG
    medicaments.value = response.data;
  } catch (error) {
    console.error("Erreur chargement:", error);
    showNotification("Erreur lors du chargement des données", "error");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Cycle de vie : on charge dès que le composant est monté
onMounted(async () => {
  await loadCategories();
  await loadMedicaments();
});

// Charger les catégories
const loadCategories = async () => {
  try {
    const response = await PharmacyService.getCategories();
    console.log("Catégories chargées:", response.data);
    categories.value = response.data;
  } catch (error) {
    console.error("Erreur chargement catégories:", error);
  }
};

// 2. Supprimer [cite: 37]
const deleteMedicament = async (reference) => {
  console.log("Suppression du médicament avec reference:", reference); // DEBUG
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) return;
  
  try {
    await PharmacyService.deleteMedicament(reference);
    medicaments.value = medicaments.value.filter(m => m.reference !== reference); // Optimiste UI update
    showNotification("Médicament supprimé avec succès");
  } catch (error) {
    console.error("Erreur suppression:", error.response?.data);
    showNotification("Impossible de supprimer", "error");
  }
};

// 3. Gestion Formulaire (Ajout/Modif)
const openAddForm = () => {
  selectedMedicament.value = null; // null indique un AJOUT [cite: 36]
  showForm.value = true;
};

const openEditForm = async (med) => {
  console.log("Édition du médicament:", med); // DEBUG
  try {
    // Charger le médicament complet avec la catégorie
    const response = await PharmacyService.getMedicamentWithCategorie(med.reference);
    selectedMedicament.value = response.data;
    console.log("Médicament complet reçu:", response.data); // DEBUG
    showForm.value = true;
  } catch (error) {
    console.error("Erreur chargement médicament complet:", error);
    // Fallback : utiliser le medicament partial
    selectedMedicament.value = med;
    showForm.value = true;
  }
};

const handleSave = async (medData) => {
  try {
    const payloadToSend = {
      ...medData,
      categorie: { 
        code: medData.categorieCode
      }
    };
    
    delete payloadToSend.categorieCode;

    console.log("Données formatées envoyées au backend:", payloadToSend); // DEBUG

    if (payloadToSend.reference) {
      // Update
      await PharmacyService.updateMedicament(payloadToSend);
      showNotification("Médicament modifié");
    } else {
      // Create
      await PharmacyService.addMedicament(payloadToSend);
      showNotification("Médicament ajouté");
    }
    await loadMedicaments(); // Recharger la liste pour être sûr
  } catch (error) {
    console.error("Erreur détaillée:", error.response?.data);
    showNotification("Erreur lors de la sauvegarde", "error");
  }
};

// 4. Gestion Quantité (+1 / -1) [cite: 38, 39]
const updateQte = async (med, change) => {
  const newQte = med.unitesEnStock + change;
  if (newQte < 0) return; // Pas de stock négatif

  // On crée une copie nettoyée pour l'envoi - seulement les champs qu'on change
  const payload = {
    nom: med.nom,
    quantiteParUnite: med.quantiteParUnite,
    prixUnitaire: med.prixUnitaire,
    unitesEnStock: newQte,
    unitesCommandees: med.unitesCommandees,
    niveauDeReappro: med.niveauDeReappro,
    indisponible: med.indisponible,
    imageURL: med.imageURL
    // IMPORTANTE: On n'envoie PAS la catégorie pour ne pas la perdre
  };
  
  try {
    // Optimistic UI update (mise à jour visuelle immédiate pour la réactivité)
    const index = medicaments.value.findIndex(m => m.reference === med.reference);
    if (index !== -1) medicaments.value[index].unitesEnStock = newQte;

    // Appeler directement axios pour ne pas transformer avec la catégorie
    await axios.put(`https://backendminiprojet.onrender.com/api/medicaments/${med.reference}`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Erreur mise à jour quantité:", error.response?.data);
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