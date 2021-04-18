<template>
  <div>
    <!-- show single messages -->
    <single-message :messages="messages"></single-message>
    <!-- message form -->
    <message-form></message-form>
  </div>
</template>

<script>
  import SingleMessage from "./SingleMessage";
  import MessageForm from "./MessageForm";
  import database from "firebase/database";
  import { mapGetters } from "vuex";

  export default {
    name: "message",
    components: {
      SingleMessage,
      MessageForm,
    },

    data() {
      return {
        messageRef: firebase.database().ref("messages"),
        messages: [],
        channel: "",
      };
    },

    computed: {
      ...mapGetters(["currentChannel"]),
    },
    watch: {
      currentChannel: function (n) { // 當前channel被設定時  觸發監聽messages
        this.messages = [];
        this.addListeners();
        this.channel = n;
      },
    },
    methods: {
      addListeners() {
        // 監聽當前channel 的messages
        this.messageRef
          .child(this.currentChannel.id)
          .on("child_added", (snapshot) => {
            this.messages.push(snapshot.val());
          });
      },
      detachListeners() {
        if (this.channel !== null) {
          this.messageRef.child(this.channel.id).off();
        }
      },
    },
    beforeDestroy() {
      this.detachListeners();
    },
  };
</script>