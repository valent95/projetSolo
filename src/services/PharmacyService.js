import axios from 'axios';

// URL de l'API fournie (à remplacer par la tienne pour le rendu final)
const API_URL = 'https://springajax.herokuapp.com/api/medicaments'; 

export default {
  // Récupérer tous les médicaments [cite: 35]
  getAll() {
    return axios.get(API_URL);
  },

  // Ajouter un médicament 
  add(medicament) {
    return axios.post(API_URL, medicament);
  },

  // Supprimer un médicament [cite: 37]
  delete(id) {
    return axios.delete(`${API_URL}/${id}`);
  },

  // Modifier un médicament (utilisé pour l'édition et les +/- qté) [cite: 38, 39, 40]
  update(medicament) {
    return axios.put(`${API_URL}/${medicament.id}`, medicament);
  },
  
  // Recherche (Optionnel selon sujet, mais bonne pratique) [cite: 41]
  search(keyword) {
    return axios.get(`${API_URL}/search?nom=${keyword}`);
  }
};