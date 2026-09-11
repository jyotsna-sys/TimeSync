import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function CreateGroup(){
    const [name,setName] = useState("");
    const [groupName,setGroupName] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setError("");

        try{
            const response = await fetch("/api/groups",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    groupName
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || "Could not create group");
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
                <p className="small-label">NEW GROUP</p>

                <h1>Create a group</h1>

                <p>
                    Start a group and share the code with your friends.
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
                        Group name

                        <input
                            value={groupName}
                            onChange={(event) => setGroupName(event.target.value)}
                            placeholder="Enter a group name"
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
                        Create group
                    </button>
                </form>
            </section>
        </main>
    );
}