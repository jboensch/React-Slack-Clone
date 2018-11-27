import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
    apiKey: "AIzaSyB5lx_OiRjhGKR7ksl1y1FNv2g71NYQpXE",
    authDomain: "react-slack-clone-77ecd.firebaseapp.com",
    databaseURL: "https://react-slack-clone-77ecd.firebaseio.com",
    projectId: "react-slack-clone-77ecd",
    storageBucket: "react-slack-clone-77ecd.appspot.com",
    messagingSenderId: "684383713802"
  };
  firebase.initializeApp(config);

  export default firebase;