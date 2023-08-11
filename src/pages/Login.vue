<script setup lang="ts">
import { ref } from 'vue';
import { router } from '../router';
import { supabase, userSession } from '../supabase';

if (userSession.value) router.push({ name: 'Account' });

const email = ref('');
const token = ref('');
const submitted = ref<Boolean | 'loading'>(false);

async function login() {
	submitted.value = 'loading';

	try {
		const { error } = await supabase.auth.signInWithOtp({
			email: email.value,
		});

		if (error) return alert('Error logging in: ' + error.message);

		submitted.value = true;
	} catch (error) {
		submitted.value = false;

		return alert('Error logging in: ' + error);
	}
}

async function verify() {
	try {
		const loginResponse = await supabase.auth.verifyOtp({
			email: email.value,
			token: token.value,
			type: 'magiclink',
		});

		if (loginResponse.error) {
			const signupResponse = await supabase.auth.verifyOtp({
				email: email.value,
				token: token.value,
				type: 'signup',
			});

			if (signupResponse.error) throw signupResponse.error;
		}

		router.push({ name: 'Account' });
	} catch (error: any) {
		alert(error.error_description || error.message);
	}
}

function retry() {
	email.value = token.value = '';
	submitted.value = false;
}
</script>

<template>
	<main>
		<form v-if="!submitted" @submit.prevent="login">
			<h1>Login</h1>
			<p>
				Backup your exercise log and use Fithacker on multiple devices
			</p>
			<p>
				<label>
					Email
					<input v-model="email" type="email" required />
				</label>
			</p>

			<button type="submit" :disabled="submitted === 'loading'">
				{{
					!submitted
						? 'Send me a magic number ✨'
						: 'Sending magic number ...'
				}}
			</button>
		</form>

		<form v-else @submit.prevent="verify">
			<h2>Magic number sent to {{ email }}</h2>
			<p>Check your inbox and spam folder 🧐</p>
			<p>
				<input
					v-model="token"
					type="text"
					id="token"
					class="token"
					inputmode="numeric"
					pattern="[0-9]+"
					min-length="6"
					max-length="6"
					title="6 digit number"
					required
				/>
			</p>
			<button type="submit">Enter &rarr;</button>
			<p>
				<button type="button" @click="retry">← Try again</button>
			</p>
		</form>
	</main>
</template>

<style scoped>
[type='email'],
[type='text'] {
	display: block;
	width: 100%;
	border: 2px solid var(--blue);
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
