import {Search} from '/modules/Search.js';

//On crée un objet "data" dans la variable window qui va enregistrer toutes les données nécessaires à l'animation.
window.data = {
    resetAnimation:false,
    city:"",
    windDirection:"",
    windSpeed:""
}

//Porte d'entrée du programme
new Search();