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

//      DO NOT CHANGE UNTIL DEPLOY - set host to 192.168.1.246 port 9000 in firebase.json and here using useEMulator()

var fire = firebase.initializeApp(firebaseConfig);

fire.database().useEmulator("192.168.1.246", 9000);
fire.auth().useEmulator("http://192.168.1.246:9099", { disableWarnings: true });
fire.storage().useEmulator("192.168.1.246", 9199);

export default firebase;