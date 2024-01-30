import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyBZLu9K9xk1D_rRQGAisNOeAHYud2EgA-o",

    authDomain: "reciperolodex-51dd6.firebaseapp.com",
  
    projectId: "reciperolodex-51dd6",
  
    storageBucket: "reciperolodex-51dd6.appspot.com",
  
    messagingSenderId: "48979506160",
  
    appId: "1:48979506160:web:4f2dd0b3a3b99f2ffba335"
  
  };
    

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};
  