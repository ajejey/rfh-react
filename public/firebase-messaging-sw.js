 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {

   apiKey: "AIzaSyDTxtMrdzE0_8rhgouvR_jK9nkB0ZMdx-k",
    authDomain: "rupeeforhumanity.firebaseapp.com",
    projectId: "rupeeforhumanity",
    storageBucket: "rupeeforhumanity.appspot.com",
    messagingSenderId: "161592036397",
    appId: "1:161592036397:web:a69fe8753ebe807aac3ca4"
 };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });