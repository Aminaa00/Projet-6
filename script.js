console.log("Bonjour ceci est mon fichier JavaScript :)");


document.addEventListener("DOMContentLoaded", function() {
    const bookListDiv = document.createElement("div");
    const divContent = document.getElementById('content');
    console.log("On affiche la variable divContent",divContent);


    bookListDiv.id= 'bookList';
    divContent.appendChild(bookListDiv);

    // Sélection de l'élément body
    const body = document.body;

    // Création élément bouton
    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter un livre';
    addButton.id = 'addBookButton'; // Ajout ID au bouton pour pouvoir le styler

    // Ajout gestionnaire d'événement au bouton "Ajouter un livre"
    addButton.addEventListener('click', afficherFormulaireRecherche);

    // Ajout bouton "Ajouter un livre" à la page
    body.appendChild(addButton);

});


function afficherFormulaireRecherche() {
    // Masquer le bouton "Ajouter un livre"
    const addButton = document.getElementById('addBookButton');
    addButton.style.display = 'none';
    
    // Création formulaire de recherche
    const searchForm = document.createElement('form');
    searchForm.id = 'searchForm';

    // Création champ "titre du livre"
    const labelTitreLivre = document.createElement('label');
    labelTitreLivre.textContent = 'Titre du livre :';
    const inputTitreLivre = document.createElement('input'); //saisie
    inputTitreLivre.type = 'text';
    inputTitreLivre.id = 'titreLivre';
    inputTitreLivre.name = 'titreLivre';
    inputTitreLivre.required = true;

    // Création champ "auteur"
    const labelAuteur = document.createElement('label');
    labelAuteur.textContent = 'Auteur :';
    const inputAuteur = document.createElement('input');
    inputAuteur.type = 'text';
    inputAuteur.id = 'auteur';
    inputAuteur.name = 'auteur';
    inputAuteur.required = true;

    // Création bouton "Rechercher"
    const buttonRechercher = document.createElement('button');
    buttonRechercher.type = 'submit';
    buttonRechercher.textContent = 'Rechercher';

    // Création du bouton "Annuler"
    const buttonAnnuler = document.createElement('button');
    buttonAnnuler.type = 'button';
    buttonAnnuler.textContent = 'Annuler';
    buttonAnnuler.addEventListener('click', annulerRecherche);

    // Ajoute les champs et le bouton au formulaire
    searchForm.appendChild(labelTitreLivre);
    searchForm.appendChild(inputTitreLivre);
    searchForm.appendChild(labelAuteur);
    searchForm.appendChild(inputAuteur);
    searchForm.appendChild(buttonRechercher);
    searchForm.appendChild(buttonAnnuler);

    // Ajoute formulaire de recherche à la page
    const divContent = document.getElementById('content');
    divContent.appendChild(searchForm);

    // Ajoute gestionnaire d'événement pour la soumission du formulaire
    searchForm.addEventListener('submit', rechercherLivres);

    // Créer le bloc pour afficher les résultats de recherche
    const blocResultats = document.createElement('div');
    blocResultats.id = 'resultatsRecherche';
    divContent.appendChild(blocResultats);
}


function rechercherLivres(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre
  
    //Récupération des valeurs du formulaire de recherche
    const inputTitreLivre = document.getElementById('titreLivre');
    const inputAuteur = document.getElementById('auteur');
    const titreRecherche = inputTitreLivre.value;
    const auteurRecherche = inputAuteur.value;


    // Vérifie si les champs ne sont pas vides
    if (titreRecherche.trim() === '' || auteurRecherche.trim() === '') {
        alert('Les champs "Titre du livre" et "Auteur" doivent être remplis.');
        return;
    }
  
    const listeLivres = [
        { titre: "Harry Potter à l'école des sorciers", auteur: "J K Rowlings" },
        { titre: "Blanche Neige et autres contes", auteur: "Wilhelm Grimm" },
        { titre: "Cendrillon", auteur: "Charles Perrault" },
        { titre: "Twilight Fascination", auteur: "Stephenie Meyer" },
        // etc...
    ];

    // Recherche en utilisant les valeurs de titreRecherche et auteurRecherche
    const resultats = listeLivres.filter((livre) => {
        const titreMatch = livre.titre.toLowerCase().includes(titreRecherche.toLowerCase());
        const auteurMatch = livre.auteur.toLowerCase().includes(auteurRecherche.toLowerCase());
        return titreMatch && auteurMatch;
    });

    // Appele la fonction afficherResultatsRecherche() pour afficher résulats
    afficherResultatsRecherche(resultats);
}



function afficherResultatsRecherche(resultats) {
    const blocResultats = document.getElementById('resultatsRecherche');
    blocResultats.innerHTML = ''; // Supprime les anciens résultats

    // Création des éléments HTML pour afficher les résultats de recherche
    resultats.forEach((livre) => {
        const livreDiv = document.createElement('div');
        livreDiv.textContent = livre.titre + ' - ' + livre.auteur;
        blocResultats.appendChild(livreDiv);
    });
}

function annulerRecherche() {
    // Réinitialise les champs du formulaire
    const inputTitreLivre = document.getElementById('titreLivre');
    const inputAuteur = document.getElementById('auteur');
    inputTitreLivre.value = '';
    inputAuteur.value = '';

    // Supprime les résultats de recherche affichés
    const blocResultats = document.getElementById('resultatsRecherche');
    blocResultats.innerHTML = '';

    // Supprime le formulaire de recherche
    const searchForm = document.getElementById('searchForm');
    searchForm.remove();

    // Affiche à nouveau le bouton "Ajouter un livre"
    const addButton = document.getElementById('addBookButton');
    addButton.style.display = 'block';
}


/**function ajouterLivre(titre) {
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
ajouterLivre("Harry Potter et l'Ordre du phénix");**/
