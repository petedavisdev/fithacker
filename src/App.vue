<template>
    <AppHeader />
    <router-view v-if="online" />
    <h1 v-else style="text-align: center">You are offline</h1>
    <AppFooter />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

export default defineComponent({
	components: {
		AppHeader,
		AppFooter,
	},
    setup() {
        const online = ref(true);

        window.addEventListener('online', () => online.value = true);
        window.addEventListener('offline', () => online.value = false);

        return { online }
    }
})
</script>