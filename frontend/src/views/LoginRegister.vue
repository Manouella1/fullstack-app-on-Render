<template>
  <div>
    <h2>{{ isLogin ? "Login" : "Register" }}</h2>
    <form @submit.prevent="onSubmit">
      <!-- Show username field only when registering -->
      <input
        v-if="!isLogin"
        v-model="username"
        type="text"
        placeholder="Username"
        required
      />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <div>
        <button type="button" @click="toggleMode">
          {{ isLogin ? "Let's Register" : "Let's Login" }}
        </button>
        <button type="submit">{{ isLogin ? "Login" : "Register" }}</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { api } from "../services/api";
import { useAuthStore } from "../store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const username = ref(""); // Added for registration
const email = ref("");
const password = ref("");
const isLogin = ref(true);

// Toggle between login and register modes
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  username.value = ""; // Reset username when switching modes
  email.value = "";
  password.value = "";
};

const onSubmit = async () => {
  try {
    const endpoint = isLogin.value
      ? "https://fullstack-app-on-render.onrender.com/login"
      : "https://fullstack-app-on-render.onrender.com/register";

    // Prepare request payload based on login or registration
    const payload = isLogin.value
      ? { email: email.value, password: password.value }
      : {
          username: username.value,
          email: email.value,
          password: password.value,
        };

    const response = await api.post(endpoint, payload);

    // (login or register)
    if (isLogin.value) {
      const { token, user } = response.data;
      authStore.setUser(user, token);
    } else {
      const { user } = response.data;
      authStore.setUser(user, ""); // No token to set in registration
    }

    // Redirect to the forum after successful login or registration
    router.push("/forum");
  } catch (error) {
    console.error("Error:", error);
  }
};
</script>
