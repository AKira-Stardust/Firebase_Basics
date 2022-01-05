import { initializeApp } from 'firebase/app';

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBdOrD2JE5mgQRHZdnJi2QjKteGoy3S_tI",
    authDomain: "fir-dojo-c0180.firebaseapp.com",
    projectId: "fir-dojo-c0180",
    storageBucket: "fir-dojo-c0180.appspot.com",
    messagingSenderId: "714713143172",
    appId: "1:714713143172:web:9b844ea6b887091d6fefd1"
};

let cred;

// connecting backend with front end
initializeApp(firebaseConfig);

// initializing services from Firebase
const db = getFirestore();
const auth = getAuth();

// // get your collections 
const colRef = collection(db, 'books');

// query for a particular subset (with your required conditions)
const q = query(colRef, orderBy('createdAt','desc'));
// const q = query(colRef, where('author', '==', 'Brandon Sanderson'), orderBy('title','desc'));

// // get the documents from the subset
onSnapshot(q, snapshot => {
    let books = [];
    snapshot.docs.forEach( doc => {
        books.push({
             ...doc.data(), 
             id: doc.id 
        });
    })
    console.log(books);
});

// Adding a new document
const addBook = document.querySelector('.add');
addBook.addEventListener('submit', e => {
    e.preventDefault();

    addDoc(colRef, {
        title: addBook.title.value,
        author: addBook.author.value,
        createdAt: serverTimestamp()
    })
        .then( () => {
            addBook.reset();
        })
        .catch( err => {console.log("Error adding book:", err)});

});

// Deleting a document
const deleteBook = document.querySelector('.delete');
deleteBook.addEventListener('submit', e => {
    e.preventDefault();

    const docRef = doc(db, 'books', deleteBook.id.value);
    deleteDoc(docRef)
        .then( () => {
            deleteBook.reset();
        })
        .catch( err => console.log("error deleting book:", err));
})

// Fetch single document
const docRef = doc(db, 'books', '2FDsLbDK8r190Uhaj5lR');

onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
});


// Updating a single document
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', e => {
    e.preventDefault();

    const docRef = doc(db, 'books', updateBookForm.id.value);
    updateDoc(docRef, {
        title: 'Oathbringer'
    })
        .then( () => {
            updateBookForm.reset();
        })
        .catch( err => console.log("Error in updateDoc():", err));

});

// getDoc(docRef)
//     .then( doc => {
//         console.log(doc.data(), doc.id);
//     })
//     .catch (err => console.log("Error in getDoc()", doc))

// Signup for Authentication
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then( cred => {
            // console.log(cred.user);
            cred = cred.user.email;
            signupForm.reset();
        })
        .catch( err => console.log("Error in Authentication:", err));

});

// Login and Logout functions

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then( cred => {
            // console.log("User now logged in:", cred);
            loginForm.reset();
        })
        .catch( err => console.log("Erron in singIn:", err));
});

const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', e => {
    signOut(auth)
        .then( () => {
            // console.log("The user",cred,"is now logged out.");
            // console.log("The user is now logged out.");
        })
        .catch( err => console.log("Error in signOut()", err));
});

onAuthStateChanged(auth, user => {
    console.log("User status changed:", user);
});













