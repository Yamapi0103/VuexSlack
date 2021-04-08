<template>
  <div>
    <button class="btn btn-outline-primary" @click="openModal">
      Add Channel
    </button>

    <!-- show list of channels -->
    <div class="mt-4">
      <button
        v-for="(channel, index) in channels"
        :key="index"
        class="list-group-item list-group-item-action"
        type="button"
      >
        {{ channel.name }}
      </button>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="channelModal">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark" id="exampleModalLabel">
              Modal title
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <form>
              <div class="from-group">
                <input
                  type="text"
                  id="new_channel"
                  name="new_channel"
                  placeholder="Channel name"
                  class="form-control"
                  v-model="new_channel"
                />
                <ul class="list-group" v-if="hasErrors">
                  <li
                    class="list-group-item text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="addChannel">
              Add Channel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import database from "firebase/database";
  export default {
    name: "channels",
    data() {
      return {
        new_channel: "",
        channels: [],
        errors: [],
        channelsRef: firebase.database().ref("channels"),
      };
    },
    computed: {
      hasErrors() {
        return this.errors.length > 0;
      },
    },
    methods: {
      openModal() {
        $("#channelModal").appendTo("body").modal("show");
      },
      addChannel() {
        let errors = [];
        let key = this.channelsRef.push().key;
        console.log("newly creating channel key: ", key);

        let newChannel = { id: key, name: this.new_channel };
        this.channelsRef
          .child(key)
          .update(newChannel)
          .then(() => {
            this.new_channel = "";
            $("#channelModal").modal("hide");
          })
          .catch((err) => {
            this.errors.push(err.message);
          });
      },
      addListeners() {
        this.channelsRef.on("child_added", (snapshot) => {
          console.log("listening channelRef on child_add: ", snapshot.val());
          this.channels.push(snapshot.val());
        });
      },
      detachListeners() {
        this.channelsRef.off();
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