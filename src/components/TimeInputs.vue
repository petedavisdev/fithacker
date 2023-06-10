<template>
	<section>
		<h2>Eating window</h2>
		<input
			name="startHour"
			type="number"
			min="0"
			max="24"
			step="1"
			pattern="\d*"
			inputmode="numeric"
		/>:<input
			name="startMinute"
			type="number"
			min="0"
			max="59"
			step="5"
			pattern="\d*"
			inputmode="numeric"
		/>
		<i>&rarr;</i>
		<input
			name="stopHour"
			type="number"
			min="0"
			max="24"
			step="1"
			pattern="\d*"
			inputmode="numeric"
		/>:<input
			name="stopMinute"
			type="number"
			min="0"
			max="59"
			step="5"
			pattern="\d*"
			inputmode="numeric"
		/>
	</section>
</template>

<style scoped>
section {
	text-align: center;
}
input,
i {
	font-size: 2em;
	width: 5ch;
	padding: 0.1em 0.5ch;
}
</style>
