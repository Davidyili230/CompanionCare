export default function AddPetEmptyCard({ onClick }) {
  return (
    <button
      type="button"
      className="pet-card pet-card-empty"
      onClick={onClick}
      aria-label="Add Pet"
    >
      <div className="pet-avatar-wrap pet-avatar-empty">
        <span className="pet-plus">+</span>
      </div>
      <div className="pet-name">ADD Pet</div>
    </button>
  );
}