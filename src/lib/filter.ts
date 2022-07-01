import Debug from 'debug';
import type { Params, ExceptFilter, BucketItem, RotateItem } from '../types';
import { dateService } from './services/DateService';
import { enableDebug } from './enableDebug';

/**
 * Filters apply after an item set is found and can exclude values based on the whole set
 */
export class Filter {
	debug = Debug('rotatelib:Filter');

	apply(params: Partial<Params>, items: (RotateItem)[]) {
		enableDebug(params);

		if (!('exceptFirst' in params) && !('exceptLast' in params)) {
			this.debug('No filters in params, just returning items');
			return items;
		}

		if (params.exceptFirst) {
			return this.applyExceptFirst(items, params.exceptFirst);
		}
		if (params.exceptLast) {
			return this.applyExceptLast(items, params.exceptLast);
		}

		this.debug('Applied no filters, just returning items');
		return items;
	}

	applyExceptFirst(items: (RotateItem)[], exception: ExceptFilter) {
		this.debug('applyExceptFirst starting');
		const newItems: (RotateItem)[] = [];
		const bucketedItems = this.sortItemsIntoBuckets(items, exception);
		this.debug('bucketedItems', bucketedItems.size);

		for (const bucket of bucketedItems.keys()) {
			const itemsInBucket = bucketedItems.get(bucket) ?? [];
			this.debug('Items in bucket', bucket, itemsInBucket);
			if (itemsInBucket.length === 1) {
				newItems.push(itemsInBucket[0].item);
			}
			else if (itemsInBucket.length > 1) {
				itemsInBucket.sort(this.sortItems('asc'));
				this.debug('sorted', itemsInBucket);
				newItems.push(itemsInBucket[0].item);
			}
		}

		return newItems;
	}

	applyExceptLast(items: (RotateItem)[], exception: ExceptFilter) {
		this.debug('applyExceptLast starting');
		const newItems: (RotateItem)[] = [];
		const bucketedItems = this.sortItemsIntoBuckets(items, exception);

		for (const bucket of bucketedItems.keys()) {
			const itemsInBucket = bucketedItems.get(bucket) ?? [];
			this.debug('Items in bucket', bucket, itemsInBucket);
			if (itemsInBucket.length === 1) {
				newItems.push(itemsInBucket[0].item);
			}
			else if (itemsInBucket.length > 1) {
				itemsInBucket.sort(this.sortItems('desc'));
				this.debug('sorted last', itemsInBucket);
				newItems.push(itemsInBucket[0].item);
			}
		}

		return newItems;
	}

	/**
   * Sort items by date
   */
	sortItems(direction: 'desc'|'asc' = 'asc') {
		const lessThanValue = direction === 'asc' ? -1 : 1;
		const greaterThanValue = direction === 'asc' ? 1 : -1;
		return (a: BucketItem, b: BucketItem) => {
			this.debug(a.itemDate.toISO(), b.itemDate.toISO());
			if (a.itemDate < b.itemDate) {
				return lessThanValue;
			}
			if (a.itemDate > b.itemDate) {
				return greaterThanValue;
			}
			return 0;
		};
	}

	/**
   * Place items in a bucket by date
   *
   * Depending on the filter value (day/month) the buckets will either be
   * the date up to the month or day. We can then sort items in those buckets.
   */
	sortItemsIntoBuckets(items: (RotateItem)[], exception: ExceptFilter) {
		const sortItems = new Map<string, BucketItem[]>();

		items.forEach((item) => {
			const date = dateService.parseDate(typeof item !== 'string' ? item.toString() : item);
			if (!date) {
				this.debug('No date found on item, filtering it out', item);
				return;
			}
			const bucketDate = exception === 'day' ? date.toISODate() : date.toFormat('YYYY-MM');

			const bucketItems = sortItems.get(bucketDate) ?? [];
			bucketItems.push({
				item,
				itemDate: date
			});
			sortItems.set(bucketDate, bucketItems);
		});
		return sortItems;
	}
}
