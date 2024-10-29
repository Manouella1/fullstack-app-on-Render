<template>
  <div id="app">
    <header>
      <nav>
        <h1>My Forum</h1>
        <div v-if="isLoggedIn">
          <button @click="logout">Logout</button>
        </div>
      </nav>
    </header>
    <main>
      <!-- Render the component for the current route -->
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "./store";
import { computed, onMounted } from "vue";

onMounted(() => {
  fetch("/users")
    .then((response) => response.json())
    .then((result) => {
      console.log(`Hello ${result.hello}!`);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.token !== null);

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
#app {
  text-align: center;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}

button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

main {
  padding: 2rem;
}
</style>
