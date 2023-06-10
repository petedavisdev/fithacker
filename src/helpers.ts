import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export function shortenDate(date: Date) {
	return date.toISOString().split('T')[0];
}

export function formatDate(date: Date): String {
	const shortDate = shortenDate(date);
	const today = new Date();
	const yesterday = new Date(Date.now() - 864e5);
	const weekAgo = new Date(Date.now() - 7 * 864e5);
	const dayNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	if (shortDate === shortenDate(today)) return 'Today';

	if (shortDate === shortenDate(yesterday)) return 'Yesterday';

	if (shortDate > shortenDate(weekAgo)) return dayNames[date.getDay()];

	return dayNames[date.getDay()] + ' ' + shortenDate(date);
}

export function createWeek(currentDate: Date, log: Record<string, string[]>) {
	const endDate = dayjs(currentDate).endOf('isoWeek');
	const dayNames = ['Sun', 'Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon'];
	const total: string[] = [];

	const weekLog = dayNames.map((name, index) => {
		const date = dayjs(endDate).subtract(index, 'day').format('YYYY-MM-DD');
		const future = dayjs().isBefore(dayjs(date));
		const data = log[date] ?? [];
		total.push(...data);
		return { name, date, future, data };
	});

	const monday = weekLog[6].date;
	const sunday = weekLog[0].date;

	const title = formatWeekTitle(monday, sunday);

	return { log: weekLog, total, title };
}

function formatWeekTitle(monday: string, sunday: string) {
	const isThisYear = dayjs(monday).year() === dayjs().year();
	const isInOneYear = dayjs(monday).year() === dayjs(sunday).year();
	const isInOneMonth = dayjs(monday).month() === dayjs(sunday).month();

	if (isThisYear && isInOneYear && isInOneMonth) {
		return (
			dayjs(monday).format('D') + ' - ' + dayjs(sunday).format('D MMM')
		);
	}

	if (isThisYear && isInOneYear) {
		return (
			dayjs(monday).format('D MMM') +
			' - ' +
			dayjs(sunday).format('D MMM')
		);
	}

	if (isInOneMonth) {
		return (
			dayjs(monday).format('D') +
			' - ' +
			dayjs(sunday).format('D MMM YYYY')
		);
	}

	if (isInOneYear) {
		return (
			dayjs(monday).format('D MMM') +
			' - ' +
			dayjs(sunday).format('D MMM YYYY')
		);
	}

	return (
		dayjs(monday).format('D MMM YYYY') +
		' - ' +
		dayjs(sunday).format('D MMM')
	);
}

export function daysSince(
	log: Record<string, string[]>,
	dayLog: string[],
	day: string,
	code: string
) {
	if (dayLog.includes(code)) return;

	const logArray = Object.entries(log);
	const days = logArray
		.filter(([_d, activities]) => activities.includes(code))
		.map(([d, _activities]) => d);
	const indexOfDay = [...days, day].sort().indexOf(day);

	if (indexOfDay < 1) return;

	const previousDay = days.at(indexOfDay - 1);

	return dayjs(day).diff(previousDay, 'day');
}
