import { Session, createClient } from '@supabase/supabase-js';

import { ref } from 'vue';

export const supabase = createClient(
	import.meta.env.VITE_APP_SUPABASE_URL ?? '',
	import.meta.env.VITE_APP_SUPABASE_KEY ?? ''
);

export const userSession = ref<Session | null>(null);

export async function createProfile() {
	if (!userSession.value) return null;

	const localExerciseLog = localStorage.getItem('exerciseLog') ?? '';

	try {
		const { error } = await supabase.from('profiles').insert([
			{
				user_id: userSession.value.user.id,
				exercise_log: JSON.parse(localExerciseLog),
			},
		]);

		if (error) {
			console.warn('error', error);
			return;
		}
	} catch (error) {
		console.error('Unknown problem inserting to db: ', error);
		return null;
	}
}

async function fetchProfile(): Promise<Record<string, string[]>> {
	try {
		if (!userSession.value) throw 'not logged in';

		const { data: profiles, error } = await supabase
			.from('profiles')
			.select('exercise_log')
			.eq('user_id', userSession.value.user.id);

		if (error) throw error;

		if (profiles === null) throw 'no profiles fo user';

		if (!profiles[0].exercise_log) throw 'no exercise_log on profile';

		return profiles[0];
	} catch (err) {
		console.error('Error fetching data:', err);
		return {};
	}
}

export async function getLog() {
	const fetchedProfile = await fetchProfile();
	const fetchedLog = fetchedProfile.exercise_log;
	const localLog = localStorage.getItem('exerciseLog');
	const log = localLog ? JSON.parse(localLog) : {};
	const mergedLog = { ...fetchedLog, ...log };

	localStorage.setItem('exerciseLog', JSON.stringify(mergedLog));

	return mergedLog;
}

export async function updateProfile(log: Record<string, string[]>) {
	if (!userSession.value) return null;

	const { data, error } = await supabase
		.from('profiles')
		.update({ exercise_log: log })
		.eq('user_id', userSession.value.user.id);
}
