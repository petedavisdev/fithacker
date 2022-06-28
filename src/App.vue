<template>
    <AppHeader />
    <router-view v-if="online" />
    <h1 v-else style="text-align: center">You are offline</h1>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppHeader from './components/AppHeader.vue';
import { useProfile } from "./useProfile";
// import { fetchProfile } from "./supabase";

// const profile = ref({ plus: false })
const { profile, getProfile } = useProfile();
const route = useRoute()
const online = ref(navigator.onLine)

watch(() => route, () => getProfile())
    
window.addEventListener('offline', () => online.value = false);
window.addEventListener('online', () => {
    online.value = true
    getProfile()
});

window.addEventListener('focus', () => getProfile());
</script>
