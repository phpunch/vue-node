<template>
  <div id="app">
    <input type="text" v-model="text" />
    <button type="button" @click="sendText()">Send !!</button>
    <ul>
      <li v-for="show in message" :key="show.index">{{ show }}</li>
    </ul>
    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      :options="dropzoneOptions"
    ></vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  data() {
    return {
      dropzoneOptions: {
        url: "http://localhost:3000/api/image-upload",
        thumbnailWidth: 150,
        maxFilesize: 2,
        maxFiles: 1
      },
      text: "",
      message: []
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    message: function(msg) {
      this.message.push(msg);
    }
  },
  methods: {
    sendText() {
      this.$socket.emit("message", this.text);
    }
  },
  components: {
    vueDropzone: vue2Dropzone
  }
};
</script>
