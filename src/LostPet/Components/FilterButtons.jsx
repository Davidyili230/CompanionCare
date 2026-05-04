

export default function FilterButton({ text, stateVar, action }) {
    return (
        <button
            className={`border rounded-xl px-3.5 py-1.5 text-xs transition-all duration-300 cursor-pointer
            ${stateVar === text 
                ? "border-green-600 bg-green-500 text-white font-bold" 
                : "bg-white border-[#f1caca] text-black hover:bg-green-100 hover:border-green-200 hover:shadow-md "
            }`}
            onClick={action}
        >
            {text}
        </button>
    );
}