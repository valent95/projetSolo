import axios from 'axios';

// URL de base de l'API backend
const BASE_URL = 'https://backendminiprojet.onrender.com/api';

//fonction pour la mise en forme de la donnée
const transformMedicamentData = (medicament) => {
  return {
    nom: medicament.nom,
    quantiteParUnite: medicament.quantiteParUnite,
    prixUnitaire: medicament.prixUnitaire,
    unitesEnStock: medicament.unitesEnStock,
    unitesCommandees: medicament.unitesCommandees,
    niveauDeReappro: medicament.niveauDeReappro,
    indisponible: medicament.indisponible,
    imageURL: medicament.imageURL,
    categorieCode: medicament.categorieCode
  };
};

export default {
  // ===== MÉDICAMENTS =====
  
  // Récupérer tous les médicaments
  async getMedicaments() {
    try {
      const response = await axios.get(`${BASE_URL}/medicaments?size=1000`);
      // Extraire les médicaments depuis la structure paginée Spring Data REST
      return {
        data: response.data._embedded?.medicaments || response.data.medicaments || response.data
      };
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un médicament par ID
  getMedicamentById(id) {
    return axios.get(`${BASE_URL}/medicaments/${id}`);
  },

  // Récupérer un médicament avec sa catégorie complète (pour l'édition)
  async getMedicamentWithCategorie(id) {
    try {
      const medResponse = await axios.get(`${BASE_URL}/medicaments/${id}`);
      const medicament = medResponse.data;
      
      // Charger la catégorie via le lien HATEOAS
      if (medicament._links?.categorie?.href) {
        const catResponse = await axios.get(medicament._links.categorie.href);
        medicament.categorie = catResponse.data;
        medicament.categorieCode = catResponse.data.code;
      }
      
      return { data: medicament };
    } catch (error) {
      throw error;
    }
  },

  // Ajouter un médicament 
  addMedicament(medicament) {
    const payload = transformMedicamentData(medicament);
    console.log("Payload envoyé au backend:", payload);
    return axios.post(`${BASE_URL}/medicaments`, payload);
  },

  // Supprimer un médicament
  deleteMedicament(id) {
    return axios.delete(`${BASE_URL}/medicaments/${id}`);
  },

  // Modifier un médicament
  updateMedicament(medicament) {
    const payload = transformMedicamentData(medicament);
    console.log("Payload UPDATE envoyé au backend:", payload);
    return axios.put(`${BASE_URL}/medicaments/${medicament.reference}`, payload);
  },

  // ===== CATÉGORIES =====
  
  // Récupérer toutes les catégories
  async getCategories() {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      // Extraire les catégories depuis la structure paginée Spring Data REST
      return {
        data: response.data._embedded?.categories || response.data.categories || response.data
      };
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une catégorie par ID
  getCategoryById(id) {
    return axios.get(`${BASE_URL}/categories/${id}`);
  },

  // ===== FOURNISSEURS =====
  
  // Récupérer tous les fournisseurs
  getSuppliers() {
    return axios.get(`${BASE_URL}/suppliers`);
  },

  // Récupérer un fournisseur par ID
  getSupplierById(id) {
    return axios.get(`${BASE_URL}/suppliers/${id}`);
  },

  // ===== APPROVISIONNEMENT =====
  
  // Déclencher l'approvisionnement
  declencherApprovisionnement() {
    return axios.get(`${BASE_URL}/approvisionnement/declencher`);
  }
};