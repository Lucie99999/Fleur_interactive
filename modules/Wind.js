/*
Fonctionnalités de la classe Wind :
En fonction de la latitude et de la longitude de la ville recherchée et en temps réel
- récupérer la vitesse du vent
- récupérer la direction du vent
- Bonus : actualiser les données toutes les 15 minutes

On définit la classe Wind qui va réaliser toutes les fonctionnalités citées ci-dessus.
 */
import {Flower} from './Flower.js';

class Wind {

    //Constructeur de la classe Wind
    constructor(latitude,longitude){
        //On définit les propriétés de la classe.
        this._latitude = latitude;
        this._longitude = longitude;
        this._url='';
        //On lance certaines méthodes de la classe à son instanciation.
        this.init();
    }

    //Méthode permettant de lancer des fonctions choisies de la classe Wind.
    init(){
        this.buildURL();
        this.getWindData();
    }

    //Méthode permettant de construire l'URL servant à la connexion à l'API en détails
    buildURL(){
        const base = 'https://api.open-meteo.com/v1/forecast';
        const requiredLatitude = 'latitude='+this._latitude;
        const requiredLongitude = 'longitude='+this._longitude;
        const params = ['wind_speed_10m','wind_direction_10m'];
        const paramsStringList = params.join(',');
        this._url= base + '?' + requiredLatitude + '&' + requiredLongitude + '&current=' + paramsStringList;
    }

    //Méthode permettant de récupérer les données de vent depuis l'API en ligne Open-Meteo
    getWindData(){
        //URL de l'API
        fetch(this._url)
            .then(response => {
                if (!response.ok){
                    throw new Error ('Erreur de réseau');
                }
                return response.json();
            })
            .then(data => {
                window.data.windDirection = data.current.wind_direction_10m;
                window.data.windSpeed = data.current.wind_speed_10m;
                new Flower(50);
            })
            .catch(error => {
                console.log('Erreur de fetch',error);
            });
    }
}

export {Wind};