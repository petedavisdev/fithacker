<script setup lang="ts">
import { ref } from 'vue';
import { createProfile, getLog, supabase, userSession } from './supabase';

const online = ref(true);

window.addEventListener('online', () => (online.value = true));
window.addEventListener('offline', () => (online.value = false));

supabase.auth.onAuthStateChange(async (event) => {
	if (event == 'SIGNED_IN') {
		createProfile();
		getLog();
	}
});
</script>

<template>
	<header>
		<router-link :to="{ name: 'Log' }">
			<span>FIT</span><span>HAC</span><span>KER</span>
			<sup>beta</sup>
		</router-link>
		<router-link v-if="userSession" :to="{ name: 'Account' }" class="icon"
			>😃</router-link
		>
		<router-link v-else :to="{ name: 'Login' }" class="icon"
			>👋</router-link
		>
	</header>
	<router-view v-if="online" />
	<h1 v-else style="text-align: center">You are offline</h1>
</template>

<style scoped>
header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	background-color: var(--dark);
	padding: 1rem;
}

header span {
	color: var(--cyan);
	font-weight: bold;
}
header span:first-of-type {
	color: var(--yellow);
}
header span:last-of-type {
	color: var(--blue);
}

header .icon {
	float: right;
	margin-left: 1em;
	transform: scale(1.5);
}
</style>
