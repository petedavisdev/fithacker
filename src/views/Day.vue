<template>
	<header>
		<h1 :class="{ home: isHome }">
			<router-link to="/log" class="fl-r icon">➔</router-link>
			{{ isHome ? "What exercise have you done today?" : dayName }}
		</h1>

		<ExerciseArray :exerciseArray="dayLog.sort()" class="total" />

		<input
			type="search"
			:value="keyword"
			placeholder="⌕"
			@input="keyword = $event.target.value"
			ref="searchinput"
		/>
	</header>

	<main>
		<label v-for="(meta, code) in filteredExercise" :key="code">
			<input
				v-model="dayLog"
				type="checkbox"
				:value="code"
				@change="updateDayLog"
			/>

			<span>
				<code :style="{ color: `var(--${code})` }">
					{{ code }}
				</code>
				=
				{{ meta.family }}
			</span>
		</label>
	</main>

	<app-footer />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { formatDate, shortenDate } from "../helpers";
import exercises from "../exercises.json";
import AppFooter from "../components/AppFooter.vue";
import ExerciseArray from "../components/ExerciseArray.vue";
import { fetchExerciseLog, updateProfile, userSession } from "../supabase";

interface Exercise {
	family: string[];
}

export default defineComponent({
	components: {
		AppFooter,
		ExerciseArray,
	},
	setup() {
		const route = useRoute();

		const isHome = route.path === "/";

		const routeDay = route.params.date?.toString();

		const day = routeDay ? new Date(routeDay) : new Date();

		const dayKey = shortenDate(day);

		const dayName = formatDate(day);

		const log = ref({});

		const dayLog = ref([]);

		async function getLog() {
			log.value = await fetchExerciseLog();

			const localLog =
				JSON.parse(localStorage.getItem("exerciseLog")) || {};

			if (log.value && localLog) {
				localStorage.setItem(
					"exerciseLog",
					JSON.stringify({
						...log.value,
						...localLog,
					})
				);
			} else if (log.value) {
				localStorage.setItem("exerciseLog", JSON.stringify(log.value));
			} else if (localLog) {
				log.value = localLog;
			}

			dayLog.value = log.value[dayKey] || [];
		}

		getLog();

		const keyword = ref("");

		const searchinput = ref(null);

		function updateDayLog() {
			log.value[dayKey] = dayLog.value;
			localStorage.setItem("exerciseLog", JSON.stringify(log.value));

			updateProfile(log.value);

			// focus back on search input after each update
			if (keyword.value) {
				keyword.value = "";
				searchinput.value.focus();
			}
		}

		// TODO: sort exercise by code alphabetically
		const filteredExercise = computed(() => {
			const sortedExercise = {};

			// Sort alhpabetically by key
			Object.keys(exercises)
				.sort()
				.forEach((key) => {
					sortedExercise[key] = exercises[key];
				});

			if (!keyword.value) return sortedExercise;

			const term = keyword.value.toUpperCase();
			const exerciseEntries = Object.entries(sortedExercise);

			const strongEntries = exerciseEntries.filter(([key, value]) => {
				return value.family.toUpperCase().startsWith(term);
			});

			const goodEntries = exerciseEntries.filter(([key, value]) => {
				return value.family.toUpperCase().includes(term);
			});

			const codeMatches = exerciseEntries.filter(([key, value]) => {
				return key.includes(term);
			});

			return {
				...Object.fromEntries(strongEntries),
				...Object.fromEntries(goodEntries),
				...Object.fromEntries(codeMatches),
			};
		});

		return {
			dayLog,
			dayName,
			filteredExercise,
			isHome,
			keyword,
			updateDayLog,
			searchinput,
			log,
		};
	},
});
</script>

<style scoped>
header {
	position: sticky;
	z-index: 1;
	top: 0;
	left: 0;
	right: 0;
	background-color: #124;
}

h1 {
	padding: 1rem 1rem 0.5rem;
	margin: 0;
}

main {
	padding: 1em;
	flex-grow: 1;
}

[type="search"] {
	padding: 1rem;
	background-color: gainsboro;
	width: 100%;
	border-radius: 0;
}

[type="search"]::placeholder {
	font-size: x-large;
}

[type="checkbox"] {
	height: 2rem;
	width: 1.5rem;
	position: absolute;
}

label {
	display: block;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
	margin: 0.5ch;
}

label * {
	padding: 1ch 0.5ch 1ch 1rem;
}

:checked ~ * {
	background-color: #346;
}

aside {
	padding: 1em;
}

.total {
	padding-inline: 1em 1ch;
}

.icon {
	padding-inline: 0.25ch;
	transform: scale(1.5);
}
</style>
