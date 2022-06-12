<template>
	<main>
		<div class="container">
			<table>
				<tr class="exercise-per-day">
					<template v-for="(week, index) in weeks" :key="index">
						<td v-for="(day, index) in week.log" :key="index">
							<router-link
								:to="{ name: 'Day', params: { date: day.date } }"
								:class="day.future && 'future'"
							>
								<span v-if="!day.data.length && !day.future" class="count">+</span>
								<code v-for="(exercise, index) in day.data" :key="index" class="code">{{
									exercise
								}}</code>
							</router-link>
						</td>
					</template>

					<td v-if="weeks.length > 1 && !hasPlus"></td>
				</tr>

				<tr class="day-headings">
					<template v-for="(week, index) in weeks" :key="index">
						<td v-for="(day, index) in week.log" :key="index">
							<router-link
								:to="{ name: 'Day', params: { date: day.date } }"
								:class="day.future && 'future'"
								class="date"
							>
								{{ day.name }}
							</router-link>
						</td>
					</template>

					<td v-if="weeks.length > 1 && !hasPlus"></td>
				</tr>

				<tr class="week-summaries">
					<template v-for="(week, index) in weeks" :key="index">
						<th colspan="7" scope="colgroup" class="week">
							<h2>{{ week.title }}</h2>
							<p class="total">{{ week.total.length }}</p>
							<p class="all">{{ week.total.sort().join(' ') }}</p>
						</th>
					</template>

					<th v-if="weeks.length > 1 && !hasPlus">
						<h4>Want to see more than 2 weeks?</h4>
						<p class="message">
							Support the development of Fithacker -
							<template v-if="!userSession"
								><router-link :to="{ name: 'Account' }">Log in</router-link>
								and
							</template>
							<a href="https://www.buymeacoffee.com/petedavis"> buy me a coffee </a>
							😉
						</p>
					</th>
				</tr>
			</table>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatDate, createWeek } from '../helpers';
import { userSession } from '../supabase';

export default defineComponent({
	setup() {
		let date = new Date();
		let weeks = [];
		const localLog = localStorage.getItem('exerciseLog');
		const log = localLog ? JSON.parse(localLog) : {};
		const firstDateInLog = new Date(Object.keys(log).sort()[0]);
		const firstDateToShow = firstDateInLog && new Date(firstDateInLog.setDate(firstDateInLog.getDate() - 7))

		do {
			const week = createWeek(date, log);
			if (week) weeks.push(week);
			date = new Date(date.setDate(date.getDate() - 7));
		console.log(firstDateToShow && firstDateToShow < date)
		} while (firstDateToShow && firstDateToShow < date)

		weeks[0].title = 'This week'
		if (weeks[1]) weeks[1].title = 'Last week'

		const nameDay = (date) => formatDate(new Date(date));

		const hasPlus = log.plus;

		if (!hasPlus) weeks = weeks.slice(0,2);

		return {
			hasPlus,
			nameDay,
			weeks,
			userSession,
		};
	},
});
</script>

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
