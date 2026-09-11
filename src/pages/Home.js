import {Link} from "react-router-dom";

export default function Home(){
    return(
        <main className="page-shell">
            <section className="hero-card">
                <p className="small-label">GROUP AVAILABILITY</p>

                <h1>TimeSync</h1>

                <p className="hero-text">
                    Find the time when everyone in your group is free!
                </p>

                <div className="home-actions">
                    <Link to="/create" className="button primary">
                        Create a group
                    </Link>

                    <Link to="/join" className="button secondary">
                        Join a group
                    </Link>
                </div>
            </section>

            <section className="feature-grid">
                <div className="feature-card">
                    <div className="feature-icon">📅</div>
                    <h3>Enter your schedule</h3>
                    <p>
                        Mark the hours when you are busy.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">👥</div>
                    <h3>Sync the group</h3>
                    <p>
                        Combine everyone's timetable automatically.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">⭐</div>
                    <h3>Find the best slots</h3>
                    <p>
                        See the longest common free periods first.
                    </p>
                </div>
            </section>
        </main>
    );
}