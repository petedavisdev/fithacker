<template>
    <app-header />

    <main>
        <div class="container">
            <table>
                <tr>
                    <td v-for="(day, index) in thisWeekLog" :key="index">
                        <router-link
                            :to="'/' + day.date"
                            :class="day.future && 'future'"
                        >
                            <span
                                v-if="day.data.length && !day.future"
                                class="count"
                            >
                                {{ day.data.length }}
                            </span>
                            <span
                                v-if="!day.data.length && !day.future"
                                class="count"
                                >+</span
                            >
                            <code
                                v-for="(exercise, index) in day.data"
                                :key="index"
                                class="code"
                                :style="{ color: `var(--${exercise})` }"
                                >{{ exercise }}</code
                            >
                        </router-link>
                    </td>

                    <td v-for="(day, index) in lastWeekLog" :key="index">
                        <router-link :to="'/' + day.date">
                            <span class="count">
                                {{ day.data.length }}
                            </span>
                            <code
                                v-for="(exercise, index) in day.data.sort()"
                                :key="index"
                                class="code"
                                :style="{ color: `var(--${exercise})` }"
                                >{{ exercise }}</code
                            >
                        </router-link>
                    </td>

                    <td v-if="lastWeekLog.length"></td>
                </tr>

                <tr>
                    <td v-for="(day, index) in thisWeekLog" :key="index">
                        <router-link
                            :to="'/' + day.date"
                            :class="day.future && 'future'"
                            class="date"
                        >
                            {{ day.name }}
                        </router-link>
                    </td>

                    <td v-for="(day, index) in lastWeekLog" :key="index">
                        <router-link :to="'/' + day.date" class="date">
                            {{ day.name }}
                        </router-link>
                    </td>

                    <td v-if="lastWeekLog.length"></td>
                </tr>

                <tr>
                    <th colspan="7" scope="colgroup" class="week">
                        <h2>This week</h2>
                        <ExerciseArray
                            :exerciseArray="thisWeekTotal"
                            class="total"
                        />
                    </th>
                    <th
                        v-if="lastWeekLog.length"
                        colspan="7"
                        scope="colgroup"
                        class="week"
                    >
                        <h2>Last week</h2>
                        <ExerciseArray
                            :exerciseArray="lastWeekTotal"
                            class="total"
                        />
                    </th>
                    <th v-if="lastWeekLog.length">
                        <h4>Want to see more than 2 weeks?</h4>
                        <p class="total">
                            Support the development of Fithacker -
                            <template v-if="!userSession"
                                ><router-link to="/account">Log in</router-link>
                                and
                            </template>
                            <a href="https://www.buymeacoffee.com/petedavis">
                                buy me a coffee
                            </a>
                            😉
                        </p>
                    </th>
                </tr>
            </table>
        </div>
    </main>

    <app-footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate, createWeek } from "../helpers";
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import ExerciseArray from "../components/ExerciseArray.vue";
import { userSession } from "../supabase";

export default defineComponent({
    components: {
        AppFooter,
        AppHeader,
        ExerciseArray,
    },
    setup() {
        const log = JSON.parse(localStorage.getItem("exerciseLog")) || {};
        const today = new Date();
        const [thisWeekLog, thisWeekTotal] = createWeek(today, log);

        const firstDateInLog = Object.keys(log).sort()[0];
        const firstDateThisWeek = thisWeekLog[6].date;

        let lastWeekLog = {};
        let lastWeekTotal = [];

        if (firstDateInLog < firstDateThisWeek) {
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            [lastWeekLog, lastWeekTotal] = createWeek(weekAgo, log);
        }

        const nameDay = (date) => formatDate(new Date(date));

        return {
            nameDay,
            thisWeekLog,
            thisWeekTotal,
            lastWeekLog,
            lastWeekTotal,
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
    border-spacing: 2ch;
}

th,
td {
    direction: ltr;
}

td {
    vertical-align: bottom;
}

th {
    vertical-align: top;
    border-top: 2px solid #124;
}

.count {
    display: block;
    padding-top: 2ch;
    color: royalblue;
}

.future,
.future * {
    color: #124;
    pointer-events: none;
}

.code {
    display: block;
    margin-top: 0.5em;
}

.container {
    overflow-x: auto;
}

p {
    font-weight: normal;
}

.total {
    width: 35ch;
}
</style>
