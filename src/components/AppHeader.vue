<script setup lang="ts">
import { userSession } from '../supabase';
const localLog = localStorage.getItem('exerciseLog') ?? '{}';
</script>

<template>
	<header>
		<router-link :to="{ name: 'Log' }">
			<span>FIT</span><span>HAC</span><span>KER</span>
		</router-link>
		<router-link v-if="userSession" :to="{ name: 'Account' }" class="fl-r"
			>😃</router-link
		>
		<router-link v-else :to="{ name: 'Login' }" class="fl-r"
			>👋</router-link
		>
	</header>
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

span {
	color: var(--cyan);
	font-weight: bold;
}
span:first-of-type {
	color: var(--yellow);
}
span:last-of-type {
	color: var(--blue);
}

.fl-r {
	transform: scale(1.5);
}
</style>
