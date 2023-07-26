<script setup lang="ts">
import type { Log } from '../types';
import { createWeek } from '../helpers';
import { userSession } from '../supabase';
import exercises from '../exercises.json';
import { reactive } from 'vue';

const data = reactive({
	facet: 'all' as keyof typeof exercises | 'all',
});

const localLog = localStorage.getItem('exerciseLog') ?? '{}';
const log: Log = JSON.parse(localLog);
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
									v-for="(
										exercise, exerciseIndex
									) in day.data.filter(
										(exercise) =>
											data.facet === 'all' ||
											exercise === data.facet ||
											exercise[0] === data.facet
									)"
									:key="exerciseIndex"
									><span
										class="note"
										v-if="
											Array.isArray(exercise) &&
											data.facet !== 'all'
										"
									>
										{{ exercise[1] }} </span
									>{{
										Array.isArray(exercise)
											? exercise[0]
											: exercise
									}}</code
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
							<p class="total">
								{{
									week.total.filter(
										(item) =>
											data.facet.length > 1 ||
											item[0] === data.facet
									).length
								}}
							</p>
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
	<footer>
		<form>
			<label>
				<i>📊</i>
				<input
					type="radio"
					v-model="data.facet"
					:value="'all'"
					name="facet"
					checked
				/>
			</label>

			<label
				v-for="(exerciseText, exerciseKey) in exercises"
				:key="exerciseKey"
				:title="exerciseText"
			>
				<i>{{ exerciseKey }}</i>
				<input
					type="radio"
					v-model="data.facet"
					:value="exerciseKey"
					name="facet"
				/>
			</label>
		</form>
	</footer>
</template>

<style scoped>
main {
	direction: rtl;
	padding-inline: 0;
	align-content: end;
}

.container {
	overflow-x: auto;
	margin-bottom: 15dvh;
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

.note {
	writing-mode: vertical-lr;
	font-size: 1.25rem;
	font-weight: normal;
	transform: rotate(180deg);
	margin-inline: 0.5rem;
}

.count {
	display: block;
	padding-top: 2ch;
	color: var(--blue);
}

.weekend {
	color: var(--yellow);
}

.future,
.future * {
	color: var(--dark);
	pointer-events: none;
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

footer {
	position: fixed;
	inset: auto 0 0;
	background-color: var(--dark);
}

form {
	display: grid;
	grid-auto-flow: column;
	place-content: center;
	gap: 0.5rem;
}

label:has([type='radio']) {
	display: grid;
	grid-template: 'icon' auto / auto;
	place-content: center;
	padding: 0.7rem 0.5rem;
	border-top: 2px solid transparent;
	cursor: pointer;
}

label:has(:checked) {
	border-color: var(--blue);
}

label [type='radio'] {
	grid-area: icon;
	opacity: 0;
	cursor: pointer;
}

label i {
	grid-area: icon;
	font-style: normal;
	font-size: x-large;
}
</style>
