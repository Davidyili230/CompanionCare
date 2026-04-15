export default function AddPetEmptyCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-h-[210px] flex-col items-center justify-center rounded-[22px] border border-[#de7e52] bg-white px-4 py-4 text-center transition-all duration-200 hover:bg-[#fcf5ef]"
    >
      <div className="mb-4 flex h-[74px] w-[74px] items-center justify-center rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
        <span className="text-[28px] font-medium leading-none text-[#d87c5a]">
          +
        </span>
      </div>

      <p className="text-center text-[16px] font-bold leading-tight text-[#1f1f1f]">
        Add Pet
      </p>
    </button>
  );
}