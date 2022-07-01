import { DateTime } from 'luxon';
import Debug from 'debug';

const patterns = [
	/^.*(?<date>\d{4}[-_.]?\d{2}[-_.]?\d{2}T?\d{2}:?\d{2}:?\d{2}).*$/i, // YYYYMMDDHHMMSS, YYYYMMDDTHHMMSS
	/^.*(?<date>\d{4}[-_.]?\d{2}[-_.]?\d{2}T?\d{2}:?\d{2}).*$/i, // YYYYMMDDHHMMSS, YYYYMMDDTHHMMSS
	/^.*(?<date>\d{4}[-_.]?\d{2}[-_.]?\d{2}\s+\d{2}\.\d{2}\.\d{2}).*$/i, // YYYYMMDD HH.MM.DD, YYYY-MM-DD HH.MM.DD
	/^.*(?<date>\d{4}[-_.]?\d{2}[-_.]?\d{2}).*$/, // YYYYMMDD, YYYY-MM-DD
	/^.*(?<date>\d{4}-?\d{2}-?\d{2}T?\d{2}-\d{4}).*$/, // YYYYMMDDHH-ZONE, YYYYMMDDTHH-ZONE
	/^.*(?<date>\d{4}-?\d{2}-?\d{2}T?\d{2}:?\d{2}).*$/, // YYYYMMDDHHMM, YYYYMMDDTHHMM
];

const formats = [
	'yyyyMMddHHmmss',
	'yyyy-MM-dd HH.mm.ss'
];

const debug = Debug('rotatelib:parse');

export function parseDateFromString(input: string): DateTime | null {
	for (let index = 0; index < patterns.length; index++) {
		const pattern = patterns[index];
		const match = pattern.exec(input);
		if (match && match.groups?.date) {
			debug(`Matched [${input}] with [${pattern}]`);
			const parsedDate = DateTime.fromISO(match.groups.date);
			if (parsedDate.isValid) {
				return parsedDate;
			}

			// expand our parsing to specific formats
			for (let index = 0; index < formats.length; index++) {
				const format = formats[index];
				const parsedDateAttempt = DateTime.fromFormat(match.groups.date, format);
				if (parsedDateAttempt.isValid) {
					return parsedDateAttempt;
				}
			}

			debug(`Could not parse date for ${match.groups.date}`, pattern);
		}
	}
	return null;
}

export function parseRelativeDate(date: string) {
	if (date === 'today') {
		return DateTime.now();
	}

	if (date === 'yesterday') {
		return DateTime.now().minus({ day: 1});
	}

	if (date === 'tomorrow') {
		return DateTime.now().plus({ day: 1 });
	}

	// first, try moment and see if it works
	const parsedDate = DateTime.fromISO(date);
	if (parsedDate.isValid) {
		return parsedDate;
	}

	if (/^([-+]?\d+)$/.test(date) || /^([-+]?\d+) days?$/.test(date)) {
		date = date.replace(' days', '').replace(' day', '');
		const days = parseInt(date, 10);
		if (days < 0) {
			return DateTime.now().minus({ days: Math.abs(days) });
		}
		return DateTime.now().plus({ days: Math.abs(days) });
	}
	else if (/^([-+]?\d+) (week|weeks|year|years)$/.test(date)) {
		const result = /^([-+]?\d+) (week|weeks|year|years)$/.exec(date);
		if (result) {
			const length = parseInt(result[1], 10);
			if (length < 0) {
				return DateTime.now().minus({ [result[2]]: Math.abs(length) });
			}
			return DateTime.now().plus({ [result[2]]: Math.abs(length) });
		}
	}

	// couldn't figure out anything, return the invalid date
	return parsedDate;
}
