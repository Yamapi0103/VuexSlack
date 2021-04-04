// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import store from './store'
import auth from 'firebase/auth'

Vue.config.productionTip = false

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDo-N-5pTtRVKPPtF_9h8eYv8wAR21Xw1g",
    authDomain: "vueslack-2deb7.firebaseapp.com",
    projectId: "vueslack-2deb7",
    storageBucket: "vueslack-2deb7.appspot.com",
    messagingSenderId: "843136707384",
    appId: "1:843136707384:web:cc61cb5f54e75858c86fcd"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  window.firebase = firebase;

  const unsubscribe = firebase.auth().onAuthStateChanged(user=>{
    store.dispatch('setUser', user)
    new Vue({
      el: '#app',
      store,
      router,
      components: { App },
      template: '<App/>'
    })
    // recursion - this function calls itself on auth state change
    unsubscribe()
  })

/* eslint-disable no-new */
