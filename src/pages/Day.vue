<template>
	<app-header />

	<header>
		<h1 :class="{ home: isHome }">
			{{ isHome ? 'What exercise have you done today?' : dayName }}
		</h1>
	</header>

	<main>
		<label v-for="(meta, code) in exercises" :key="code">
			<input v-model="dayLog" type="checkbox" :value="code" @change="updateDayLog" />

			<span>
				<code>{{ code }}</code
				>= {{ meta.family }}
			</span>
		</label>

		<router-link :to="{ name: 'Log' }" class="button">➜</router-link>
	</main>

	<app-footer />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate, shortenDate } from '../helpers';
import exercises from '../exercises.json';
import AppFooter from '../components/AppFooter.vue';
import { getLog, updateProfile } from '../supabase';
import AppHeader from '../components/AppHeader.vue';

interface Exercise {
	family: string[];
}

export default defineComponent({
	components: {
		AppFooter,
		AppHeader,
	},
	setup() {
		const route = useRoute();

		const isHome = route.path === '/';

		const routeDay = !isHome && route.params.date?.toString();

		const day = routeDay ? new Date(routeDay) : new Date();

		const dayKey = shortenDate(day);

		const dayName = formatDate(day);

		const log = ref({});

		const dayLog = ref([]);

		onMounted(async () => {
			log.value = await getLog();
			dayLog.value = (await log.value[dayKey]) || [];
		});

		function updateDayLog() {
			log.value[dayKey] = dayLog.value;
			updateProfile(log.value);
			localStorage.setItem('exerciseLog', JSON.stringify(log.value));
		}

		return {
			dayLog,
			dayName,
			exercises,
			isHome,
			updateDayLog,
			log,
		};
	},
});
</script>

<style scoped>
h1 {
	padding: 1rem 1rem 0.5rem;
	margin: 0;
	text-align: center;
}

main {
	padding: 1em;
	width: max-content;
	max-width: 100%;
	place-self: center;
}

[type='search'] {
	padding: 1rem;
	background-color: gainsboro;
	width: 100%;
	border-radius: 0;
}

[type='search']::placeholder {
	font-size: x-large;
}

[type='checkbox'] {
	height: 2rem;
	width: 1.5rem;
	position: absolute;
	top: 0.5rem;
	left: 0.5ch;
}

label {
	position: relative;
	display: block;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
}

label * {
	padding: 1ch 0.5ch 1ch 1rem;
}

code {
	font-size: x-large;
	vertical-align: middle;
}

:checked ~ * {
	background-color: var(--dark);
}

aside {
	padding: 1em;
}

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
