import {useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import TimetableGrid from "../components/TimetableGrid";
import {getSession} from "../utils/session";

export default function Schedule(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [busySlots,setBusySlots] = useState([]);
    const [name,setName] = useState("");
    const [groupName,setGroupName] = useState("");
    const [joinCode,setJoinCode] = useState("");
    const [message,setMessage] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        async function loadSchedule(){
            try{
                const session = getSession();

                if(!session || session.groupId !== id){
                    navigate("/");
                    return;
                }

                setName(session.name);

                const groupResponse = await fetch(
                    "/api/groups?groupId=" + id
                );

                const groupData = await groupResponse.json();

                if(!groupResponse.ok){
                    throw new Error(
                        groupData.error || "Could not load group"
                    );
                }

                setGroupName(groupData.name);
                setJoinCode(groupData.joinCode);

                const response = await fetch(
                    "/api/timetables?groupId=" +
                    id +
                    "&memberId=" +
                    session.memberId
                );

                const data = await response.json();

                if(!response.ok){
                    throw new Error(
                        data.error || "Could not load schedule"
                    );
                }

                setBusySlots(data.busySlots || []);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }

        loadSchedule();
    },[id,navigate]);

    async function handleSave(){
        setMessage("");
        setError("");

        try{
            const session = getSession();

            const response = await fetch("/api/timetables",{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    groupId:id,
                    memberId:session.memberId,
                    name,
                    busySlots
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(
                    data.error || "Could not save schedule"
                );
            }

            setMessage("Schedule saved successfully");
        }catch(err){
            setError(err.message);
        }
    }

    async function copyCode(){
        await navigator.clipboard.writeText(joinCode);
        setMessage("Group code copied!");
    }

    async function shareCode(){
        const text =
            "Join my TimeSync group \"" +
            groupName +
            "\" using code: " +
            joinCode;

        if(navigator.share){
            await navigator.share({
                title:"Join my TimeSync group",
                text
            });
        }else{
            await navigator.clipboard.writeText(text);
            setMessage("Invite copied!");
        }
    }

    if(loading){
        return <p className="page-shell">Loading schedule...</p>;
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
                <p className="small-label">YOUR SCHEDULE</p>

                <h1>Mark when you are busy</h1>

                <p>
                    Click the hours when you are unavailable.
                </p>

                <div className="group-code-card">
                    <p className="small-label">GROUP CODE</p>

                    <h2>{joinCode}</h2>

                    <p>
                        Share this code with your friends so they can join
                        <strong> {groupName}</strong>.
                    </p>

                    <div className="home-actions">
                        <button
                            className="button primary"
                            onClick={copyCode}
                        >
                            Copy code
                        </button>

                        <button
                            className="button secondary"
                            onClick={shareCode}
                        >
                            Share code
                        </button>
                    </div>
                </div>

                <TimetableGrid
                    busySlots={busySlots}
                    onChange={setBusySlots}
                />

                {message && (
                    <p className="success-text">{message}</p>
                )}

                {error && (
                    <p className="error-text">{error}</p>
                )}

                <div className="home-actions">
                    <button
                        className="button primary"
                        onClick={handleSave}
                    >
                        Save schedule
                    </button>

                    <button
                        className="button secondary"
                        onClick={() =>
                            navigate("/group/" + id + "/results")
                        }
                    >
                        View group schedule
                    </button>
                </div>
            </section>
        </main>
    );
}