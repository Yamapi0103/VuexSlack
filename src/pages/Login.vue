<template>
  <div>
    <div class="jumbotron bg-primary text-white text-center">
      <h2 class="lead display-3">#SLACK#</h2>
      <p>Realtime communication at it's best!</p>
    </div>

    <!-- show loaging statue -->
    <div class="alert alert" v-if="loading">Processing...</div>

    <!-- show errors -->
    <div class="alert alert-danger" v-if="hasErrors">
      <div v-for="(error, index) in errors" :key="index">{{ error }}</div>
    </div>

    <div class="container-fluid">
      <div class="row mt-5">
        <div class="col text-center">
          <button
            @click="loginWithGoogle"
            class="btn btn-outline-danger btn-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col text-center">
          <button class="btn btn-outline-info btn-lg">
            Login with Twitter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from "firebase/auth";
  import database from "firebase/database";
  export default {
    name: "login",
    data() {
      return {
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users"),
      };
    },
    computed: {
      hasErrors() {
        return this.errors.length > 0;
      },
    },
    methods: {
      loginWithGoogle() {
        this.loading = true;
        this.errors = [];
        firebase
          .auth()
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then((res) => {
            // pass user to save in db
            this.saveUsersToUsersRef(res.user);
            this.$store.dispatch("setUser", res.user);
            this.$router.push("/");
          })
          .catch((err) => {
            this.errors.push(err.message);
            this.loading = false;
          });
      },
      // save user to database
      saveUsersToUsersRef(user) {
        return this.usersRef.child(user.uid).set({
          name: user.displayName,
          avatar: user.photoURL,
        });
      },
    },
  };
</script>

<style>
.btn,
.jumbotron {
  border-radius: 0px;
}
</style>
