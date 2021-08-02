export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

/**
 * @param {Date} videoDate 
 * @returns the full month name of a Date object as a String
 * ex: "April"
 */
 export function getMonthName(videoDate) {
    const monthName = months[videoDate.getMonth()];
    return monthName;
};

/**
 * @param {Date} videoDate 
 * @returns the full weekday name of a Date object as a String
 * ex: "Monday"
 */
export function getWeekdayName(videoDate) {
    const dayName = days[videoDate.getDay()];
    return dayName;
};

/**
 * @param {Date} videoDate 
 * @returns the full formatted name of a Date object as a String
 * ex: "Thursday July 1, 2021"
 */
export function getFormattedDate(videoDate) {
    return `${getWeekdayName(videoDate)} ${getMonthName(videoDate)} ${videoDate.getDate()}, ${videoDate.getFullYear()}`;
};
