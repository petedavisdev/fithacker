<script setup lang="ts">
import { createWeek } from '../helpers';
import { userSession } from '../supabase';
import exercises from '../exercises.json';
import { reactive } from 'vue';

const data = reactive({
	view: 'chart' as 'chart' | 'streak',
});

const localLog = localStorage.getItem('exerciseLog') ?? '{}';
const log = JSON.parse(localLog);
const firstDateInLog = new Date(Object.keys(log).sort()[0]);

let date = new Date();
let weeks: ReturnType<typeof createWeek>[] = [];

do {
	const week = createWeek(date, log);
	if (week) weeks.push(week);
	date = new Date(date.setDate(date.getDate() - 7));
} while (firstDateInLog && firstDateInLog < date);

weeks[0].title = 'This week';
if (weeks[1]) weeks[1].title = 'Last week';

if (!userSession.value) weeks = weeks.slice(0, 2);
</script>

<template>
	<main>
		<form>
			<label>
				<i>📊</i>
				<input
					type="radio"
					v-model="data.view"
					value="chart"
					name="view"
					id="chart-view"
					checked
				/>
			</label>

			<label>
				<i>🗓️</i>
				<input
					type="radio"
					v-model="data.view"
					value="streak"
					name="view"
					id="streak-view"
				/>
			</label>
		</form>

		<div class="container">
			<table>
				<tr class="exercise-per-day">
					<template
						v-for="(week, weekIndex) in weeks"
						:key="weekIndex"
					>
						<td v-for="(day, dayIndex) in week.log" :key="dayIndex">
							<router-link
								:to="{
									name: 'Day',
									params: { date: day.date },
								}"
								:class="day.future && 'future'"
							>
								<code
									v-for="(exercise, key) in exercises"
									:key="key"
									:class="{
										faded: !day.data.includes(key),
										hidden:
											(data.view === 'chart' &&
												!day.data.includes(key)) ||
											day.future,
									}"
									>{{ exercise.icon }}</code
								>
							</router-link>
						</td>
					</template>

					<td v-if="weeks.length > 1 && !userSession"></td>
				</tr>

				<tr class="day-headings">
					<template
						v-for="(week, weekIndex) in weeks"
						:key="weekIndex"
					>
						<td v-for="(day, dayIndex) in week.log" :key="dayIndex">
							<router-link
								:to="{
									name: 'Day',
									params: { date: day.date },
								}"
								:class="{
									future: day.future,
									weekend: dayIndex < 2,
								}"
								class="date"
							>
								{{ day.name }}
							</router-link>
						</td>
					</template>

					<td v-if="weeks.length > 1 && !userSession"></td>
				</tr>

				<tr class="week-summaries">
					<template
						v-for="(week, weekIndex) in weeks"
						:key="weekIndex"
					>
						<th colspan="7" scope="colgroup" class="week">
							<h2>{{ week.title }}</h2>
							<p class="total">{{ week.total.length }}</p>
						</th>
					</template>

					<th v-if="weeks.length > 1 && !userSession">
						<h4>Want to see more than 2 weeks?</h4>
						<p class="message">
							<template v-if="!userSession"
								><router-link :to="{ name: 'Account' }"
									>Login/Register</router-link
								>
							</template>
						</p>
					</th>
				</tr>
			</table>
		</div>
	</main>
</template>

<style scoped>
main {
	direction: rtl;
	padding-inline: 0;
}

table {
	text-align: center;
	border-spacing: 1.2ch;
}

th,
td {
	direction: ltr;
}

td {
	vertical-align: bottom;
	min-width: 32px;
}

th {
	vertical-align: top;
	border-top: 2px solid var(--blue);
}

code {
	display: block;
	font-size: x-large;
	margin-top: 0.25em;
}

.count {
	display: block;
	padding-top: 2ch;
	color: var(--blue);
}

.weekend {
	color: var(--yellow);
}

.faded {
	opacity: 0.1;
}

.hidden {
	display: none;
}

.future,
.future * {
	color: var(--dark);
	pointer-events: none;
}

.container {
	overflow-x: auto;
}

p {
	font-weight: normal;
}

.total {
	font-size: xx-large;
	font-weight: bold;
	color: var(--yellow);
	margin-top: 0;
}

.all {
	line-height: 2;
	font-size: small;
	padding-inline: 2em;
}

.message {
	width: 35ch;
}

form {
	direction: ltr;
	display: grid;
	grid-auto-flow: column;
	place-content: center;
	gap: 2px;
	margin: 1rem;
}

label:has([type='radio']) {
	display: grid;
	grid-template: 'icon' auto / auto;
	place-content: center;
	padding: 0.6rem 1rem 0.4rem;
	background-color: var(--dark);
	border-bottom: 2px solid var(--dark);
}

label:has(:checked) {
	border-color: var(--blue);
}

label [type='radio'] {
	grid-area: icon;
	opacity: 0;
}

label i {
	grid-area: icon;
	font-style: normal;
	font-size: x-large;
}
</style>
