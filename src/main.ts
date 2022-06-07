import { createApp } from "vue"
import App from "./App.vue"
import "./modern-normalize.css"
import "./index.css"
import { router } from "./router"
import { supabase } from "./supabase"
import { userSession } from "./supabase"

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("service-worker.js")
		.then(() => console.log("Registration Successful"))
}

createApp(App).use(router).mount("#app")

supabase.auth.onAuthStateChange((event, session) => {
	userSession.value = session
})
