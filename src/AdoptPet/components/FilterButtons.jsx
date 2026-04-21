

export default function FilterButtons({ text, isActive, action }) {
    return (
        <button
            onClick={action}
            className={`border rounded-full px-4 py-2 text-sm font-semibold cursor-pointer
            transition-all duration-200 ${isActive ? "bg-green-600 text-white border-transparent" : "text-black bg-white border-green-400"}
            `}
        >
            {text}
        </button>
    );
}