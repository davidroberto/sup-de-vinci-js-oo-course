// Le langage Js en lui même ne possède pas de notion de classe, il possède un modèle objet basé sur les prototypes.
// les classes en Js sont du sucre syntaxique pour les fonctions constructeurs et les prototypes.


class DomNodeFactory {

    // la syntaxe arrow function pour définir les fonctions est utile
    // en dehors des méthodes de classe car elle permet de garder le contexte de this
    // qui est généralement redéfini dans les fonctions classiques et fait référence 
    // au contexte de la fonction

    // dans une classe, on évite d'utiliser la syntaxe arrow function pour définir les méthodes
    // car les fonctions définies avec les arrow functions ne pourront pas être redéfinies
    // dans les classes enfants
    createNodeElement(type, classes, text = '') {
        const element = document.createElement(type);


        // le destructuring permet de décomposer un objet ou un tableau
        // en plusieurs variables
        element.classList.add(...classes);

        if (text !== '') { 
            element.textContent = text;
        }
        
        return element;
    } 
}


class CocktailFetcher {
    async fetchRandomCocktail() {
        try {
            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s');
            const responseJson = await response.json();
            return responseJson.drinks;
        } catch (error) {
            throw new Error("An error occured while fetching the cocktail data");
        }
    }
}


// on peut hériter d'une classe en JS avec le mot clé extends
// le mot clé extend est uniquement du sucre syntaxique pour l'héritage par prototype
// l'héritage par prototype est une technique qui permet de partager des propriétés et des méthodes
// entre plusieurs objets
class CocktailViewFactory extends DomNodeFactory {

    createCocktailCard(cocktailInfo, root) {
        const cardContent = this.createCocktailCardContent(
            cocktailInfo.strDrinkThumb,
            cocktailInfo.strDrink,
            cocktailInfo.strCategory,
            cocktailInfo.strInstructions
        );

        const div = this.createNodeElement('div', ['cocktailDiv']);
        div.innerHTML = cardContent;
        root.appendChild(div);
    }

    createCocktailCardContent(image, name, subtitle, description) {
        return `
        <div class="card" style="width: 18rem;">
            <img src="${image}" class="card-img-top" alt="${name}">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${subtitle}</h6>
                <p>${description}</p>
            </div>
        </div>`;
    }
}


class DomInitializer extends DomNodeFactory {

    // la fonction constructor est appelée automatiquement lors de l'instanciation de la classe
    constructor() {
        // le mot clé super permet d'appeler le constructeur de la classe parente
        // quand une classe hérite d'une autre classe et qu'on utilise
        // le constructeur dans la classe enfant
        // il est obligatoire d'appeler le constructeur de la classe parente
        // avec le mot clé super
        super();

        // on injecte les dépendances de notre classe
        // ici notre classe DomInitializer dépend de la classe CocktailFetcher 
        // et de la classe CocktailViewFactory
        // donc je créé des propriétés cocktailFetcher et cocktailViewFactory
        // pour stocker l'instance de ces classes
        this.cocktailFetcher = new CocktailFetcher();
        this.cocktailViewFactory = new CocktailViewFactory();

        this.root = document.querySelector('#root');
    }

    init() {
        const button = this.createButton();

        button.addEventListener('click',  async() => {
            await this.displayCocktails();
        });
    }

    createButton() {
        const button = this.createNodeElement('button', ['btn', 'btn-primary'], 'Click me!');
        this.root.append(button);
        return button;
    }

    async displayCocktails() {
        const cocktailsInfo = await this.cocktailFetcher.fetchRandomCocktail();

        cocktailsInfo.map(cocktailInfo => {
            this.cocktailViewFactory.createCocktailCard(cocktailInfo, this.root);
        })
    }
}

const domInitializer = new DomInitializer();
domInitializer.init();