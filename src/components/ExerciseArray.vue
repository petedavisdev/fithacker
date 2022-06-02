<template>
	<div>
		<code
			v-for="(meta, code, index) in exerciseObj"
			:key="index"
			:style="{ color: `var(--${code})` }"
			class="code"
			>{{ code }}</code
		>

		<span v-if="exerciseArray.length" class="count">
			// {{ exerciseArray.length }}</span
		>

		<span class="search-input-target"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import exercises from "../exercises.json";

export default defineComponent({
	props: {
		exerciseArray: Array,
		default: [],
	},
	computed: {
		exerciseObj() {
			const exerciseObject = {};

			this.exerciseArray.forEach((code) => {
				if (code in exercises) exerciseObject[code] = exercises[code];
			});

			return exerciseObject;
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
