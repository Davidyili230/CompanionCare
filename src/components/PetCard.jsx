export default function PetCard({ pet, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(pet.id)}
      className="flex w-23 flex-col items-center rounded-2xl border border-[#de7e52] bg-white p-3 text-center transition-colors duration-200 hover:bg-[#fcf5ef]"
    >
      <div className="mb-3 flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
        {pet.image ? (
          <img
            src={pet.image}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[18px] font-semibold text-[#d87c5a]">
            {pet.name?.[0]?.toUpperCase() || "P"}
          </span>
        )}
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