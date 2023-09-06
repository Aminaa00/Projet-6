console.log("Bonjour ceci est mon fichier JavaScript :)");


document.addEventListener("DOMContentLoaded", function() {

    var h2Element = document.querySelector("h2");
    const divMyBooks = document.getElementById('myBooks');
    const divContent = document.getElementById('content');

    const bookListDiv = document.createElement("div");
    bookListDiv.id = 'bookList';
    const divContentNode = divContent.parentNode;
    h2Element.parentNode.insertBefore(bookListDiv,h2Element)

    // Création conteneur pour le titre "Ma poch'liste"
    const titrePochListe = document.createElement("h2");
    titrePochListe.textContent = "Ma poch'liste";

    // Ajout titre "Ma poch'liste" en bas de la page
    divMyBooks.appendChild(titrePochListe);

    const pochListeContainer = document.createElement("div");
    pochListeContainer.id = 'pochListeContainer';
    divMyBooks.appendChild(pochListeContainer); //Sans ça = livres non ajoutés à Poch'liste


    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter un livre';
    addButton.id = 'addBookButton';
    addButton.addEventListener('click', afficherFormulaireRecherche);
    divContent.appendChild(addButton);

    const livresPochListe = sessionStorage.getItem('livresPochListe');
    if (livresPochListe) {
        const livres = JSON.parse(livresPochListe);
        livres.forEach(livre => {
            afficherLivreDansPochListe(livre);
        });
    }

    document.getElementById('pochListeContainer').addEventListener('click', function(event) {
        const deleteIcon = event.target.closest('.delete-icon');
        if (deleteIcon) {
            const livreId = deleteIcon.parentElement.id.replace('livrePochListe-', '');
            const livrePochListe = deleteIcon.closest('.livre-poch-liste');
            if (livreId && livrePochListe) {
                supprimerDeLaPochListe(livreId, livrePochListe);
            }
        }
    });
});


function afficherFormulaireRecherche() {

    // Masque bouton "Ajouter un livre"
    const addButton = document.getElementById('addBookButton');
    addButton.style.display = 'none';

    // Créér formulaire de recherche
    const searchForm = document.createElement('form');
    searchForm.id = 'searchForm';

    // Créer champ "titre du livre"
    const labelTitreLivre = document.createElement('label');
    labelTitreLivre.textContent = 'Titre du livre :';
    const inputTitreLivre = document.createElement('input'); //saisie
    inputTitreLivre.type = 'text';
    inputTitreLivre.id = 'titreLivre';
    inputTitreLivre.name = 'titreLivre';
    inputTitreLivre.required = true;

    // Créer champ "auteur"
    const labelAuteur = document.createElement('label');
    labelAuteur.textContent = 'Auteur :';
    const inputAuteur = document.createElement('input');
    inputAuteur.type = 'text';
    inputAuteur.id = 'auteur';
    inputAuteur.name = 'auteur';
    inputAuteur.required = true;

    // Créer bouton "Rechercher"
    const buttonRechercher = document.createElement('button');
    buttonRechercher.type = 'submit';
    buttonRechercher.textContent = 'Rechercher';
    buttonRechercher.classList.add('button');

    // Créer bouton "Annuler"
    const buttonAnnuler = document.createElement('button');
    buttonAnnuler.type = 'button';
    buttonAnnuler.textContent = 'Annuler';
    buttonAnnuler.classList.add('button');
    buttonAnnuler.addEventListener('click', annulerRecherche);
    
    // Ajout champs et bouton au formulaire
    searchForm.appendChild(labelTitreLivre);
    searchForm.appendChild(inputTitreLivre);
    searchForm.appendChild(labelAuteur);
    searchForm.appendChild(inputAuteur);
    searchForm.appendChild(buttonRechercher);
    searchForm.appendChild(buttonAnnuler);

    // Créer bloc pour afficher le trait de séparation
    const separator1 = document.createElement('hr');
    separator1.className = 'separator';

    // Ajout "résultats de recherche"
    const textResultats = document.createElement('h2');
    textResultats.textContent = "Résultats de recherche";
    textResultats.id = 'textResultats';

    // Ajoute gestionnaire d'événement pour la soumission du formulaire
    searchForm.addEventListener('submit', rechercherLivres);

    // Ajoute formulaire de recherche à la page + trait séparation + 'résultat de recherche'
    const divPochListeContainer = document.getElementById('content');
    divPochListeContainer.appendChild(searchForm);
    divPochListeContainer.appendChild(separator1);
    divPochListeContainer.appendChild(textResultats);


    textResultats.style.display = 'block';

    // Créer bloc pour afficher les résultats de recherche
    const blocResultats = document.createElement('div');
    blocResultats.id = 'resultatsRecherche';
    divPochListeContainer.appendChild(blocResultats);
}


function rechercherLivres(event) {
    event.preventDefault();
  
    //Récupération valeurs du formulaire de recherche
    const inputTitreLivre = document.getElementById('titreLivre');
    const inputAuteur = document.getElementById('auteur');
    const titreRecherche = inputTitreLivre.value;
    const auteurRecherche = inputAuteur.value;


    // Vérifie si champs = pas vides
    if (titreRecherche.trim() === '' || auteurRecherche.trim() === '') {
        alert('Les champs "Titre du livre" et "Auteur" doivent être remplis.');
        return;
    }

    // Recherche livres selon données saisies
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
            // Appelle fonction pour afficher résultats de recherche
            afficherResultatsRecherche(data.items);
            }
        });
}



function afficherResultatsRecherche(resultats) {
    const blocResultats = document.getElementById('resultatsRecherche');
    blocResultats.innerHTML = ''; // Supprime anciens résultats

    // Création éléments HTML pour afficher résultats de recherche
    resultats.forEach((livre) => {
        const livreDiv = document.createElement('div');
        livreDiv.classList.add('livre-resultat')

        livreDiv.innerHTML = `
        <div class="livre-resultat">
            <div class="livre-image-container">
                <img class="livre-image" src="${livre.volumeInfo.imageLinks ? livre.volumeInfo.imageLinks.thumbnail : 'unavailable.png'}" alt="Image du livre">
                <i class="fa-solid fa-bookmark bookmark-icon"></i>
            </div>
            <div class="livre-info-container">
                <div class="info-label">ID:</div>
                <div class="livre-id">${livre.id}</div>
                <div class="info-label">Titre:</div>
                <div class="livre-titre">${livre.volumeInfo.title}</div>
                <div class="info-label">Auteur:</div>
                <div class="livre-auteur">${livre.volumeInfo.authors ? livre.volumeInfo.authors[0] : 'Auteur inconnu'}</div>
                <div class="info-label">Description:</div>
                <div class="livre-description">${livre.volumeInfo.description ? livre.volumeInfo.description.substring(0, 200) : 'Information manquante'}</div>
            </div>
        </div>
        `;

        blocResultats.appendChild(livreDiv);

        // Gestionnaire d'événements pour l'icône marque-page
        const bookmarkIcons = livreDiv.querySelectorAll('.bookmark-icon');
        bookmarkIcons.forEach(function(icon) {
            icon.addEventListener('click', function() {
                ajouterALaPochListe(livre);
            });
        });
    });
}

function annulerRecherche() {
    // Réinitialise champs du formulaire
    const inputTitreLivre = document.getElementById('titreLivre');
    const inputAuteur = document.getElementById('auteur');
    inputTitreLivre.value = '';
    inputAuteur.value = '';

    // Supprime résultats de recherche affichés
    const blocResultats = document.getElementById('resultatsRecherche');
    blocResultats.remove();

    const separator = document.querySelector('.separator');
    console.log("separator= ",separator);
    separator.remove();


    // Supprime formulaire de recherche
    const searchForm = document.getElementById('searchForm');
    searchForm.remove();

    // Supprime l'élément "Résultats de recherche" s'il existe
    const textResultats = document.getElementById('textResultats');
    if (textResultats) {
        textResultats.remove();
    }

    // Affiche à nouveau bouton "Ajouter un livre"
    const addButton = document.getElementById('addBookButton');
    addButton.style.display = 'block';


}

function ajouterALaPochListe(livre) {
    const divPochListeContainer = document.getElementById('pochListeContainer');

    // Vérifie si livre existe déjà dans la liste
    const livresPochListe = sessionStorage.getItem('livresPochListe');
    let livres = livresPochListe ? JSON.parse(livresPochListe) : [];
    const livreExiste = livres.some(item => item.volumeInfo.title === livre.volumeInfo.title);

    if (livreExiste) {
        alert("Vous ne pouvez ajouter deux fois le même livre.");
    } else {
        // Créer élément de liste pour le livre à ajouter
        const livrePochListe = document.createElement('div');
        livrePochListe.classList.add('livre-poch-liste');
        livrePochListe.id = 'livrePochListe-' + livre.id;

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
            <i class="fas fa-trash delete-icon"></i>
            </div>
            <hr>
        `;

        // Enregistre les détails complets du livre dans la session
        livres.push(livre);
        sessionStorage.setItem('livresPochListe', JSON.stringify(livres));

        // Affiche livre dans la poch'liste
        afficherLivreDansPochListe(livre);
    }
}


function afficherLivreDansPochListe(livre) {
    const divPochListeContainer = document.getElementById('pochListeContainer');

    // Créer  élément de liste pour le livre à afficher
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
        <i class="fas fa-trash delete-icon"></i>
    </div>
    <hr>
`;

    // Ajout gestionnaire d'événements pour l'icône de corbeille
    const deleteIcon = livrePochListe.querySelector('.delete-icon');
    deleteIcon.addEventListener('click', () => supprimerDeLaPochListe(livre.id, livrePochListe));

    // Ajoute livre à la poch'liste
    divPochListeContainer.appendChild(livrePochListe);
}


function supprimerDeLaPochListe(livreId, livrePochListe) {
    // Supprime livre de la session storage
    const livresPochListe = sessionStorage.getItem('livresPochListe');
    let livres = livresPochListe ? JSON.parse(livresPochListe) : [];
    livres = livres.filter(item => item.id !== livreId);
    sessionStorage.setItem('livresPochListe', JSON.stringify(livres));
    
    // Supprime élément visuel du livre de la poch'liste
    livrePochListe.remove();
    }
