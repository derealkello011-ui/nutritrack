export const startOfDay = (date: Date): Date =>
    new Date( date.getFullYear(), date.getMonth(), date.getDate() );

export const addDays = (date: Date, days: number): Date =>
    new Date( date.getFullYear(), date.getMonth(), date.getDate() + days );

export const isSameCalendarDate = (first: Date, second: Date): boolean =>
    first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();

export const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String( date.getMonth() + 1 ).padStart( 2, '0' );
    const day = String( date.getDate() ).padStart( 2, '0' );

    return `${ year }-${ month }-${ day }`;
};

export const dateFromKey = (key: string): Date | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec( key );
    if ( !match ) return null;

    const [, year, month, day] = match;
    const date = new Date( Number( year ), Number( month ) - 1, Number( day ) );

    return date.getFullYear() === Number( year )
        && date.getMonth() === Number( month ) - 1
        && date.getDate() === Number( day )
        ? date
        : null;
};

export const formatDateLabel = (date: Date, today = new Date()): string => {
    if ( isSameCalendarDate( date, today ) ) return 'Today';

    const yesterday = addDays( today, -1 );
    if ( isSameCalendarDate( date, yesterday ) ) return 'Yesterday';

    const tomorrow = addDays( today, 1 );
    if ( isSameCalendarDate( date, tomorrow ) ) return 'Tomorrow';

    return date.toLocaleDateString( 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
    } );
};
