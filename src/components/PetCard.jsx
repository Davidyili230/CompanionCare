export default function PetCard({ pet, selected, onClick }) {
  return (
    <button
      type="button"
      className={`pet-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(pet.id)}
    >
      <div className="pet-avatar-wrap">
        <img src={pet.image} alt={pet.name} className="pet-avatar" />
      </div>
      <div className="pet-name">{pet.name}</div>
      <div className="pet-meta">
        {pet.species}, {pet.breed}
      </div>
    </button>
  );
}