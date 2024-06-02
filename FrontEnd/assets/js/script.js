let urlApi = "http://localhost:5678/api";

// Récupère et affiche les travaux
getWorks();

// Vérifie si l'utilisateur est connecté et récupère les catégories si non connecté
if (!isLogged()) {
    getCategories();
}

// Fonction pour récupérer les travaux depuis l'API et les afficher
function getWorks() {
    fetch(urlApi + "/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (works) {
        const gallery = document.querySelector("#gallery");
        gallery.innerHTML = "";
        for (let i in works) {
            figure = createFigure(works[i]);
            gallery.appendChild(figure);
        }
    });
}

// Fonction pour récupérer les catégories depuis l'API et les afficher
function getCategories() {
    fetch(urlApi + "/categories")
    .then(function (response) {
        return response.json();
    })
    .then(function (categories) {
        // Création des autres bouttons
        createFilterButton(0, "Tous");
        for (let i of categories) {
            createFilterButton(i.id, i.name);
        }
    });
}

// Création d'un bouton
function createFilterButton(id, text) {
    const categoriesDiv = document.getElementById("categories");
    button = createButton(id, text, "filterButton");
    
    button.dataset.categorie = id;
    
    button.addEventListener("click", (e) => {
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
    figcaption.appendChild(figcaptionContent);
    
    // création d'une figure
    let figure = document.createElement("figure");
    figure.setAttribute("data-id", work.id);
    figure.appendChild(image);
    figure.appendChild(figcaption);
    
    return figure;
}

// Fonction pour récupérer et afficher les travaux par catégorie
function getWorksByCategorie(id) {
    fetch(urlApi + "/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (works) {
        const gallery = document.querySelector("#gallery");
        gallery.innerHTML = "";
        for (let i in works) {
             // Affiche tous les travaux ou ceux de la catégorie sélectionnée
            if (id == 0 || id == works[i].categoryId) {
                figure = createFigure(works[i]);
                gallery.appendChild(figure);
            }
        }
    });
}

// Fonction pour récupérer le token stocké dans le localStorage
function getTokenForAPI() {
    return localStorage.getItem("token");
}

// Vérifie si l'utilisateur est connecté en validant le token
function isLogged() {
    // Si on trouve le token ou pas
    let token = localStorage.getItem("token");
    if (token) {
        // Décode le token JWT
        const jwt = JSON.parse(atob(token.split(".")[1]));
        // Obtient le temps actuel en secondes
        const now = Math.floor(Date.now() / 1000);
        // Vérifie si le token est expiré
        return jwt.exp > now;
    }
    return false;
}

// Met à jour l'affichage du bouton de connexion/déconnexion
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

// Met à jour le bouton de connexion à chaque chargement de page
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
    localStorage.removeItem("token"); // Supprimer le token du localStorage
    window.location.href = "index.html"; // Redirection vers la page d'accueil
}

// Fonction pour afficher le bouton "Modifier"
function showEditButton() {
    const editButton = document.querySelector(".js-modal");
    editButton.style.display = "block";
}

// Fonction pour supprimer les catégories
function removeCategories() {
    const divCategories = document.getElementById("categories");
    divCategories.remove();
}

// // Fonction pour afficher le mode edition
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

function createButton(id, text, buttonClass) {
    let button = document.createElement("button");
    let buttonContent = document.createTextNode(text);
    
    button.appendChild(buttonContent);
    button.classList.add(buttonClass);
    
    return button;
}

// CREATION DE LA MODALE

let modal = null;
// Identification des champs focusables dans la modal
const focusableSelector = "button, input";
let focusables = [];
// Retenir l'élément focus avant ouverture de la modal
let lastFocusedElement = null;

// Ouverture de la modal
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    // Reset la modale pour qu'elle affiche la vue gallerie à chaque ouverture
    resetModal();
    // Appel de la fonction pour récupérer les works
    getWorksInModal();
    // On renvoie les focusables sous forme de tableau
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    // Retenir l'élément focus avant ouverture de la modal
    lastFocusedElement = document.querySelector(":focus");
    // Mettre 1er élément de la boite modal en focus par défaut
    modal.style.display = null;
    focusables[0].focus();
    // Ajoute d'un event listener pour écouter le bouton Ajouter photos
    document.querySelector(".modalButton").addEventListener("click", openAddPhotoModal);
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

// Fermeture de la modal
const closeModal = function (e) {
    if (modal === null) return;
    // Retrouver l'élément focus avant l'ouverture de la modal
    if (lastFocusedElement !== null) lastFocusedElement.focus();
    // e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hiden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    document.querySelector(".modalButton").removeEventListener("click", openAddPhotoModal);
    // Retour de la modale à son état initial
    resetModal();
    modal = null;
};

// Reset la modale pour n'afficher que la vue gallerie à l'ouverture
function resetModal() {
    const formDivAddPhoto = document.getElementById("formDivAddPhoto");
    const modalGallery = document.getElementById("modalGallery");
    const photoTitle = document.getElementById("photoTitle");
    const file = document.getElementById("photoFile");
    const categorySelect = document.getElementById("categorySelect");
    const modalButton = document.querySelector(".modalButton");
    const imgPreview = document.getElementById("imgPreview");
    const previewContainer = document.getElementById("previewContainer");

    // Réinitialiser les valeurs du formulaire
    photoTitle.value = "";
    file.value = "";
    categorySelect.innerHTML = "";

    // Réinitialiser la preview de la modal
    imgPreview.setAttribute('src', '');
    previewContainer.style.display = 'none';
    file.style.display = 'block';
    
    // Afficher la galerie et masquer le formulaire d'ajout de photo
    formDivAddPhoto.style.display = "none";
    modalGallery.style.display = "grid";

    // Forcer l'affichage du bouton Ajouter photos
    modalButton.style.display = "block";
}

// Stoper la propagation de la modal -> cliquer dehors ou sur boutton = fermer la modal
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Création d'une fonction pour focus les éléments naviguable avec Tab
const focusInModal = function (e) {
    e.preventDefault();
    // Trouver l'élément focus et le mettre en index pour pouvoir continuer la Tab
    let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
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
};

// Ecoute du click pour ouvrir la modal lors du clic sur le lien
let modifyButton = document.querySelector(".js-modal");
modifyButton.addEventListener("click", openModal);

// Ecouter les touches du clavier pour sortir de la modal avec Esc et naviguer avec Tab
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});

// Récupérer les works dans la modal
function getWorksInModal() {
    fetch(urlApi + "/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (works) {
        const modalGalley = document.getElementById("modalGallery");
        modalGalley.innerHTML = "";
        for (let i in works) {
            const modalFigure = createModalFigure(works[i]);
            modalFigure.id = works[i].id; // Définit l'ID de la figure
            modalGalley.appendChild(modalFigure);
            
            // Création du bouton Supprimer avec une icône
            const deleteButtonModal = document.createElement("button");
            deleteButtonModal.innerHTML = '<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>';
            deleteButtonModal.classList.add("deleteButtonModal");
            
            // Écouteur d'événements pour le bouton Supprimer
            deleteButtonModal.addEventListener("click", () => {
                deleteFigureFromModal(works[i].id);
            });
            
            modalFigure.appendChild(deleteButtonModal);
        }
    });
}

function createModalFigure(work) {
    // Création d'une image dans la modal
    let image = document.createElement("img");
    image.src = work.imageUrl;
    
    // création d'une figure dans la modal
    let modalFigure = document.createElement("figure");
    modalFigure.classList.add("modalFigure");
    modalFigure.setAttribute("id", work.id);
    modalFigure.appendChild(image);
    
    return modalFigure;
}

// Supprimer des figures de la modale
function deleteFigureFromModal(modalFigureId) {
    fetch(urlApi + "/works/" + modalFigureId, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
    .then((response) => {
        if (response.ok) {
            const modalFigure = document.getElementById(modalFigureId);
            if (modalFigure) {
                modalFigure.remove();
            }
            // Supprimer l'élément de la galerie principale
            const galleryFigure = document.querySelector(`#gallery figure[data-id="${modalFigureId}"]`);
            if (galleryFigure) {
                galleryFigure.remove();
            }
        }
    })
}

// Fonction pour ouvrir la fenêtre modale d'ajout de photo
function openAddPhotoModal(e) {
    e.preventDefault();
    document.getElementById("titleModal").textContent = "Ajouter une photo";
    document.querySelector(".modalButton").style.display = "none";

    const formDivAddPhoto = document.getElementById("formDivAddPhoto");
    const modalGallery = document.getElementById("modalGallery");
    const categorySelect = document.getElementById("categorySelect");
    
    modalGallery.style.display = "none";
    formDivAddPhoto.style.display = "flex";

    categorySelect.innerHTML = "";

    fetch(urlApi + "/categories")
    .then(response => response.json())
    .then(categories => {
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        categorySelect.appendChild(defaultOption);
        for (let i in categories) {
            const option = document.createElement("option");
             // Définit la valeur de l'option
            option.setAttribute("value", categories[i].id);
            option.innerHTML = categories[i].name;
            categorySelect.appendChild(option);
        }
    });

    const form = document.querySelector("#formData");
    form.removeEventListener("submit", addPhoto);
    form.addEventListener("submit", addPhoto);
}

// Fonction pour ajouter une preview du fichier ajouté
document.addEventListener('DOMContentLoaded', function() {
    const photoFileInput = document.getElementById('photoFile');
    const imgPreview = document.getElementById('imgPreview');
    const previewContainer = document.getElementById('previewContainer');
    const closePreview = document.getElementById('closePreview');
    const formDataForm = document.getElementById('formData');

    // Prévisualisation de l'image
    photoFileInput.addEventListener('change', function() {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function() {
                imgPreview.setAttribute('src', this.result);
                previewContainer.style.display = 'block';
                photoFileInput.style.display = 'none';
            });

            reader.readAsDataURL(file);
        }
    });

    // Fermer la prévisualisation de l'image
    closePreview.addEventListener('click', function() {
        imgPreview.setAttribute('src', '');
        previewContainer.style.display = 'none';
        photoFileInput.value = ''; // Réinitialise l'input file
        photoFileInput.style.display = 'block';
    });

    // Envoi de la photo
    formDataForm.addEventListener('submit', addPhoto);
});

// Fonction dédiée pour ajouter une photo
function addPhoto(e) {
    e.preventDefault();
    const image = document.getElementById("photoFile");
    const title = document.getElementById("photoTitle");
    const category = document.getElementById("categorySelect");

    // Vérifier le mime type
    if (!["image/jpeg", "image/png"].includes(image.files[0].type)) {
        alert("Seuls les fichiers JPG et PNG sont autorisés.");
        return;
    }

    // Récupère l'ID de la catégorie sélectionnée
    const selectedCategoryID = category.value;

    const formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("title", title.value);
    formData.append("category", selectedCategoryID);

    fetch(urlApi + "/works", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        // Ajoute le FormData en tant que corps de la requête
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi : " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert("Photo ajoutée avec succès !");
        closeModal();
        getWorks(); // Actualiser les photos après ajout
        getWorksInModal();
    })
}
