<template>
    <header>
        <router-link to="log">
            <strong>➔</strong>
            <span>VEG</span><span>HAC</span><span>KER</span>
            0.3-alpha
        </router-link>

        <router-link to="account" class="fl-r">{{
            userSession ? "😃" : "👋"
        }}</router-link>

        <a href="/guide" class="fl-r">📖</a>
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
    color: yellowgreen;
    font-weight: bold;
}
span:first-of-type {
    color: yellow;
}
span:last-of-type {
    color: limegreen;
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