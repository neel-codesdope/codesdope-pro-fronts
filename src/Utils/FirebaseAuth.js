import firebase from 'firebase/app';
import 'firebase/database';
import { FIREBASE_CONFIG } from '../Constants/Values';

const firebaseConfig = FIREBASE_CONFIG;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
