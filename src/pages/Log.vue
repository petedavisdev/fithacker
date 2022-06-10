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

					<td v-if="weeks.length > 1"></td>
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

					<td v-if="weeks.length > 1"></td>
				</tr>

				<tr class="week-summaries">
					<template v-for="(week, index) in weeks" :key="index">
						<th colspan="7" scope="colgroup" class="week">
							<h2>{{ week.name }}</h2>
							<p class="total">{{ week.total.length }}</p>
							<p class="all">{{ week.total.sort().join(' ') }}</p>
						</th>
					</template>

					<th v-if="weeks.length > 1">
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
		const log = JSON.parse(localStorage.getItem('exerciseLog')) || {};
		const today = new Date();

		const thisWeekName = 'This week'
		const [thisWeekLog, thisWeekTotal] = createWeek(today, log);

		const firstDateInLog = Object.keys(log).sort()[0];
		const firstDateThisWeek = thisWeekLog[6].date;

		const lastWeekName = 'Last week'
		let lastWeekLog = {};
		let lastWeekTotal = [];

		if (firstDateInLog < firstDateThisWeek) {
			const weekAgo = new Date(today.setDate(today.getDate() - 7));
			[lastWeekLog, lastWeekTotal] = createWeek(weekAgo, log);
		}

		const nameDay = (date) => formatDate(new Date(date));

		const weeks = [
			{ name: thisWeekName, log: thisWeekLog, total: thisWeekTotal },
			{ name: lastWeekName, log: lastWeekLog, total: lastWeekTotal }
		]

		return {
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
	display: grid;
	place-content: center;
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
