<template>
  <div>
    <h1>Forum</h1>
    <button @click="logout">Logout</button>
    <PostForm @refresh="fetchPosts" />
    <PostList :posts="posts" @refresh="fetchPosts" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PostForm from "../components/PostForm.vue";
import PostList from "../components/PostList.vue";
import { api } from "../services/api";
import { useAuthStore } from "../store";

const posts = ref([]);
const authStore = useAuthStore();

const fetchPosts = async () => {
  const response = await api.get(
    "https://fullstack-app-on-render.onrender.com/posts"
  );
  posts.value = response.data.posts;
};

const logout = () => {
  authStore.logout();
};

onMounted(fetchPosts);
</script>
