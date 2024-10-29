<template>
  <div>
    <div v-for="post in posts" :key="post.id">
      <div v-if="editingPost?.id === post.id">
        <!-- Edit Form -->
        <input v-model="editingPost.title" placeholder="Edit Title" />
        <textarea
          v-model="editingPost.content"
          placeholder="Edit Content"
        ></textarea>
        <button @click="saveEdit">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <div v-else>
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <button @click="startEdit(post)">Edit</button>
        <button @click="deletePost(post.id)">Delete</button>
        <CommentList :postId="post.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { api } from "../services/api";
import CommentList from "./CommentList.vue";

interface Post {
  id: number;
  title: string;
  content: string;
  // Add other fields if necessary
}

const emit = defineEmits(["refresh"]);
const posts = ref<Post[]>([]);
const editingPost = ref<Post | null>(null); // Holds the post being edited

// Fetch posts and update the 'posts' array
const fetchPosts = async () => {
  try {
    const response = await api.get(
      "https://fullstack-app-on-render.onrender.com/posts"
    );
    posts.value = response.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Call fetchPosts when the component is mounted
onMounted(fetchPosts);

const startEdit = (post: Post) => {
  editingPost.value = { ...post }; // Start editing a copy of the post
};

const cancelEdit = () => {
  editingPost.value = null; // Cancel editing
};

const saveEdit = async () => {
  if (!editingPost.value) return;

  // Call the API to update the post
  await api.put(
    `https://fullstack-app-on-render.onrender.com/posts/${editingPost.value.id}`,
    {
      title: editingPost.value.title,
      content: editingPost.value.content,
    }
  );

  // Refresh the posts and stop editing
  await fetchPosts();
  editingPost.value = null;
};

const deletePost = async (id: number) => {
  await api.delete(`https://fullstack-app-on-render.onrender.com/posts/${id}`);
  await fetchPosts();
};
</script>
