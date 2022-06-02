import { createRouter, createWebHashHistory } from "vue-router";
import Account from "./views/Account.vue";
import Day from "./views/Day.vue";
import Log from "./views/Log.vue";

const routes = [
	{
		path: "/",
		component: Day,
	},
	{
		path: "/account",
		component: Account,
	},
	{
		path: "/log",
		component: Log,
	},
	{
		path: "/:date",
		component: Day,
	},
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
