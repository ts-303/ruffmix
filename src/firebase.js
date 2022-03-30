import firebase from 'firebase';

let firebaseConfig = {

    apiKey: "AIzaSyAhKNoLSbI082LfD08uTtt67fzuc3fDgzo",
  
    authDomain: "ruffmix-app.firebaseapp.com",
  
    databaseURL: "https://ruffmix-app-default-rtdb.firebaseio.com",
  
    projectId: "ruffmix-app",
  
    storageBucket: "ruffmix-app.appspot.com",
  
    messagingSenderId: "721486047256",
  
    appId: "1:721486047256:web:1487b9fc61c34d0a7efb6d"
  
};

var fire = firebase.initializeApp(firebaseConfig);


export default firebase;