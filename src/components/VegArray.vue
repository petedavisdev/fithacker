<template>
    <div>
        <code
            v-for="(meta, code, index) in vegObj"
            :key="index"
            :style="{ color: `var(--${code})` }"
            class="code"
            >{{ code }}</code
        >

        <span v-if="vegArray.length" class="count">
            // {{ vegArray.length }}</span
        >

        <span class="search-input-target"></span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import vegetables from "../vegetables.json";

export default defineComponent({
    props: {
        vegArray: Array,
        default: [],
    },
    computed: {
        vegObj() {
            const vegObject = {};

            this.vegArray.forEach((code) => {
                if (code in vegetables) vegObject[code] = vegetables[code];
            });

            return vegObject;
        },
    },
});
</script>

<style scoped>
.count {
    float: right;
    color: royalblue;
    margin-right: 1ch;
    font-weight: normal;
}

div {
    color: silver;
    margin-bottom: 1ch;
    text-align: left;
}
</style>
