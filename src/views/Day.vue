<template>
    <header>
        <h1 :class="{ home: isHome }">
            <router-link to="/log" class="fl-r icon">➔</router-link>
            {{ isHome ? "What veg have you eaten today?" : dayName }}
        </h1>

        <VegArray :vegArray="dayLog.sort()" class="total" />

        <input
            type="search"
            :value="keyword"
            placeholder="⌕"
            @input="keyword = $event.target.value"
            ref="searchinput"
        />
    </header>

    <main>
        <label v-for="(meta, code) in filteredVeg" :key="code">
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
import vegetables from "../vegetables.json";
import AppFooter from "../components/AppFooter.vue";
import VegArray from "../components/VegArray.vue";
import { fetchVeglog, updateProfile, userSession } from "../supabase";

interface Veg {
    family: string[];
}

export default defineComponent({
    components: {
        AppFooter,
        VegArray,
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
            log.value = await fetchVeglog();

            const localLog = JSON.parse(localStorage.getItem("vegLog")) || {};

            if (log.value && localLog) {
                localStorage.setItem(
                    "vegLog",
                    JSON.stringify({
                        ...log.value,
                        ...localLog,
                    })
                );
            } else if (log.value) {
                localStorage.setItem("vegLog", JSON.stringify(log.value));
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
            localStorage.setItem("vegLog", JSON.stringify(log.value));

            updateProfile(log.value);

            // focus back on search input after each update
            if (keyword.value) {
                keyword.value = "";
                searchinput.value.focus();
            }
        }

        // TODO: sort veg by code alphabetically
        const filteredVeg = computed(() => {
            const sortedVeg = {};

            // Sort alhpabetically by key
            Object.keys(vegetables)
                .sort()
                .forEach((key) => {
                    sortedVeg[key] = vegetables[key];
                });

            if (!keyword.value) return sortedVeg;

            const term = keyword.value.toUpperCase();
            const vegEntries = Object.entries(sortedVeg);

            const strongEntries = vegEntries.filter(([key, value]) => {
                return value.family.toUpperCase().startsWith(term);
            });

            const goodEntries = vegEntries.filter(([key, value]) => {
                return value.family.toUpperCase().includes(term);
            });

            const codeMatches = vegEntries.filter(([key, value]) => {
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
            filteredVeg,
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
