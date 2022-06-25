import { ref } from "vue"
import { fetchProfile } from "./supabase"

export default function useProfile() {
	const profile = ref({ plus: false })

	async function getProfile() {
		const { exercise_log, plus } = await fetchProfile()
		const localLog = localStorage.getItem("exerciseLog")
		const log = localLog ? JSON.parse(localLog) : {}
		const mergedProfile = { ...exercise_log, ...log, plus }

		localStorage.setItem("exerciseLog", JSON.stringify(mergedProfile))

		profile.value = mergedProfile
	}

	return { profile, getProfile }
}
