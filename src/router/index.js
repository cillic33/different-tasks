import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from "@/components/HomePage.vue";
import HomeWork from "@/components/helpers/HomeWork.vue";
import MatchingBlocks from "@/components/scripts_works/MatchingBlocks.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/homework', component: HomeWork },
    { path: '/matching-blocks', component: MatchingBlocks },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
