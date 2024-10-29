<template>
  <div>
    <input v-model="title" placeholder="Post title" />
    <textarea v-model="content" placeholder="Post content"></textarea>
    <button @click="createPost">Create Post</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { api } from "../services/api";
const emit = defineEmits(["refresh"]);

const title = ref("");
const content = ref("");

const createPost = async () => {
  await api.post("https://fullstack-app-on-render.onrender.com/posts", {
    title: title.value,
    content: content.value,
  });
  title.value = "";
  content.value = "";
  emit("refresh");
};
</script>
