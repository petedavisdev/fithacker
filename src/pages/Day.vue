<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { daysSince, formatDate, shortenDate } from '../helpers';
import { getLog, updateProfile } from '../supabase';
import exercises from '../exercises.json';

const route = useRoute();
const isHome = route.path === '/';
const routeDay = !isHome && route.params.date?.toString();
const day = routeDay ? new Date(routeDay) : new Date();
const dayKey = shortenDate(day);
const dayName = formatDate(day);
const log = ref<Record<string, string[]>>({});
const dayLog = ref<string[]>([] as string[]);

onMounted(async () => {
	log.value = await getLog();
	dayLog.value = (await log.value[dayKey]).map((item) => item[0]) ?? [];
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

			<code>{{ meta.icon }}</code>
			<span>{{ meta.title }}</span>

			<em>{{ daysSince(log, dayLog, dayKey, code) }}</em>
		</label>

		<router-link :to="{ name: 'Log' }" class="button">➙</router-link>
	</main>
</template>

<style scoped>
h1 {
	padding: 1rem 0 0.5rem;
	text-align: center;
}

label {
	display: grid;
	grid-template: 'box icon text' auto / auto auto 1fr;
	gap: 0.25rem;
	margin-block: 0.75rem;
	align-items: center;
}

label span {
	grid-area: text;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
}

[type='checkbox'] {
	grid-area: box;
	height: 2rem;
	width: 2rem;
}

code {
	grid-area: icon;
	font-size: x-large;
}

em {
	grid-area: box;
	place-self: center;
	color: var(--yellow);
	pointer-events: none;
}

em:empty {
	display: none;
}

label:has(:checked) {
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
