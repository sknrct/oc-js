
let urlApi = "http://localhost:5678/api";

getWorks();

if (!isLogged()) {
    getCategories();
}

// Affichage des works
function getWorks() {
    fetch(urlApi + "/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (works) {
        const gallery = document.querySelector("#gallery");
        gallery.innerHTML = "";
        for (let i in works) {
            //console.log(work.title, work.id);
            figure = createFigure(works[i]);
            gallery.appendChild(figure);
        }
    })
}

function getCategories() {
    fetch(urlApi + "/categories")
    .then(function (response) {
        return response.json();
    })
    .then(function (categories) {
        // Création des autres bouttons
        createFilterButton(0, "Tous");
        for (let i in categories) {
            createFilterButton(categories[i].id, categories[i].name); 
        }
    })
}

// Création d'un bouton
function createFilterButton(id, text){
    const categoriesDiv = document.getElementById("categories");
    button = createButton(id, text, 'filterButton');
    
    button.dataset.categorie = id;
    
    button.addEventListener('click', (e) => {
        // récupérer l'id de la catégorie
        getWorksByCategorie(e.target.getAttribute("data-categorie"));
    });
    categoriesDiv.appendChild(button);
}

// Création d'un titre
function createFigure(work) {
    // Création d'une image
    let image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    
    // création d'une figcaption
    let figcaption = document.createElement("figcaption");
    let figcaptionContent = document.createTextNode(work.title);
    figcaption.appendChild(figcaptionContent)
    
    // création d'une figure 
    let figure = document.createElement("figure");
    figure.appendChild(image);
    figure.appendChild(figcaption);
    
    return figure;
}

// 
function getWorksByCategorie(id) {
    fetch(urlApi + "/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (works) {
        const gallery = document.querySelector("#gallery");
        // vider la galerie + renseigner sur le innerHTML
        gallery.innerHTML = "";
        // Ajouter les autres éléments 
        for (let i in works) {
            // Si catégories egal 0 OU si catégorie egal works i
            if (id == 0 || id == works[i].categoryId) {    
                figure = createFigure(works[i]);
                gallery.appendChild(figure);
            }
        }
    }
)}

function getTokenForAPI() {
    return localStorage.getItem('token');
}

function isLogged() {
    // Si on trouve le token ou pas
    let token = localStorage.getItem('token');
    if (token) {
        // On récupère la partie charge utile du token
        const jwt = JSON.parse(atob(token.split(".")[1]));
        console.log(jwt);
        // On définie la date en fonction de mtn 
        const now = Math.floor(Date.now() / 1000);
        console.log(now);
        // Vérifie si le token est expiré en comparant le nombre de création et la date d'ajd 
        return jwt.exp > now;
    }
    return false;
}

function updateLoginButton() {
    const loginButton = document.getElementById("login");
    const editButton = document.querySelector(".js-modal");
    const editMode = document.querySelector(".editMode");

    if (isLogged()) {
        loginButton.innerHTML = "logout";
        loginButton.setAttribute("href", "#"); // Met à jour le href avec "#" pour empêcher la navigation
    } else {
        loginButton.innerHTML = "login";
        loginButton.setAttribute("href", "login.html");
        editButton.style.display = "none";
        editMode.style.display = "none";

    }
}

window.addEventListener("load", updateLoginButton);

const loginButton = document.getElementById("login");
loginButton.addEventListener("click", toggleLogin);

// Fonction pour gérer la connexion/déconnexion
function toggleLogin(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du lien

    if (isLogged()) {
        // Si l'utilisateur est connecté, le déconnecter
        logout();
    } else {
        // Rediriger vers la page de connexion
        window.location.href = "login.html";
    }
}

// Fonction pour déconnecter l'utilisateur
function logout() {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    window.location.href = "index.html"; // Redirection vers la page d'accueil
}

// Fonction pour afficher le bouton "Modifier"
function showEditButton() {
    const editButton = document.querySelector(".js-modal");
    editButton.style.display = "block";
}

function removeCategories() {
    const divCategories = document.getElementById("categories");    
    divCategories.remove();
}

function editMode() {
    const editMode = document.querySelector(".editMode");
    editMode.style.display = "flex";
    
}

if (isLogged()) {
    updateLoginButton();
    removeCategories();
    showEditButton();
    editMode();
}

function createButton(id, text, buttonClass){
    let button = document.createElement('button');
    let buttonContent = document.createTextNode(text);
    
    button.appendChild(buttonContent);
    button.classList.add(buttonClass);
    
    return button;
}

// CREATION DE LA MODALE 

let modal = null;
// Identification des champs focusables dans la modal
const focusableSelector = 'button, input';
let focusables = [];
// Retenir l'élément focus avant ouverture de la modal
let lastFocusedElement = null;

// Ouverture de la modal
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    console.log(modal);
    // Appel de la fonction pour récupérer les works 
    getWorksInModal();
    // On renvoie les focusables sous forme de tableau
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    // Retenir l'élément focus avant ouverture de la modal
    lastFocusedElement = document.querySelector(':focus');
    // Mettre 1er élément de la boite modal en focus par défaut
    modal.style.display = null;
    focusables[0].focus();
    // Ajoute d'un event listener pour écouter le bouton Ajouter photos
    document.querySelector('.modalButton').addEventListener('click', openAddPhotoModal);
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

// Fermeture de la modal
const closeModal = function (e) {
    if (modal === null) return;
    // Retrouver l'élément focus avant l'ouverture de la modal
    if (lastFocusedElement !== null) lastFocusedElement.focus();
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hiden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

// Stoper la propagation de la modal -> cliquer dehors ou sur boutton = fermer la modal
const stopPropagation = function (e) {
    e.stopPropagation();
}

// Création d'une fonction pour focus les éléments naviguable avec Tab
const focusInModal = function (e) {
    e.preventDefault();
    // Trouver l'élément focus et le mettre en index pour pouvoir continuer la Tab
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey) {
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

// Ecoute du click pour ouvrir la modal lors du clic sur le lien 
let modifyButton = document.querySelector('.js-modal');
modifyButton.addEventListener('click', openModal);

// Ecouter les touches du clavier pour sortir de la modal avec Esc et naviguer avec Tab
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
})

// Récupérer les works dans la modal 
function getWorksInModal() {
    fetch(urlApi + "/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (works) {
        const contentModal = document.querySelector(".contentModal");
        contentModal.innerHTML = "";
        console.log('Total works : ' + works.length);
        for (let i in works) {
            console.log(works[i].id);
            const modalFigure = createModalFigure(works[i]);
            modalFigure.id = works[i].id;
            contentModal.appendChild(modalFigure);
            
            // Création du bouton Supprimer avec une icône
            const deleteButtonModal = document.createElement('button');
            deleteButtonModal.innerHTML = '<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>'; 
            deleteButtonModal.classList.add('deleteButtonModal');
            
            // Écouteur d'événements pour le bouton Supprimer
            deleteButtonModal.addEventListener('click', () => {
                deleteFigureFromModal(works[i].id);
            });
            
            modalFigure.appendChild(deleteButtonModal);
        }
    })
}

function createModalFigure(work) {
    // Création d'une image dans la modal
    let image = document.createElement("img");
    image.src = work.imageUrl;
    
    // création d'une figure dans la modal
    let modalFigure = document.createElement("figure");
    modalFigure.classList.add("modalFigure")
    modalFigure.appendChild(image);
    
    return modalFigure;
}

// Supprimer des figures de la modale
function deleteFigureFromModal(modalFigureId) {
    console.log('Retrait de l\'élément avec l\'id' + modalFigureId);
    fetch(urlApi + "/works/" + modalFigureId, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }  
    })
    resetWorks();
}



// Fonction pour ouvrir la fenêtre modale d'ajout de photo
function openAddPhotoModal(e) {
    // Eviter de recharger la page en coupant le comportement par défaut
    e.preventDefault();
    // Mettre à jour le titre de la modal
    document.getElementById('titleModal').textContent = 'Ajouter une photo';

    const contentModal = document.querySelector(".contentModal");
    contentModal.innerHTML = "";
    
    document.querySelector(".modalButton").textContent = 'Valider';
    
    const title = document.createElement("input");
    const categorySelect = document.createElement("select");
    const file = document.createElement("input");

    title.setAttribute("type", "text");
    file.setAttribute("type", "file");
    
    const option = document.createElement("option");
    option.setAttribute("value", "");
    option.innerHTML = "";
    categorySelect.appendChild(option);
    
    
    fetch(urlApi + "/categories")
    .then(function (response) {
        return response.json();
    })
    .then(function (categories) {
        console.log(categories);
        
        for (let i in categories){
            const option = document.createElement("option");
            option.setAttribute("value", categories[i].id);
            option.innerHTML = categories[i].name;
            categorySelect.appendChild(option);
        }
    })

    contentModal.appendChild(file);
    contentModal.appendChild(title);
    contentModal.appendChild(categorySelect);
    
    // Créer un FormData pour envoyer les données

    //Au clic sur Valider
    const modalButton = document.querySelector(".modalButton");

    modalButton.addEventListener('click', (e) => {
        //Reprendre ce qui a été fait dans le login (
            //récupérer les valeurs du formulaire
            //créer le body (corps)
            //appeler l'endpoint API en POST
                //faire des trucs avec la réponse (genre dire bravo à l'user (où lui montrer que c'est ajouté))
        //)
        
        //console.log -> "Nouveau work créé"
        console.log("Nouveau work créé");
        resetWorks();
    });
    //Retourner à la première page de la modal (actualisée)
}

function resetWorks() {
    getWorksInModal();
    //On change le texte du titre et du bouton
    document.getElementById('titleModal').textContent = 'Galerie Photo';
    document.querySelector(".modalButton").textContent = 'Ajouter une photo';
    getWorks();
}

// Fonction pour télécharger et ajouter une photo
function uploadAndAddPhoto(file, title, categoryId) {
    // Vérifier le MIME Type du fichier
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('Seuls les fichiers JPG, PNG et PDF sont autorisés.');
        return;
    }

    // Envoyer une requête POST à l'API pour ajouter la photo
    fetch(urlApi + "/works", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
    })
    .then(response => response.json())
    .then(() => {
        // // Mettre à jour la galerie dans la fenêtre modale
        // getWorksInModal();
        // // Mettre à jour la galerie principale
        // getWorks();

        resetWorks();

        // Fermer la fenêtre modale
        closeModal();
    })
}