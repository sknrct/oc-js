
let urlApi = "http://localhost:5678/api";


// function loginSubmit(){
//     const loginForm = document.querySelector("#login")
//     loginForm.addEventListener('submit', (e) => {
//         e.preventDefault
//         // récupérer l'id de la catégorie
//         console.log(e)
//         //loginUser(mettre les login password);
//     });
// }
// loginSubmit();

// function loginUser(email, password){
//     // Renseigner les données demandées
//     const data = {
//         email: email,
//         password: password
//     };
//     // Renseigner les options de la requête FETCH
//     const options = {
//         method: 'POST',
//         headers: {
//             'Constent-Type': 'application/json'
//         },
//         body: JSON.stringify(data) // Converion des données en JSON // Pourquoi pas un return response
//     };
//     // Envoyer le FETCH à l'API
//     fetch(urlApi + "/users/login", options)
//     .then(response => {
//         console.log(response)
//         if (!response.ok) {
//             throw new Error('Erreur lors de la connexion');
//         }
//         return response.json(); // Envoyer les données JSON de la réponse
//     })
//     .then(data => {
//         // On traite les données de la réponse, succès de la connexion
//         console.log('Connexion réussie :' , data);
//         // Redirection vers le site web
//         window.location.href = index.html;
//     })
//     .catch(error => {
//         // On traite les données de la réponse, echec de la connexion
//     });
// }


// Executer le code JS après que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Code JavaScript ici
    document.getElementById('login').addEventListener('submit', function(event) {
        event.preventDefault(); // Pour éviter que le formulaire ne se soumette

        // Récupérer les valeurs du formulaire
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Construire le corps de la requête
        const requestBody = {
            email: email,
            password: password
        };

        // Envoyer la requête POST à l'API
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            // Une fois la réponse reçue, vérifier si le token est présent
            if (data.token) {
                // Stocker le token dans le localStorage
                localStorage.setItem('token', data.token);
                // Rediriger vers la page d'accueil ou effectuer d'autres actions
                window.location.href = 'index.html';

            } else {
                // Gérer les cas d'erreur ou d'authentification incorrecte
                console.log('Erreur de connexion');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });
});