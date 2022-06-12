<template>
	<header>
		<router-link :to="{ name: 'Log' }">
			<span>FIT</span><span>HAC</span><span>KER</span><span v-if="log.plus">+</span>
			0.1-alpha
		</router-link>

		<router-link v-if="userSession && log.plus" :to="{ name: 'Account' }" class="fl-r">😎</router-link>
		<router-link v-else-if="userSession" :to="{ name: 'Account' }" class="fl-r">😃</router-link>
		<router-link v-else :to="{ name: 'Login' }" class="fl-r">👋</router-link>
	</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { userSession } from '../supabase';

export default defineComponent({
	setup() {
		const localLog = localStorage.getItem('exerciseLog');
		const log = localLog ? JSON.parse(localLog) : {};
		
		return {
			log,
			userSession,
		};
	},
});
</script>

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
