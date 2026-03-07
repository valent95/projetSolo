# Exemples d'utilisation du PharmacyService

Votre backend est maintenant connecté ! Voici comment utiliser chaque endpoint dans vos composants Vue.

## Configuration

Le service utilise **axios** et pointe vers `http://localhost:8080/api`

---

## 1. MÉDICAMENTS

### ✅ Récupérer tous les médicaments

```javascript
import PharmacyService from '@/services/PharmacyService';

// Dans un composant Vue
const loadMedicaments = async () => {
  try {
    const response = await PharmacyService.getMedicaments();
    this.medicaments = response.data; // ou ref(response.data) en Composition API
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### ✅ Récupérer UN médicament par ID

```javascript
const loadMedicament = async (id) => {
  try {
    const response = await PharmacyService.getMedicamentById(id);
    console.log(response.data); // Détails du médicament
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### ✅ Ajouter un médicament

```javascript
const addMedicament = async () => {
  const newMedicament = {
    nom: 'Paracétamol',
    forme: 'Comprimé',
    qte: 50,
    photo: 'url_photo'
  };
  
  try {
    const response = await PharmacyService.addMedicament(newMedicament);
    console.log('Ajouté:', response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### ✅ Modifier un médicament

```javascript
const updateMedicament = async () => {
  const medicament = {
    id: 1,
    nom: 'Paracétamol',
    forme: 'Comprimé',
    qte: 75,
    photo: 'url_photo'
  };
  
  try {
    await PharmacyService.updateMedicament(medicament);
    console.log('Modifié');
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### ✅ Supprimer un médicament

```javascript
const deleteMedicament = async (id) => {
  try {
    await PharmacyService.deleteMedicament(id);
    console.log('Supprimé');
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## 2. CATÉGORIES

### ✅ Récupérer toutes les catégories

```javascript
const loadCategories = async () => {
  try {
    const response = await PharmacyService.getCategories();
    this.categories = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### ✅ Récupérer une catégorie par ID

```javascript
const loadCategory = async (id) => {
  try {
    const response = await PharmacyService.getCategoryById(id);
    console.log(response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## 3. FOURNISSEURS

### ✅ Récupérer tous les fournisseurs

```javascript
const loadSuppliers = async () => {
  try {
    const response = await PharmacyService.getSuppliers();
    this.suppliers = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### ✅ Récupérer UN fournisseur par ID

```javascript
const loadSupplier = async (id) => {
  try {
    const response = await PharmacyService.getSupplierById(id);
    console.log(response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## 4. APPROVISIONNEMENT

### ✅ Déclencher l'approvisionnement

```javascript
const triggerSupply = async () => {
  try {
    const response = await PharmacyService.declencherApprovisionnement();
    console.log('Résultat:', response.data); // Message de la réponse
    this.message = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## 📋 Exemple complet dans un composant Vue (Composition API)

```vue
<template>
  <v-container>
    <h2>Gestion des Fournisseurs</h2>
    
    <!-- Liste des fournisseurs -->
    <v-list v-if="suppliers.length > 0">
      <v-list-item v-for="supplier in suppliers" :key="supplier.id">
        <v-list-item-title>{{ supplier.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
    
    <!-- Bouton pour déclencher approvisionnement -->
    <v-btn color="primary" @click="declencherApprovi">
      Déclencher approvisionnement
    </v-btn>
    
    <v-alert v-if="approvisonnementMessage" type="info">
      {{ approvisonnementMessage }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PharmacyService from '@/services/PharmacyService';

const suppliers = ref([]);
const approvisonnementMessage = ref('');

const loadSuppliers = async () => {
  try {
    const response = await PharmacyService.getSuppliers();
    suppliers.value = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

const declencherApprovi = async () => {
  try {
    const response = await PharmacyService.declencherApprovisionnement();
    approvisonnementMessage.value = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

onMounted(loadSuppliers);
</script>
```

---

## ⚠️ Gestion des erreurs recommandée

```javascript
const handleAPICall = async (apiFunction, errorMessage) => {
  try {
    return await apiFunction();
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Ressource non trouvée');
    } else if (error.response?.status === 500) {
      console.error('Erreur serveur');
    } else {
      console.error(errorMessage, error);
    }
    throw error;
  }
};
```

---

## 🚀 Prêt à utiliser !

Votre backend est maintenant intégré ! Tous les endpoints sont accessibles via le service. 
Si vous avez besoin d'ajouter d'autres endpoints, suivez le même pattern dans `PharmacyService.js`.
