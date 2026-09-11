import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";

export default function App(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateGroup />} />
            <Route path="/join" element={<JoinGroup />} />
            <Route path="/group/:id/schedule" element={<Schedule />} />
            <Route path="/group/:id/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    );
}