<template>
	<main>
		<form v-if="!submitted" @submit.prevent="login">
			<h1>Login</h1>
			<p>Backup your exercise log and use Fithacker on multiple devices 😎</p>
			<p>
				<label>
					Email
					<input v-model="email" type="email" required />
				</label>
			</p>

			<p>
				<label>
					<input type="checkbox" required />
					As an alpha fithacker, I am happy to be asked for feedback and I can tolerate
					the odd bug!
				</label>
			</p>

			<button type="submit">Send me a magic login link ✨</button>
		</form>

		<article v-else>
			<h2>Magic login link sent to {{ email }}</h2>
			<p>Check your inbox and spam folder 🧐</p>
			<button type="button" @click="submitted = false">← Try again</button>
		</article>
	</main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { router } from '../router';
import { supabase, userSession } from '../supabase';

export default defineComponent({
	setup() {
		if (userSession.value) router.push({name: 'Account'})

		const email = ref('');
		const submitted = ref(false);

		async function login() {
			try {
				const { error } = await supabase.auth.signIn(
					{ email: email.value },
					{ redirectTo: 'https://fithacker.netlify.app/account' }
				);

				if (error) return alert('Error logging in: ' + error.message);

				submitted.value = true;
			} catch (error) {
				console.error('Error thrown:', error.message);
				return alert(error.error_description || error);
			}
		}

		return {
			email,
			login,
			submitted,
			userSession,
		};
	},
});
</script>

<style scoped>
[type='email'] {
	display: block;
	width: 100%;
	border-width: 2px;
	padding: 0.5em;
}

[type='submit'] {
	display: block;
	width: 100%;
	color: var(--cyan);
	background-color: var(--dark);
	border: 2px solid var(--cyan);
	padding: 0.5em;
}

[type='button'] {
	display: block;
	color: var(--cyan);
	background: none;
	border: none;
	padding: 0;
}
</style>
