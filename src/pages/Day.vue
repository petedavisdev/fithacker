<script setup lang="ts">
import type { DayLog, ExerciseKeys, Log } from '../types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { daysSince, formatDate, shortenDate } from '../helpers';
import { getLog, updateProfile } from '../supabase';
import exercises from '../exercises.json';

const route = useRoute();
const isHome = route.path === '/';
const routeDay = !isHome && route.params.date?.toString();
const date = routeDay ? new Date(routeDay) : new Date();
const day = shortenDate(date);
const dayName = formatDate(date);
const log = ref<Log>({});
const dayLog = ref<DayLog>([]);
const dayExercises = ref<ExerciseKeys[]>([]);
const dayNotes = ref<Partial<Record<ExerciseKeys, string>>>({});

onMounted(async () => {
	log.value = await getLog();

	dayLog.value = log.value[day] ?? [];

	dayExercises.value =
		log.value[day]?.map((exercise) =>
			Array.isArray(exercise) ? (exercise[0] as ExerciseKeys) : exercise
		) ?? [];

	const notes = Object.fromEntries(
		log.value[day]?.map((exercise) =>
			Array.isArray(exercise)
				? [exercise[0], exercise[1]]
				: [exercise, '']
		) ?? []
	);

	dayNotes.value = Object.fromEntries(
		Object.keys(exercises).map((exerciseKey) => [
			exerciseKey,
			notes[exerciseKey] ?? '',
		])
	);
});

function updateDayLog() {
	log.value[day] = dayExercises.value.map((exerciseKey) => {
		const note = dayNotes.value[exerciseKey];
		return note ? [exerciseKey, note] : exerciseKey;
	});

	if (!dayExercises.value.length) delete log.value[day];
	updateProfile(log.value);
	localStorage.setItem('exerciseLog', JSON.stringify(log.value));
}
</script>

<template>
	<main>
		<h1 :class="{ home: isHome }">
			{{ isHome ? 'What exercise have you done today?' : dayName }}
		</h1>

		<label
			v-for="(exerciseText, exerciseKey) in exercises"
			:key="exerciseKey"
		>
			<input
				v-model="dayExercises"
				type="checkbox"
				:value="exerciseKey"
				@change="updateDayLog"
			/>

			<code>{{ exerciseKey }}</code>
			<span>{{ exerciseText }}</span>

			<em>{{ daysSince(log, dayLog, day, exerciseKey) }}</em>
			<input
				v-model="dayNotes[exerciseKey]"
				@blur="updateDayLog"
				class="note"
				:placeholder="exerciseText + '...'"
				maxlength="25"
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
	padding: 2px 1px;
	border-bottom: 2px solid transparent;
}

.note {
	display: none;
	grid-area: text;
	height: 100%;
	color: var(--cyan);
	padding: 2px 1px;
	border-bottom: 2px solid var(--blue);
	width: 26ch;
}

.note::placeholder {
	color: var(--blue);
	opacity: 0.5;
}

.note:focus,
.note:hover {
	border-color: var(--cyan);
	outline: none;
}

.note:focus::placeholder {
	opacity: 0;
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
