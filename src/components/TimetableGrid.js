import {DAYS, START_HOUR, END_HOUR, formatHour} from "../utils/time";

export default function TimetableGrid({busySlots,onChange}) {
  function isBusy(day,hour) {
    return busySlots.some(
      (slot) => slot.day === day && slot.start <= hour && slot.end > hour
    );
  }

  function toggleSlot(day,hour) {
    const alreadyBusy = isBusy(day,hour);

    if (alreadyBusy) {
      onChange(
        busySlots.filter(
          (slot) => !(slot.day === day && slot.start === hour)
        )
      );
    } else {
      onChange([...busySlots,{day,start:hour,end:hour + 1}]);
    }
  }

  return (
    <div className="timetable">
      <div className="timetable-header">
        <div></div>
        {DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {Array.from({length: END_HOUR - START_HOUR},(_,index) => {
        const hour = START_HOUR + index;
        return (
          <div className="timetable-row" key={hour}>
            <div className="time-label">{formatHour(hour)}</div>
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                className={isBusy(day,hour) ? "time-cell busy" : "time-cell"}
                onClick={() => toggleSlot(day,hour)}
              ></button>
            ))}
          </div>
        );
      })}
    </div>
  );
}