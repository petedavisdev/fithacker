<script setup lang="ts">
import { router } from '../router';
import { createProfile, supabase, userSession } from '../supabase';

if (!userSession.value) router.push({ name: 'Login' });

supabase.auth.onAuthStateChange(async (event) => {
	if (event == 'SIGNED_IN') {
		createProfile();
	}
});
</script>

<template>
	<main>
		<Suspense>
			<article v-if="userSession">
				<h2>You are logged in as {{ userSession.user.email }}</h2>
				<p>Thank you for trying out Fithacker beta!</p>

				<p><i>Pete</i> 😃</p>

				<router-link :to="{ name: 'Log' }" class="button"
					>➙</router-link
				>
			</article>
		</Suspense>
	</main>
</template>

<style scoped>
.button {
	display: block;
	width: 100%;
	color: var(--cyan);
	background-color: var(--dark);
	border: 2px solid var(--cyan);
	padding: 0.5rem;
	margin-top: 1rem;
	text-align: center;
	font-size: xx-large;
}
</style>
