import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);

// Create and register Pinia
const pinia = createPinia();
app.use(pinia);

// Register the router
app.use(router);

// Mount the app
app.mount('#app');
