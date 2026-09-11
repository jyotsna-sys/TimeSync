export const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
export const START_HOUR=8;
export const END_HOUR=22;

export function formatHour(hour){
    const suffix= hour>=12?"PM":"AM";
    const display = hour%12 || 12;
    return display + ":00 " + suffix;
}

export function formatRange(start, end){
    return formatHour(start)+"-"+formatHour(end);
}

export function formatDuration(hours){
    if(Number.isInteger(hours)) return hours+" h";
    return hours.toFixed(1)+" h";
}