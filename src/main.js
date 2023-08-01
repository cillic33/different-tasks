import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "@/router/index.js";
import $ from 'jquery';

const app = createApp(App);

app.use(router);

app.use($);

app.mount('#app');
