<template>
  <div>
    <div class="text-light">
      <h4>Users</h4>
      <ul class="nav flex-column">
        <li
          v-for="user in users"
          :key="user.uid"
          @click.prevent="chanheChannel(user)"
        >
          <span>
            <img :src="user.avatar" height="20" class="img rounded-circle" />
            <span
              :class="{
                'text-primary': isOnline(user),
                'text-danger': !isOnline(user),
              }"
              ><a href="#">{{ user.name }}</a></span
            >
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import database from "firebase/database";
  import { mapGetters } from "vuex";
  export default {
    name: "users",
    data() {
      return {
        users: [],
        usersRef: firebase.database().ref("users"),
        connectedRef: firebase.database().ref(".info/connected"),
        presenceRef: firebase.database().ref("presence"),
      };
    },
    computed: {
      ...mapGetters(["currentUser"]),
    },
    methods: {
      addListeners() {
        this.usersRef.on("child_added", (snapshot) => {
          console.log(snapshot);
          if (this.currentUser.uid !== snapshot.key) {
            let user = snapshot.val();
            user["uid"] = snapshot.key;
            user["status"] = "offline";
            this.users.push(user);
          }
        });

        // presenceRef child_added
        this.presenceRef.on("child_added", (snapshot) => {
          if (this.currentUser.uid !== snapshot.key) {
            this.addStatusToUser(snapshot.key);
          }
        });

        // presenceRef child_removed
        this.presenceRef.on("child_removed", (snapshot) => {
          if (this.currentUser.uid !== snapshot.key) {
            this.addStatusToUser(snapshot.key, false);
          }
        });

        // return connected users
        this.connectedRef.on("value", (snapshot) => {
          if (snapshot.val() === true) {
            let ref = this.presenceRef.child(this.currentUser.uid);
            ref.set(true);
            ref.onDisconnect().remove();
          }
        });
      },
      addStatusToUser(userId, connected = true) {
        let index = this.users.findIndex((user) => user.uid === userId);
        if (index !== -1) {
          connected
            ? (this.users[index].status = "online")
            : (this.users[index].status = "offline");
        }
      },
      isOnline(user) {
        return user.status == "online";
      },
      detachListeners() {
        this.usersRef.off();
        this.connectedRef.off();
        this.presenceRef.off();
      },
      chanheChannel(user) {
        let channelId = this.getChannelId(user.uid);
        let channel = { id: channelId, name: user.name };
        this.$store.dispatch("setCurrentChannel", channel);
      },
      getChannelId(userId) {
        return userId < this.currentUser.uid
          ? userId + "/" + this.currentUser.uid
          : this.currentUser.uid + "/" + userId;
      },
    },
    mounted() {
      this.addListeners();
    },
    beforeDestroy() {
      this.detachListeners();
    },
  };
</script>