import exercises from './exercises.json';

export type ExerciseKeys = keyof typeof exercises;

export type DayLog = (ExerciseKeys | [ExerciseKeys, string])[];

export type Log = { [dayKey: string]: DayLog };
