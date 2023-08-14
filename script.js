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

    // Afficher les livres enregistrés en session storage dans la poch'liste
    const livresPochListe = sessionStorage.getItem('livresPochListe');
    if (livresPochListe) {
        const livres = JSON.parse(livresPochListe);
        livres.forEach(livre => afficherLivreDansPochListe(livre));
    }

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

    // Recherche livres selon les données saisies
    const url = `https://www.googleapis.com/books/v1/volumes?q=${titreRecherche}+inauthor:${auteurRecherche}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('**** resultat Data : ', data);
            console.log('**** resultat data.totalItems : ', data.totalItems);

            if (data.totalItems === 0) {
                const blocResultats = document.getElementById('resultatsRecherche');
                blocResultats.innerHTML = '<p>Aucun livre n’a été trouvé.</p>';
            } else {
            // Appelle la fonction pour afficher les résultats de recherche
            afficherResultatsRecherche(data.items);
            }
        });
}



function afficherResultatsRecherche(resultats) {
    const blocResultats = document.getElementById('resultatsRecherche');
    blocResultats.innerHTML = ''; // Supprime les anciens résultats

    // Création des éléments HTML pour afficher les résultats de recherche
    resultats.forEach((livre) => {
        const livreDiv = document.createElement('div');
        livreDiv.classList.add('livre-resultat'); // Ajout classe pour le style

        livreDiv.innerHTML = `
        <div class="livre-resultat">
            <div class="livre-image-container">
                <img class="livre-image" src="${livre.volumeInfo.imageLinks ? livre.volumeInfo.imageLinks.thumbnail : 'unavailable.png'}" alt="Image du livre">
            </div>
            <div class="livre-info-container">
                <div class="livre-titre">${livre.volumeInfo.title}</div>
                <div class="livre-auteur">${livre.volumeInfo.authors ? livre.volumeInfo.authors[0] : 'Auteur inconnu'}</div>
                <div class="livre-description">${livre.volumeInfo.description ? livre.volumeInfo.description.substring(0, 200) : 'Information manquante'}</div>
                <button class="bookmark-button">Bookmark</button>
            </div>
        </div>
            `;

        blocResultats.appendChild(livreDiv);

        // Ajout gestionnaire d'événements pour le bouton "Bookmark"
        const bookmarkButton = livreDiv.querySelector('.bookmark-button');
        bookmarkButton.addEventListener('click', () => ajouterALaPochListe(livre));
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

function ajouterALaPochListe(livre) {
    const pochListeContainer = document.getElementById('pochListeContainer');

    // Vérifier si le livre existe déjà dans la liste
    const livresPochListe = sessionStorage.getItem('livresPochListe');
    let livres = livresPochListe ? JSON.parse(livresPochListe) : [];
    const livreExiste = livres.some(item => item.id === livre.id);

    if (livreExiste) {
        alert("Vous ne pouvez ajouter deux fois le même livre.");
    } else {
        // Créer un élément de liste pour le livre à ajouter
        const livrePochListe = document.createElement('div');
        livrePochListe.classList.add('livre-poch-liste');

        // Contenu HTML du livre dans la poch'liste
        livrePochListe.innerHTML = `
            <div class="livre-poch-liste-content">
                <img class="livre-image" src="${livre.volumeInfo.imageLinks ? livre.volumeInfo.imageLinks.thumbnail : 'unavailable.png'}" alt="Image du livre">
                <div class="livre-info">
                    <div class="livre-titre">${livre.volumeInfo.title}</div>
                    <div class="livre-auteur">${livre.volumeInfo.authors ? livre.volumeInfo.authors[0] : 'Auteur inconnu'}</div>
                    <div class="livre-description">${livre.volumeInfo.description ? livre.volumeInfo.description.substring(0, 200) : 'Information manquante'}</div>
                </div>
            </div>
            <button class="delete-button">Supprimer</button>
            <hr>
        `;

        // Ajouter le livre à la poch'liste
        pochListeContainer.appendChild(livrePochListe);

        /* // Ajouter l'icône de marque-page
        const bookmarkIcon = document.createElement('i');
        bookmarkIcon.classList.add('fas', 'fa-bookmark');
        livrePochListe.appendChild(bookmarkIcon);*/

        // Enregistrer les détails complets du livre dans la session
        livres.push(livre);
        sessionStorage.setItem('livresPochListe', JSON.stringify(livres));

        // Ajout gestionnaire d'événements pour le bouton "Supprimer"
        const deleteButton = livrePochListe.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => supprimerDeLaPochListe(livre, livrePochListe));
    
        // Enregistrer les détails complets du livre dans la session
        livres.push(livre);
        sessionStorage.setItem('livresPochListe', JSON.stringify(livres));

        /*// Afficher le livre dans la poch'liste
        afficherLivreDansPochListe(livre);*/

    }
}


function afficherLivreDansPochListe(livre) {
    const pochListeContainer = document.getElementById('pochListeContainer');

    // Créer un élément de liste pour le livre à afficher
    const livrePochListe = document.createElement('div');
    livrePochListe.classList.add('livre-poch-liste');

    // Contenu HTML du livre dans la poch'liste
    livrePochListe.innerHTML = `
        <div class="livre-poch-liste-content">
            <img class="livre-image" src="${livre.volumeInfo.imageLinks && livre.volumeInfo.imageLinks.thumbnail ? livre.volumeInfo.imageLinks.thumbnail : 'unavailable.png'}" alt="Image du livre">
            <div class="livre-info">
                <div class="livre-titre">${livre.volumeInfo.title}</div>
                <div class="livre-auteur">${livre.volumeInfo.authors ? livre.volumeInfo.authors[0] : 'Auteur inconnu'}</div>
                <div class="livre-description">${livre.volumeInfo.description ? livre.volumeInfo.description.substring(0, 200) : 'Information manquante'}</div>
            </div>
        </div>
        <button class="delete-button">Supprimer</button>
        <hr>
    `;

    // Ajouter le livre à la poch'liste
    pochListeContainer.appendChild(livrePochListe);

    // Ajout gestionnaire d'événements pour le bouton "Supprimer"
    const deleteButton = livrePochListe.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => supprimerDeLaPochListe(livre, livrePochListe));
}


function supprimerDeLaPochListe(livre, livreDiv) {
    // Supprimer le livre de la session storage
    const livresPochListe = sessionStorage.getItem('livresPochListe');
    let livres = livresPochListe ? JSON.parse(livresPochListe) : [];
    livres = livres.filter(item => item.id !== livre.id);
    sessionStorage.setItem('livresPochListe', JSON.stringify(livres));

    /*// Retirer l'icône de marque-page et ajouter l'icône de corbeille
    const icon = livreDiv.querySelector('.fa-bookmark');
    icon.classList.remove('fa-bookmark');
    icon.classList.add('fas', 'fa-trash-alt');*/

    // Supprimer l'élément de la poch'liste
    livreDiv.remove();
}