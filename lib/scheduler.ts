export type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

export type Slot = {
    day: string;
    start: number;
    end: number;
};

export type RankedSlot = Slot & {
    duration: number;
};

const DAYS: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const ACTIVE_START = 8;
const ACTIVE_END = 22;

function mergeIntervals(intervals: Array<[number,number]>) {
    if(intervals.length === 0) return [];

    const sorted = [...intervals].sort(
        (a,b) => a[0] - b[0] || a[1] - b[1]
    );

    const merged = [sorted[0]];

    for(let i = 1; i < sorted.length; i++){
        const current = sorted[i];
        const last = merged[merged.length - 1];

        if(current[0] <= last[1]){
            last[1] = Math.max(last[1],current[1]);
        }else{
            merged.push([...current]);
        }
    }

    return merged;
}

function invertIntervals(merged: Array<[number,number]>) {
    const free = [];
    let cursor = ACTIVE_START;

    for(const [start,end] of merged){
        if(start > cursor){
            free.push([cursor,start]);
        }

        cursor = Math.max(cursor,end);
    }

    if(cursor < ACTIVE_END){
        free.push([cursor,ACTIVE_END]);
    }

    return free;
}

export function findRankedFreeSlots(allBusySlots: Slot[][]) {
    const flattened = allBusySlots.flat();
    const result = [];

    for(const day of DAYS){
        const intervals = flattened
            .filter((slot) => slot.day === day)
            .map((slot) => [
                Math.max(ACTIVE_START,slot.start),
                Math.min(ACTIVE_END,slot.end)
            ])
            .filter(([start,end]) => end > start);

        const merged = mergeIntervals(intervals);
        const free = invertIntervals(merged);

        for(const [start,end] of free){
            result.push({
                day,
                start,
                end,
                duration: end - start
            });
        }
    }

    return result.sort(
        (a,b) =>
            b.duration - a.duration ||
            DAYS.indexOf(a.day as Day) - DAYS.indexOf(b.day as Day) ||
            a.start - b.start
    );
}

export {ACTIVE_START,ACTIVE_END,DAYS};