// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBbpD0auOK0DixerAKTggtb-V6dsacfFGE",
    authDomain: "seleccion-comida.firebaseapp.com",
    databaseURL: "https://seleccion-comida-default-rtdb.firebaseio.com",
    projectId: "seleccion-comida",
    storageBucket: "seleccion-comida.firebasestorage.app",
    messagingSenderId: "582434762508",
    appId: "1:582434762508:web:3406c07264594ce4342329",
    measurementId: "G-RHN4E645EG"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
const database = firebase.database();
