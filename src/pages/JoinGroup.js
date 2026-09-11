import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function JoinGroup(){
    const [name,setName] = useState("");
    const [joinCode,setJoinCode] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setError("");

        try{
            const response = await fetch("/api/groups/join",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    joinCode
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || "Could not join group");
            }

            localStorage.setItem(
                "timesync-member",
                JSON.stringify({
                    memberId:data.memberId,
                    groupId:data.groupId,
                    name,
                    joinCode:data.joinCode
                })
            );

            navigate("/group/" + data.groupId + "/schedule");
        }catch(err){
            setError(err.message);
        }
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
                <p className="small-label">JOIN GROUP</p>

                <h1>Join a group</h1>

                <p>
                    Enter your name and the code shared by your friend.
                </p>

                <form onSubmit={handleSubmit}>
                    <label>
                        Your name

                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </label>

                    <label>
                        Join code

                        <input
                            value={joinCode}
                            onChange={(event) => setJoinCode(event.target.value)}
                            placeholder="Enter the group code"
                            required
                        />
                    </label>

                    {error && (
                        <p className="error-text">{error}</p>
                    )}

                    <button
                        className="button primary"
                        type="submit"
                    >
                        Join group
                    </button>
                </form>
            </section>
        </main>
    );
}