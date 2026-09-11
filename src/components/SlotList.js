import {formatRange, formatDuration} from "../utils/time";

export default function SlotList({slots}){
    return(
        <div className="slot-list">
            {slots.map((slot,index)=>(
                <div className="slot-card" key={index}>
                    <h3>{slot.day}</h3>
                    <p>{formatRange(slot.start,slot.end)}</p>
                    <span>{formatDuration(slot.duration)}</span>
                    </div>
            ))}
            </div>
    );
}