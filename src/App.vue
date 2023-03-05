<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';

const online = ref(true);

window.addEventListener('online', () => (online.value = true));
window.addEventListener('offline', () => (online.value = false));
</script>

<template>
	<AppHeader />
	<router-view v-if="online" />
	<h1 v-else style="text-align: center">You are offline</h1>
</template>
