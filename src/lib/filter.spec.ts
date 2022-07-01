import { DateTime } from 'luxon';
import { Filter } from './filter';
describe('filter', () => {

	test('sort ascending', () => {
		const items = [
			{ item: '1', itemDate: DateTime.fromISO('2022-06-23T08:27:00') },
			{ item: '2', itemDate: DateTime.fromISO('2022-06-23T09:27:00') },
			{ item: '3', itemDate: DateTime.fromISO('2022-06-23T07:27:00') },
		];

		const filter = new Filter();
		const sorter = filter.sortItems('asc');

		items.sort(sorter);

		expect(items[0].item).toBe('3');
		expect(items[1].item).toBe('1');
		expect(items[2].item).toBe('2');
	});

	test('sort descending', () => {
		const items = [
			{ item: '1', itemDate: DateTime.fromISO('2022-06-23T08:27:00') },
			{ item: '2', itemDate: DateTime.fromISO('2022-06-23T09:27:00') },
			{ item: '3', itemDate: DateTime.fromISO('2022-06-23T07:27:00') },
		];

		const filter = new Filter();
		const sorter = filter.sortItems('desc');

		items.sort(sorter);

		expect(items[0].item).toBe('2');
		expect(items[1].item).toBe('1');
		expect(items[2].item).toBe('3');
	});

	test('should filter first', () => {
		const filter = new Filter();

		const items = [
			'item2022-06-23T01:30:00.txt',
			'item2022-06-23T02:30:00.txt',
			'item2022-06-23T03:30:00.txt',
			'item2022-06-24_1.txt',
		];

		const newItems = filter.apply({ exceptFirst: 'day'}, items);
		expect(newItems).toHaveLength(2);
		expect(newItems).toContain('item2022-06-23T01:30:00.txt');
	});

	test('should filter last', () => {
		const filter = new Filter();

		const items = [
			'item2022-06-23T01:30:00.txt',
			'item2022-06-23T02:30:00.txt',
			'item2022-06-23T03:30:00.txt',
			'item2022-06-24_1.txt',
		];

		const newItems = filter.apply({ debug: true, exceptLast: 'day'}, items);
		expect(newItems).toHaveLength(2);
		expect(newItems).toContain('item2022-06-23T03:30:00.txt');
	});

});
