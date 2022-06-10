<template>
	<header>
		<router-link :to="{ name: 'Log' }">
			<span>FIT</span><span>HAC</span><span>KER</span>
			0.1-alpha
		</router-link>

		<router-link :to="{ name: 'Account' }" class="fl-r">{{
			userSession ? '😃' : '👋'
		}}</router-link>
	</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { userSession } from '../supabase';

export default defineComponent({
	setup() {
		return {
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
