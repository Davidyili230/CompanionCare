export default function AddPetEmptyCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-33 w-23 flex-col items-center justify-center rounded-2xl border border-[#de7e52] bg-white text-center transition-colors duration-200 hover:bg-[#fcf5ef]"
    >
      <div className="flex h-13 w-13 items-center justify-center rounded-full border border-[#9a9a9a] bg-[#f2f2f2] text-xl text-[#d87c5a]">
        +
      </div>
      <span className="mt-3 text-[16px] font-semibold text-[#1f1f1f]">
        Add Pet
      </span>
    </button>
  );
}