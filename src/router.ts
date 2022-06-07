import { createRouter, createWebHistory } from "vue-router"
import Account from "./pages/Account.vue"
import Day from "./pages/Day.vue"
import Log from "./pages/Log.vue"

const routes = [
	{
		path: "/",
		name: "Home",
		component: Day,
	},
	{
		path: "/account",
		name: "Account",
		component: Account,
	},
	{
		path: "/log",
		name: "Log",
		component: Log,
	},
	{
		path: "/:date",
		name: "Day",
		component: Day,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
