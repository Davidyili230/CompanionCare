export default function PetCard({ pet, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(pet.id)}
      className={`flex w-23 flex-col items-center rounded-2xl border p-3 text-center transition-colors duration-200 ${
        selected
          ? "border-[#de7e52] bg-white"
          : "border-[#de7e52] bg-white hover:bg-[#fcf5ef]"
      }`}
    >
      <div className="mb-3 flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
        <img
          src={pet.image || "/default-pet.png"}
          alt={pet.name}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="text-[14px] font-bold leading-tight text-[#1f1f1f]">
        {pet.name}
      </p>

      <p className="mt-1 text-[12px] leading-tight text-[#4f4f4f]">
        {pet.species}, {pet.breed || "unknown"}
      </p>
    </button>
  );
}