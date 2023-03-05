<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate, shortenDate } from '../helpers';
import { getLog, updateProfile } from '../supabase';
import exercises from '../exercises.json';

const route = useRoute();
const isHome = route.path === '/';
const routeDay = !isHome && route.params.date?.toString();
const day = routeDay ? new Date(routeDay) : new Date();
const dayKey = shortenDate(day);
const dayName = formatDate(day);
const log = ref({} as Record<string, string[]>);
const dayLog = ref([] as string[]);

onMounted(async () => {
	log.value = await getLog();
	dayLog.value = (await log.value[dayKey]) ?? [];
});

function updateDayLog() {
	log.value[dayKey] = dayLog.value;
	if (!dayLog.value.length) delete log.value[dayKey];
	updateProfile(log.value);
	localStorage.setItem('exerciseLog', JSON.stringify(log.value));
}
</script>

<template>
	<main>
		<h1 :class="{ home: isHome }">
			{{ isHome ? 'What exercise have you done today?' : dayName }}
		</h1>

		<label v-for="(meta, code) in exercises" :key="code">
			<input
				v-model="dayLog"
				type="checkbox"
				:value="code"
				@change="updateDayLog"
			/>

			<span>
				<code>{{ code }}</code
				>{{ meta.family }}
			</span>
		</label>

		<router-link :to="{ name: 'Log' }" class="button">➙</router-link>
	</main>
</template>

<style scoped>
h1 {
	padding: 1rem 1rem 0.5rem;
	text-align: center;
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
