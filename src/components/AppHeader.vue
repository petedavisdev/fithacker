<template>
    <header>
        <router-link :to="{ name: 'Log' }">
            <strong>➔</strong>
            <span>FIT</span><span>HAC</span><span>KER</span>
            0.1-alpha
        </router-link>

        <router-link :to="{ name: 'Account' }" class="fl-r">{{
            userSession ? "😃" : "👋"
        }}</router-link>

        <a href="https://github.com/petedavisdev/fithacker/" class="fl-r">📖</a>
    </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userSession } from "../supabase";

export default defineComponent({
    setup() {
        return {
            userSession,
        };
    },
});
</script>

<style scoped>
header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background-color: #124;
    padding: 1rem;
}

span {
    color: #7fdbca;
    font-weight: bold;
}
span:first-of-type {
    color: #ffeb95;
}
span:last-of-type {
    color: #82aaff;
}

.fl-r {
    transform: scale(1.5);
}

strong {
    display: inline-block;
    transform: rotate(180deg) scale(2);
    margin-right: 2ch;
}

.router-link-exact-active strong {
    display: none;
}
</style>