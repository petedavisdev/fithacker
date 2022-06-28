<template>
	<main>
		<Suspense>
			<template #default>
				<div>
					<article v-if="userSession && !profile.plus">
						<h2>
							You are logged in as {{ userSession.user.email }}
						</h2>
						<p>
							Thank you for trying out Fithacker alpha!
						</p>
						<p>
							If you would like to encourage me to take the app to the next level, you
							can
							<a href="https://www.buymeacoffee.com/petedavis"> buy me a coffee </a>
							😉
						</p>

						<p>Thank you!</p>

						<p><i>Pete</i> 😃</p>

						<router-link :to="{ name: 'Log' }" class="button">➙</router-link>
					</article>

					<article v-if="userSession && profile.plus">
						<h2>
							You are logged in as {{ userSession.user.email }}
						</h2>
						<p>
							Thank you for supporting Fithacker alpha! 
						</p>
						<p>
							You have unlocked you complete log and you will be the first to get new features.
						</p>

						<p>Cheers!</p>

						<p><i>Pete</i> 😃</p>

						<router-link :to="{ name: 'Log' }" class="button">➙</router-link>
					</article>
				</div>
			</template>

			<template #fallback>
				<article>Loading...</article>
			</template>
		</Suspense>
	</main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { router } from '../router';
import { createProfile, supabase, userSession } from '../supabase';
import { useProfile } from '../useProfile';

export default defineComponent({
	setup() {
		const { profile } = useProfile();
		if (!userSession.value) router.push({ name: 'Login' })

		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == 'SIGNED_IN') {
				createProfile();
				useProfile
			}
		})

		return {
			userSession,
			profile
		};
	},
});
</script>

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
