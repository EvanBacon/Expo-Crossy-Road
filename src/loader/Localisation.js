import * THREE from 'three';

class Localisation {
    static GetString(stringname) {
        let str = Localisation.Strings[stringname][this.userLang];
        if (str === undefined) {
            str = Localisation.Strings[stringname]["en"];
        }
        return str;
    }
}

let userLang = navigator.language || navigator.userLanguage;
userLang = userLang.slice(0, 2);
userLang = userLang.toLowerCase();
Localisation.userLang = userLang;
Localisation.Strings = {
    "upsell-title": {
        "en": "Play more Crossy Road!",
        "es": "Juega más Crossy Road!",
        "de": "Spiele mehr Crossy Road!",
        "fr": "Jouer à plus de Crossy Road!",
        "it": "Gioca ancora a Crossy Road!",
        "pl": "Zagraj więcej w Crossy Road!",
        "pt": "Jogue mais Crossy Road!"
    },
    "upsell-usp1": {
        "en": "A new Ocean world!",
        "es": "¡Un nuevo mundo \noceánico!",
        "de": "Eine neue Meereswelt!",
        "fr": "Un nouveau monde \nocéanique!",
        "it": "Un nuovo mondo \nOceanico!",
        "pl": "Nowy Świat Oceanów!",
        "pt": "Um novo mundo Oceano!"
    },
    "upsell-usp2": {
        "en": "12 new characters!",
        "es": "12 nuevos personajes",
        "de": "12 neue Charaktere",
        "fr": "12 nouveaux\npersonnages",
        "it": "12 nuovi personaggi",
        "pl": "12 nowych postaci",
        "pt": "12 novos personagens"
    },
    "upsell-usp3": {
        "en": "Play for free",
        "es": "Juega gratis",
        "de": "Spiele gratis",
        "fr": "Jouer gratuitement",
        "it": "Gioca gratuitamente",
        "pl": "Zagraj za darmo",
        "pt": "Jogue de graça"
    },
    "upsell-download": {
        "en": "Download app on\nphone or tablet",
        "es": "Descarga la app al\ncelular o tableta",
        "de": "App downloaden auf\nHandy oder Tablet",
        "fr": "Télécharger l'appli sur\nmobile ou tablette",
        "it": "Scarica l'app su\nsmartphone o tablet",
        "pl": "Ściągnić aplikację na\ntelefon lub tablet",
        "pt": "Faça o download do aplicativo\nno celular ou tablet"
    },
    "upsell-footer": {
        "en": "get the full version\nfor free:",
        "es": "Obtén la versión\ncompleta gratis:",
        "de": "Hole dir die Vollversion kostenlos:",
        "fr": "Obtiens la version complète gratuite:",
        "it": "Ottieni la versione completa gratuitamente:",
        "pl": "Zyskaj pełną wersję za darmo:",
        "pt": "Obtenha a versão completa gratuitamente:"
    },
    "play-as-trex": {
        "en": "Play as t-rex",
        "es": "Juega como\nt-rex",
        "de": "Spiele als\nT-Rex",
        "fr": "Jouez t-rex",
        "it": "Gioca con TRex",
        "pl": "Graj jako\nT-rex",
        "pt": "Jogue como\num T-rex"
    },
    "win-a-prize": {
        "en": "win a prize",
        "de": "preis gewinnen",
        "es": "ganar un premio",
        "fr": "réclamez un prix",
        "it": "vinci un premio",
        "pt": "ganhe um prêmio",
        "pl": "Wygraj nagrodę"
    },
    "coins-to-go": {
        "en": "XXX ¢ to go",
        "de": "Noch XXX ¢",
        "es": "Faltan XXX ¢",
        "fr": "Encore XXX ¢",
        "it": "Mancano XXX ¢",
        "pt": "Falta(m) XXX ¢",
        "pl": "XXX ¢ zostało"
    },
    "earn-coins": {
        "en": "Free ¢",
        "de": "¢ verdienen",
        "es": "Ganar ¢",
        "fr": "Gagnez des ¢",
        "it": "Vinci ¢",
        "pt": "Ganhe ¢",
        "pl": "Zdobądź ¢"
    },
    "coins-earned": {
        "en": "XXX ¢ earned",
        "de": "XXX ¢ verdient",
        "es": "XXX ¢ ganadas",
        "fr": "XXX ¢ gagnés",
        "it": "XXX ¢ vinti",
        "pt": "Ganhou XXX ¢",
        "pl": "XXX ¢ zdobytych"
    },
    "new": {
        "en": "New!",
        "de": "Neu!",
        "es": "¡Nuevo!",
        "fr": "Nouveau!",
        "it": "Nuovo!",
        "pl": "Nowa!",
        "pt": "Novo!"
    },
    "duplicate": {
        "en": "Duplicate!",
        "de": "Duplikat!",
        "es": "¡Duplicado!",
        "fr": "Double!",
        "it": "Doppio!",
        "pl": "Duplikat!",
        "pt": "Duplicado!"
    },
    "not-available-as-prize": {
        "en": "Not available from\nthe prize machine",
        "de": "Nicht von der\nPreismaschine verfügbar",
        "es": "No disponible en la\nmaquina de premios",
        "fr": "Indisponible au\ndistributeur de prix",
        "it": "Non disponibile con\nla macchina dei premi",
        "pt": "Indisponível na\nmáquina de prêmios",
        "pl": "Nie jest dostępny z\nautomatu do nagród"
    },
    "free-gift": {
        "en": "Free gift",
        "de": "Geschenk",
        "es": "Regalo gratis",
        "fr": "Cadeau gratuit",
        "it": "Premio",
        "pt": "Brinde",
        "pl": "Bezpłatny prezent"
    },
    "free-gift-in-time": {
        "en": "Free gift in ±XXXh YYYm",
        "de": "Geschenk in ±XXXh ±YYYm",
        "es": "Regalo gratis en\n±XXXh YYYm",
        "fr": "Cadeau dans ±XXXh YYYm",
        "it": "Regalo gratis in\n±YYY minuti",
        "pt": "Presente grátis em\n±XXXh YYYm",
        "pl": "Bezpłatny prezent za\n±XXXh YYYm"
    },
    "free-gift-in-time-hours": {
        "en": "Free gift in ±XXXh",
        "de": "Geschenk in ±XXXh",
        "es": "Regalo gratis en\n±XXXh",
        "fr": "Cadeau dans ±XXXh",
        "it": "Regalo gratis in\n±XXX ore",
        "pt": "Presente grátis em\n±XXXh",
        "pl": "Bezpłatny prezent za\n±XXX godzin"
    },
    "free-gift-in-time-minutes": {
        "en": "Free gift in ±YYYm",
        "de": "Geschenk in ±YYYm",
        "es": "Regalo gratis en\n±YYYm",
        "fr": "Cadeau dans ±YYYm",
        "it": "Nuovo regalo in\n±XXX ore YYY minuti",
        "pt": "Presente grátis em\n±YYYm",
        "pl": "Bezpłatny prezent za\n±YYYm"
    },
    "chicken": {
        "en": "Chicken",
        "de": "Huhn",
        "es": "Gallina",
        "fr": "Poulet dodu",
        "pl": "Kurczak",
        "pt": "Galinha",
        "it": "Pollo"
    },
    "duck": {
        "en": "Mallard",
        "de": "Stockente",
        "es": "Pato salvaje",
        "fr": "Canard boiteux",
        "it": "Anatra selvatica",
        "pl": "Krzyżówka",
        "pt": "Pato Real"
    },
    "robot": {
        "en": "Rusty Robot",
        "de": "Roboter",
        "es": "Robot oxidado",
        "fr": "Robot rouillé",
        "it": "Robot arrugginito",
        "pl": "Zardzewiały Robot",
        "pt": "Robô Lata-Velha"
    },
    "cat": {
        "en": "Lucky Cat",
        "de": "Glückskatze",
        "es": "Gato de la suerte",
        "fr": "Chat heureux",
        "it": "Gatto fortunato",
        "pl": "Kot Szczęśliwiec",
        "pt": "Gato de Sorte"
    },
    "snail": {
        "en": "Swift Snail",
        "de": "Schnecke",
        "es": "Caracol veloz",
        "fr": "Escargot véloce",
        "it": "Lumaca sprint",
        "pl": "Błyskawiczny Ślimak",
        "pt": "Lesma Veloz"
    },
    "trex": {
        "en": "???"
    },
    "space_chicken": {
        "en": "Space Chicken",
        "de": "Raumhuhn",
        "es": "Pollo Espacial",
        "fr": "Poulet de l'Espace",
        "it": "Pollo Spaziale",
        "pl": "Kosmiczny Kurczak",
        "pt": "Frango Espacial"
    },
    "space_chicken_carousel": {
        "en": "Space Chicken"
    },
    "space_chicken_glass": {
        "en": "Space Chicken Glass"
    },
    "astronaut": {
        "en": "Astronaut",
        "de": "Astronaut",
        "es": "Astronauta",
        "fr": "Astronaute",
        "it": "Astronauta",
        "pl": "Astronauta",
        "pt": "Astronauta"
    },
    "astronomer": {
        "en": "Astronomer",
        "de": "Astronom",
        "es": "Astrónomo",
        "fr": "Astronome",
        "it": "Astronomo",
        "pl": "Astronom",
        "pt": "Astrônomo"
    },
    "rover": {
        "en": "Rover",
        "de": "Rover",
        "es": "Rover",
        "fr": "Astromobile",
        "it": "Rover",
        "pl": "Rover",
        "pt": "Viajante"
    },
    "robot_dog": {
        "en": "Robot Dog",
        "de": "Roboterhund",
        "es": "Perro Robot",
        "fr": "Chien Robot",
        "it": "Cane Robot",
        "pl": "Pies Robot",
        "pt": "Cachorro Robô"
    },
    "robot_dog_pickup": {
        "en": "Robot Dog Pickup"
    },
    "moon_cheese": {
        "en": "Moon Cheese",
        "de": "Mondkäse",
        "es": "Queso Lunar",
        "fr": "Fromage de Lune",
        "it": "Luna di Formaggio",
        "pl": "Księżycowy Ser",
        "pt": "Lua de Queijo"
    },
    "space_dog": {
        "en": "Space Dog",
        "de": "Raumhund",
        "es": "Perro Espacial",
        "fr": "Chien de l'Espace",
        "it": "Cane Spaziale",
        "pl": "Kosmiczny Pies",
        "pt": "Cachorro Espacial"
    },
    "space_walker": {
        "en": "Space Walker",
        "de": "Raumgänger",
        "es": "Caminante Especial",
        "fr": "Marcheur de l'Espace",
        "it": "Space Walker",
        "pl": "Kosmiczny Spacerowicz",
        "pt": "Caminhante Especial"
    },
    "moon_rock": {
        "en": "Moon Rock",
        "de": "Mondgestein",
        "es": "Roca Lunar",
        "fr": "Pierre de Lune",
        "it": "Roccia Lunare",
        "pl": "Kamień Księżycowy",
        "pt": "Pedra da Lua"
    },
    "hipster_whale": {
        "en": "Hipster Whale"
    },
    "space_walker_anim_2": {
        "en": ""
    },
    "space_walker_anim_3": {
        "en": ""
    },
    "space_walker_anim_4": {
        "en": ""
    },
    "space_walker_idle_anim_1": {
        "en": ""
    },
    "space_walker_idle_anim_2": {
        "en": ""
    },
    "space_walker_rainbow_anim_1": {
        "en": ""
    },
    "space_walker_rainbow_anim_2": {
        "en": ""
    },
    "space_walker_rainbow_anim_3": {
        "en": ""
    },
    "space_walker_rainbow_anim_4": {
        "en": ""
    },
    "space_walker_rainbow_anim_5": {
        "en": ""
    },
    "space_walker_rainbow_anim_6": {
        "en": ""
    },
    "space_walker_rainbow_anim_7": {
        "en": ""
    },
    "space_walker_rainbow_anim_8": {
        "en": ""
    }
};
export default Localisation;