<script setup lang="ts">
import type { Activity, ExerciseCodes, Log } from '../types';
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
const log = ref<Log>({});
const dayLog = ref<Activity>([]);
const dayCodes = ref<ExerciseCodes[]>([]);
const dayNotes = ref<Partial<Record<ExerciseCodes, string>>>({});

onMounted(async () => {
	log.value = await getLog();

	dayLog.value = log.value[dayKey] ?? [];

	dayCodes.value =
		log.value[dayKey].map((item) => item[0] as ExerciseCodes) ?? [];

	const notes = Object.fromEntries(
		log.value[dayKey].map((item) => [item[0], item[1] ?? ''])
	);

	dayNotes.value = Object.fromEntries(
		Object.keys(exercises).map((code) => [code, notes[code] ?? ''])
	);
});

function updateDayLog() {
	log.value[dayKey] = dayCodes.value.map((code) => {
		const note = dayNotes.value[code];
		return note ? [code, note] : code;
	});
	console.log(log.value[dayKey]);
	if (!dayCodes.value.length) delete log.value[dayKey];
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
				v-model="dayCodes"
				type="checkbox"
				:value="code"
				@change="updateDayLog"
			/>

			<code>{{ meta.icon }}</code>
			<span>{{ meta.title }}</span>

			<em>{{ daysSince(log, dayLog, dayKey, code) }}</em>
			<input
				v-model="dayNotes[code]"
				@blur="updateDayLog"
				class="note"
				:placeholder="meta.title"
			/>
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

.note {
	display: none;
	grid-area: text;
	height: 100%;
	border: 1px solid var(--blue);
}

.note:focus,
.note:hover {
	border-color: var(--cyan);
	outline: none;
}

:checked ~ .note {
	display: block;
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

label:has(:checked) {
	background-color: var(--dark);
}

label:has(:checked) em {
	display: none;
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
