console.log(categories);
        const gallery = document.querySelector("#essai");
        for (let i in categories) {
            //Création d'un button
            let button = document.createElement("button");
            let buttonContent = document.createTextNode(categories[i].name);
            button.appendChild(buttonContent);
            // Ajouter une classe à un élément
            button.classList.add("button");
            console.log(button);
            // Attacher au dom
                // Trouver un point de montage
                const categoriesDiv = document.querySelector("#categories");
                // Ajouter l'élément au point de montage
                categoriesDiv.appendChild(button);
            //console.log(category.title, category.id);
            // gallery.appendChild(figure);
        }







        
        let buttonTous = document.createElement("button");
        buttonTous.dataset.categorie = 0;
        let buttonTousContent = document.createTextNode("Tous");
        buttonTous.appendChild(buttonTousContent);
        buttonTous.classList.add("button")
        const categoriesDiv = document.querySelector("#categories")
        buttonTous.addEventListener('click', (e) => {
            // récupérer l'id de la catégorie
            console.log(e.target.getAttribute("data-categorie"));
            getWorksByCategorie(e.target.getAttribute("data-categorie"));
        });
        categoriesDiv.appendChild(buttonTous);


        // Création des autres bouttons
        for (let i in categories) {
             // Créer bouton
             let button = document.createElement("button");
             // Rajouter un dataset au bouton 
             button.dataset.categorie = categories[i].id;
             let buttonContent = document.createTextNode(categories[i].name);
             button.appendChild(buttonContent);
                // Ajouter class 
                button.classList.add("button")
                console.log(button);
                // ajouter un event listener
            button.addEventListener('click', (e) => {
                // récupérer l'id de la catégorie
                console.log(e.target.getAttribute("data-categorie"));
                getWorksByCategorie(e.target.getAttribute("data-categorie"));
              });
              // Ajouter bouton au point de montage
            categoriesDiv.appendChild(button);
        }

        // // Créer bouton
            // let button = document.createElement("button");
            // // Rajouter un dataset au bouton 
            // button.dataset.categorie = categories[i].id;
            // let buttonContent = document.createTextNode(categories[i].name);
            // button.appendChild(buttonContent);
            // // Ajouter class 
            // button.classList.add("button")
            // console.log(button);
            // // ajouter un event listener
            // button.addEventListener('click', (e) => {
            //     // récupérer l'id de la catégorie
            //     console.log(e.target.getAttribute("data-categorie"));
            //     getWorksByCategorie(e.target.getAttribute("data-categorie"));
            // });
            // // Ajouter bouton au point de montage
            // categoriesDiv.appendChild(button);

            // création fonction event listener
function eventListener() {
    const buttons = document.querySelectorAll("button");
    console.log(buttons)
    // affichage de tout les boutons 
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
        });
    });
}



function createEditModal() {
    // A effacer + créer une div dans index 
    // const divModal = document.createElement("div")

    // const divModal = document.getElementById("divModal");

    const modalContent = document.createElement("div");
    const closeModal = document.createElement("button");
    const titleModal = document.createElement("h1");
    const galleryModal = document.createElement("p");
    const buttonAddPhoto = document.createElement("button");
    const buttonAddPhotoText = document.createTextNode('Je vais tout supprimer');
    
    modalContent.setAttribute('id','modalContent');
    closeModal.setAttribute('id','closeModal');
    titleModal.setAttribute('id','titleModal');
    galleryModal.setAttribute('id','galleryModal');
    buttonAddPhoto.setAttribute('id','buttonAddPhoto');

    createElementWithID("img", "imageDeBite");
}


// remplacer les const et setAttribute par une fonction
function createElementWithID(type, idValue, idOfParentElement) {
    const createdElement = document.createElement(type);
    createdElement.setAttribute('id',idValue);

    //smth with idOfParentElement
    parentElement.appendChild(elementChild);
    
    return createdElement;
}


// Création de la modal en full JS 

// function createEditButton() {
     const buttonEditParent = document.getElementById("portfolio");  
     let buttonEdit = document.createElement("button");
     let buttonEditContent = document.createElement('p')
     buttonEditContent.innerHTML = "Modifier"  
     buttonEdit.appendChild(buttonEditContent);
     buttonEdit.classList.add("editButton");
     buttonEdit.addEventListener('click', (e) => {
         divModal = document.querySelector('.modal');
         divModal.style.display = "block";
     });  
     buttonEditParent.appendChild(buttonEdit);
 
 function createEditModal() {
     buttonAddPhoto = createButton('buttonAddPhoto', 'Ajouter une photo', 'filterButton')
     const divModal = document.querySelector(".modal");
     const divModalContent = document.createElement("div");  
     const closeModal = document.createElement("button");
     const closeModalText = document.createTextNode('x');
     const titleModal = document.createElement("p"); 
     const galleryModal = document.createElement("p")
     divModalContent.setAttribute('id','modalContent');
     closeModal.setAttribute('id','closeModal');
     titleModal.setAttribute('id','titleModal');
     galleryModal.setAttribute('id','galleryModal');
     buttonAddPhoto.setAttribute('id','buttonAddPhoto')
     titleModal.innerHTML = 'Galerie Photo'
     divModal.appendChild(divModalContent);
     divModal.appendChild(titleModal)
     divModalContent.appendChild(galleryModal);
     divModalContent.appendChild(buttonAddPhoto);
     closeModal.appendChild(closeModalText);  
     divModal.appendChild(closeModal);
     divModal.appendChild(titleModal)
     // Remettre addEventListner
     closeModal.onclick = function() {
         divModal.style.display = "none";
     };
 }

 // Ajouter des figures à a modale
function createWorkAPI(fileUrlFromTheForm, titleFromTheForm, categoryStringFromTheForm) {
    fetch(urlApi + "/works", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: {
            image: fileUrlFromTheForm,
            title: titleFromTheForm,
            category: categoryStringFromTheForm
        }
    })
    getWorksInModal();
    getWorks();
}