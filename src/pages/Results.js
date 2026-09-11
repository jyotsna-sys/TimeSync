import {useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import SlotList from "../components/SlotList";
import {DAYS,formatRange} from "../utils/time";

export default function Results(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [group,setGroup] = useState(null);
    const [timetables,setTimetables] = useState([]);
    const [slots,setSlots] = useState([]);
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        async function loadResults(){
            try{
                const groupResponse = await fetch(
                    "/api/groups?groupId=" + id
                );

                const groupData = await groupResponse.json();

                if(!groupResponse.ok){
                    throw new Error(
                        groupData.error || "Could not load group"
                    );
                }

                setGroup(groupData);

                const timetableResponse = await fetch(
                    "/api/timetables?groupId=" + id
                );

                const timetableData = await timetableResponse.json();

                if(!timetableResponse.ok){
                    throw new Error(
                        timetableData.error ||
                        "Could not load group schedules"
                    );
                }

                setTimetables(timetableData.timetables || []);

                const slotsResponse = await fetch(
                    "/api/free-slots?groupId=" + id
                );

                const slotsData = await slotsResponse.json();

                if(!slotsResponse.ok){
                    throw new Error(
                        slotsData.error ||
                        "Could not calculate free slots"
                    );
                }

                setSlots(slotsData.slots || []);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }

        loadResults();
    },[id]);

    function getMemberSlots(timetable,day){
        return timetable.busySlots.filter(
            (slot) => slot.day === day
        );
    }

    if(loading){
        return <p className="page-shell">Loading group schedule...</p>;
    }

    return(
        <main className="page-shell">
            <button
                className="home-button"
                onClick={() => navigate("/")}
            >
                ← Back to Home
            </button>

            <section className="form-card">
                <p className="small-label">GROUP SCHEDULE</p>

                <h1>{group?.name}</h1>

                <p>
                    See when each member is busy and find the best
                    common free time.
                </p>

                {error && (
                    <p className="error-text">{error}</p>
                )}

                {!error && (
                    <>
                        <div className="member-list">
                            {timetables.map((timetable) => (
                                <div
                                    className="member-card"
                                    key={timetable.memberId}
                                >
                                    <h3>{timetable.name}</h3>

                                    {DAYS.map((day) => {
                                        const daySlots =
                                            getMemberSlots(
                                                timetable,
                                                day
                                            );

                                        if(daySlots.length === 0){
                                            return null;
                                        }

                                        return (
                                            <div
                                                className="member-day"
                                                key={day}
                                            >
                                                <strong>{day}</strong>

                                                {daySlots.map(
                                                    (slot,index) => (
                                                        <span
                                                            key={index}
                                                            className="busy-tag"
                                                        >
                                                            {formatRange(
                                                                slot.start,
                                                                slot.end
                                                            )}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}

                                    {timetable.busySlots.length === 0 && (
                                        <p>
                                            No busy hours selected yet.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="results-section">
                            <p className="small-label">
                                COMMON FREE TIME
                            </p>

                            <h2>Best suitable slots</h2>

                            <p>
                                These are the times when everyone in
                                the group is free.
                            </p>

                            {slots.length === 0 && (
                                <p>
                                    No common free time found.
                                </p>
                            )}

                            {slots.length > 0 && (
                                <SlotList slots={slots}/>
                            )}
                        </div>

                        <div className="home-actions">
                            <button
                                className="button secondary"
                                onClick={() =>
                                    navigate(
                                        "/group/" +
                                        id +
                                        "/schedule"
                                    )
                                }
                            >
                                Edit my schedule
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}