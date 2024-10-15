/*
Fonctionnalités de la classe Search :
- Récupérer la ville renseignée par l'utilisateur
- Trouver la latitude et la longitude correspondantes
- Indiquer une erreur si la ville saisie n'est pas dans le fichier JSON
- Bonus n°1 : auto-complétion des villes
- Bonus n°2 : enregistrer les dernières recherches

On définit la classe Search qui va réaliser toutes les fonctionnalités citées ci-dessus.
 */

import {Wind} from './Wind.js';

class Search {

    //Constructeur de la classe Search
    constructor() {
        //On définit les propriétés de la classe.
        this.input = document.querySelector('.js-search-input');
        this.form = document.querySelector('.js-search-form');
        this.cities = [];
        //On lance certaines méthodes de la classe à son instanciation.
        this.init();
    }

    //Méthode permettant de lancer des fonctions choisies de la classe Search.
    init(){
        this.getData();
        this.watchUserInput();
    }

    //Méthode permettant de récupérer la ville saisie par l'utilisateur.
    watchUserInput(){
        this.form.addEventListener('submit', (event) => {
            //On inhibe le rechargement de page.
            event.preventDefault();
            this.getLatLong();
        })
    }

    //Méthode permettant de récupérer la latitude et la longitude de la ville saisie par l'utilisateur.
    getLatLong(){
        //On crée une variable pour stocker la ville saisie par l'utilisateur.
        const searchedCity = this.input.value;
        const userCityData = this.getCityData(searchedCity);
        //On génère une alerte si ce qui est inscrit par l'utilisateur ne correspond à rien dans le fichier JSON.
        if (userCityData){
            const latitudeSearched = userCityData['lat'];
            const longitudeSearched = userCityData['lng'];
            window.data.city = this.cityData;
            window.data.resetAnimation=true;
            new Wind(latitudeSearched,longitudeSearched);
        } else {
            alert('La ville saisie n\'existe pas.');
            window.data.city = "";
        }
    }

    //Méthode permettant de récupérer les données des villes stockées dans le fichier JSON france-cities.json.
    getData() {
        //On saisit l'adresse où trouver les données.
        fetch('../data/france-cities.json')
            .then(response => {
                //On gère les erreurs de réseau
                if (!response.ok){
                    throw new Error('Erreur de réseau');
                }
                //On convertit la réponse au format json.
                return response.json()
            } )
            .then(data => {
                //On enregistre les données récupérées dans la propriété cities.
                this.cities = data;
            })
            .catch(error => {
                //On gère les erreurs de la requête.
                console.log('Erreur de fetch',error);
            })
    }

    //Méthode permettant de retrouver la ville saisie par l'utilisateur dans la liste de toutes les villes récupérées
    // dans la variable cities.
    getCityData(city) {
        //On vient corriger la saisie de l'utilisateur pour que tout soit en minuscule.
        const cityLower = city.toLowerCase();
        this.cityData = [];
        for (let i = 0; i < this.cities.length; i++) {
            //On vient mettre également le nom de la ville présent dans les données en minuscule.
            const cityDataLower = this.cities[i].city.toLowerCase();
            //On compare les 2 noms de ville en minuscule.
            if (cityDataLower == cityLower){
                this.cityData = this.cities[i];
                return this.cityData;
                break;
            }
        }
    }

}

export{Search};