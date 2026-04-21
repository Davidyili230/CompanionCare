
import { useState } from "react";

export default function Pagination({ ReportList }) {
    const [currentPage, setCurrentpage] = useState(1);
    const REPORTS_PER_PAGE = 15;
    const totalPages = Math.ceil(ReportList.length / REPORTS_PER_PAGE)


    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }

    return (
        <div className="flex flex-row justify-center items-center space-x-4 my-5">
            <button 
                onClick={prevPage}
                className="border rounded-xl px-4 py-2 font-bold text-white text-sm bg-red-600
                transition-all duration-300 ease-in-out cursor-pointer hover:bg-red-700
                disabled:cursor-not-allowed disabled:bg-red-300"
                disabled={currentPage == 1}
            >
                Prev
            </button>
            <span className="font-semibold text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button 
                onClick={nextPage}
                className="border rounded-xl px-4 py-2 font-bold text-white text-sm bg-red-600
                transition-all duration-300 ease-in-out cursor-pointer hover:bg-red-700
                disabled:cursor-not-allowed disabled:bg-red-300"
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
        </div>
    )
}