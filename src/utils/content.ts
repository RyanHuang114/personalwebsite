interface DatedEntry {
	id: string;
	data: {
		date: Date;
	};
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
});

/** Newest first, with the stable filename ID as a deterministic tie-breaker. */
export function byDateDescending<T extends DatedEntry>(a: T, b: T): number {
	return b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id);
}

export function formatDate(date: Date): string {
	return dateFormatter.format(date);
}

export function formatDateAttribute(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/**
 * Sequential IDs are intentionally enforced instead of renumbered. Add the
 * next available three-digit number when creating an entry.
 */
export function assertSequentialId(collection: string, id: string): void {
	if (!/^\d{3}$/.test(id)) {
		throw new Error(
			`Invalid ${collection} filename "${id}.md". Use a stable three-digit filename such as 001.md.`,
		);
	}
}
