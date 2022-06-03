import { createClient, Session } from "@supabase/supabase-js"
import { ref } from "vue"

export const supabase = createClient(
	import.meta.env.VITE_APP_SUPABASE_URL as string,
	import.meta.env.VITE_APP_SUPABASE_KEY as string
)

export const userSession = ref<Session | null>(null)

export async function createProfile() {
	if (!userSession.value) return null

	// Check if profile exists
	// const { data: profiles, error } = await supabase
	//   .from("profiles")
	//   .select("exercise_log")
	//   .eq("user_id", userSession.value.user.id)

	// if (profiles[0]) return

	const localExerciseLog = localStorage.getItem("exerciseLog")

	try {
		const { data, error } = await supabase.from("profiles").insert([
			{
				user_id: userSession.value.user.id,
				exercise_log: JSON.parse(localExerciseLog),
			},
		])

		if (error) {
			console.warn("error", error)
			return
		}
	} catch (err) {
		alert("Error")
		console.error("Unknown problem inserting to db", err)
		return null
	}
}

export async function fetchExerciseLog() {
	if (!userSession.value) return null

	try {
		const { data: profiles, error } = await supabase
			.from("profiles")
			.select("exercise_log")
			.eq("user_id", userSession.value.user.id)

		if (error) {
			console.error("error", error)
			return null
		}

		if (profiles === null) {
			console.warn("no profiles fo user")
			return null
		}

		return profiles[0].exercise_log
	} catch (err) {
		console.error("Error retrieving data from db", err)
		return null
	}
}

export async function updateProfile(log) {
	if (!userSession.value) return null

	const { data, error } = await supabase
		.from("profiles")
		.update({ exercise_log: log })
		.eq("user_id", userSession.value.user.id)
}
