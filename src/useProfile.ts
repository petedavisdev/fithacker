import { reactive } from "vue"
import { fetchProfile } from "./supabase"

export function useProfile() {
	const profile = reactive({
		log: {},
		plus: false,
	})

	async function getProfile() {
		const { exercise_log, plus } = await fetchProfile()
		console.log({ exercise_log, plus })

		const localLog = JSON.parse(localStorage.getItem("exerciseLog")) || {}

		profile.log = { ...exercise_log, ...localLog }
		profile.plus = plus

		localStorage.setItem("exerciseLog", JSON.stringify(profile.log))
	}

	return { profile, getProfile }
}
