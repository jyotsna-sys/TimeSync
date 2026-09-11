export async function getFreeSlots(groupId){
    const response = await fetch("/api/free-slots?groupId=" + groupId);
    const data = await response.json();

    if(!response.ok){
        throw new Error(data.error || "Could not load free slots");
    }

    return data;
}

export async function getHolidays(years){
    const response = await fetch("/api/holidays?years=" + years.join(","));
    const data = await response.json();

    if(!response.ok){
        throw new Error(data.error || "Could not load holidays");
    }

    return data;
}