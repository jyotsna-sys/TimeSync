export function saveSession(session){
    localStorage.setItem("timesync-member",JSON.stringify(session));
}

export function getSession(){
    const saved=localStorage.getItem("timesync-member");
    if(!saved) return null;
    return JSON.parse(saved);
}