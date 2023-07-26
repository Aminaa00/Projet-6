console.log("Bonjour ceci est mon fichier JavaScript :)");

document.addEventListener("DOMContentLoaded", function() {
    const bookListDiv = document.createElement("div");
    const divContent = document.getElementById('content');
    console.log("On affiche la variable divContent",divContent);


    bookListDiv.id= 'bookList';
    divContent.appendChild(bookListDiv);


    // Sélectionner l'élément body
const body = document.body;

// Créer un élément bouton
const addButton = document.createElement('button');
addButton.textContent = 'Ajouter un livre';
addButton.id = 'addBookButton'; // Ajouter un ID au bouton pour pouvoir le styler

// Ajouter le bouton à la page
body.appendChild(addButton);


 });


const addBookButtonContainer = document.getElementById('addBookButton');
const addButton = document.createElement('button');
addButton.textContent = 'Ajouter un livre';
addBookButtonContainer.appendChild(addButton);


function ajouterLivre(titre) {
    const bookList = document.getElementById("bookList");

    // Créer un élément <div> pour le livre
    const livreDiv = document.createElement("div");
    livreDiv.classList.add("livre");
    
    // Créer un élément <h3> pour le titre du livre
    const titreLivre = document.createElement("h3");
    titreLivre.textContent = titre;

    // Ajouter le titre du livre à la div du livre
    livreDiv.appendChild(titreLivre);

    // Ajouter la div du livre à la section "Ma poch'liste"
    bookList.appendChild(livreDiv);
}

// Exemple d'ajout de livres à la section "Ma poch'liste"
ajouterLivre("Harry Potter à l'école des sorciers");
ajouterLivre("Harry Potter et la chambre des secrets");
ajouterLivre("Harry Potter et le Prisonnier d'Azkaban");
ajouterLivre("Harry Potter et la Coupe de feu");
ajouterLivre("Harry Potter et l'Ordre du phénix");