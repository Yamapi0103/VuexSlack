<template>
  <div>
    <div class="mt-3 mb-5">
      <div v-for="(message, index) in messages" :key="index">
        <div class="media">
          <img
            :src="message.user.avatar"
            height="50"
            class="align-self-start mr-3"
          />

          <div class="media-body">
            <h6 class="mt-0">
              <a href="#">{{ message.user.name }}</a> -
              {{ message.timestamp | fromNow }}
            </h6>
            <p :class="{ self_message: selfMessage(message.user) }">
              {{ message.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import { mapGetters } from "vuex";
  export default {
    name: "single-message",
    props: ["messages"],
    computed: {
      ...mapGetters(["currentUser"]),
    },
    filters: {
      fromNow(val) {
        return moment(val).fromNow();
      },
    },
    methods: {
      selfMessage(user) {
        return user.id === this.currentUser.uid;
      },
    },
  };
</script>
<style scoped>
  .self_message{
    border-left: 5px solid red;
    padding: 0 10px;
  }
</style>