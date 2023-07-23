import exercises from './exercises.json';

export type ExerciseCodes = keyof typeof exercises;

export type Activity = (ExerciseCodes | [ExerciseCodes, string])[];

export type Log = { [dayKey: string]: Activity };
