export default function Navbar() {
  return (
    <header className="cc-navbar">
      <div className="cc-brand">
        <div className="cc-logo">
          <img
            src="/companioncarelogo.png"
            alt="CompanionCare logo"
            className="cc-logo-img"
          />
        </div>
        <div className="cc-brand-text">CompanionCare</div>
      </div>

      <nav className="cc-nav-links">
        <button type="button" className="nav-link">Dashboard</button>
        <button type="button" className="nav-link active">My Pet</button>
        <button type="button" className="nav-link">History</button>
        <button type="button" className="nav-link">Community</button>
        <button type="button" className="nav-link">Profile</button>
      </nav>
    </header>
  );
}