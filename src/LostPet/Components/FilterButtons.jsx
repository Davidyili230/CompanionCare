

export default function FilterButton({ text, stateVar, action}) {
    return (
        <button
            className={`border rounded-xl px-2.5 py-1.25 text-xs transition-all duration-300 ease-in-out
            hover:scale-[1.02] hover:shadow-md ${stateVar === text ? "bg-[#efc3c3]" : "bg-white"}`}
            onClick={action}
        >
            {text}
        </button>
    )
}