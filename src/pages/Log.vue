<script setup lang="ts">
import { createWeek } from '../helpers';
import { userSession } from '../supabase';
import exercises from '../exercises.json';

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
		<div class="container">
			<table>
				<tr class="exercise-per-day">
					<template v-for="(week, index) in weeks" :key="index">
						<td v-for="(day, index) in week.log" :key="index">
							<router-link
								:to="{
									name: 'Day',
									params: { date: day.date },
								}"
								:class="day.future && 'future'"
							>
								<span
									v-if="!day.data.length && !day.future"
									class="count"
									>+</span
								>
								<code
									v-for="(exercise, index) in day.data.sort()"
									:key="index"
									class="code"
									>{{
										exercises[
											exercise as keyof typeof exercises
										].icon
									}}</code
								>
							</router-link>
						</td>
					</template>

					<td v-if="weeks.length > 1 && !userSession"></td>
				</tr>

				<tr class="day-headings">
					<template v-for="(week, index) in weeks" :key="index">
						<td v-for="(day, index) in week.log" :key="index">
							<router-link
								:to="{
									name: 'Day',
									params: { date: day.date },
								}"
								:class="{
									future: day.future,
									weekend: index < 2,
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
					<template v-for="(week, index) in weeks" :key="index">
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

.code {
	display: block;
	font-size: x-large;
	margin-top: 0.25em;
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
</style>
