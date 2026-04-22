

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  AdoptablePets from "./AdoptablePets.json"

import Pagination from "./components/Pagination";
import FilterButtons from "./components/FilterButtons";
import AdoptPetCard from "./components/AdoptPetCard";

function FilterDisplay({ setStateFilter, stateFilter, setSpeciesFilter, speciesFilter }) {
    return (
        <div className="border-t border-gray-300 bg-[#f8f5f0] px-4 py-4 space-y-3">
            <div>
                <p className="text-sm font-bold mb-2"> Species </p>
                <div className="flex flex-row flex-wrap gap-2">
                    {
                        ["All", "Dog", "Cat"].map((species, idx) => (
                            <FilterButtons 
                                key={idx}
                                text={species} 
                                stateVar = {speciesFilter} 
                                action={() => setSpeciesFilter(species)} 
                            />
                        ))
                    }
                </div>
            </div>
            
            <div className="border border-gray-300"/>

            <div>
                <p className="text-sm font-bold mb-2"> State</p>
                <div className="flex flex-row flex-wrap gap-2">
                    {
                        ["All States", "NY", "NJ"].map((state, idx) => (
                            <FilterButtons 
                                key={idx} 
                                text={state}
                                stateVar={stateFilter}
                                action={() => setStateFilter(state)}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

function SearchFilterBar({ setSearchQuery, searchQuery, setSpeciesFilter, speciesFilter, setStateFilter, stateFilter }) {
    const [currentQuery, setCurrentQuery] = useState(searchQuery)
    const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);
    const isFilterActive = (speciesFilter !== "All") || (stateFilter !== "All States")

    const handleQueryChange = (e) => {
        setCurrentQuery(e.target.value);
    }

    const handleSubmitQuery = (e) => {
        e.preventDefault();
        setSearchQuery(currentQuery);
    }

    const handleRemoveFilters = () => {
        setSpeciesFilter("All");
        setStateFilter("All States");
    }

    const navigate = useNavigate();
    const handleNavigation = () => {
        console.log("User is taken to a new view")
    }

    return (
        <div className="border rounded-2xl bg-white shadow-md overflow-hidden">
            <div className="flex flex-row items-center px-4 py-2 gap-2">
                <form
                    onSubmit={handleSubmitQuery}
                    className="border rounded-xl px-4 py-2 min-w-45 flex-1 flex flex-row"
                >
                    <span
                        className="mr-3 cursor-pointer"
                        onClick={handleSubmitQuery}
                    >
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={currentQuery}
                        onChange={handleQueryChange}
                        className="text-sm cursor-pointer flex-1 w-full outline-none"
                    />
                </form>

                <div className="border border-gray-400 h-10"/>

                <div>
                    <button
                        onClick={handleNavigation}
                        className="border rounded-xl px-3 py-1.5 text-sm font-bold cursor-pointer bg-green-300
                        hover:bg-green-400"
                    >
                        🐾 Put Pet for Adoption
                    </button>
                </div>

                <div className="border border-gray-400 h-10"/>

                <button 
                    onClick={() => setIsFilterDisplayed(!isFilterDisplayed)}
                    className={`border rounded-xl px-3 py-1.5 text-sm font-semibold cursor-pointer transition-al duration-200 hover:shadow-md
                        ${isFilterDisplayed 
                            ? "text-green-500 border-green-500" 
                            : "text-black border-black hover:text-green-400 hover:border-green-500"
                        }`}
                >
                    More Filters
                </button>

                {isFilterActive && 
                    <button
                        onClick={handleRemoveFilters}
                        className="border rounded-xl px-3 py-1.5 text-sm font-semibold cursor-pointer
                        transition-al duration-200 hover:shadow-md"
                    >
                        Clear
                    </button>
                }
            </div>
            
            {isFilterDisplayed && 
                <FilterDisplay 
                    setStateFilter={setStateFilter} 
                    stateFilter={stateFilter}
                    setSpeciesFilter={setSpeciesFilter}
                    speciesFilter={speciesFilter}
                />}
        </div>
    );
}

function getFilteredReport(reportList, searchQuery, speciesFilter, stateFilter) {
    return reportList.filter((report) => {
        const query = (searchQuery || "").toLowerCase();
        const species = (speciesFilter || "All").toLowerCase();
        const state = (stateFilter || "All States").toLowerCase();

        const matchesQuery = query === "" || report.name.toLowerCase().includes(query);
        const matchesSpecies = species === "all" || report.species.toLowerCase() === species;
        const matchesState = state === "all states" || report.state.toLowerCase() === state;

        return matchesQuery && matchesSpecies && matchesState
    });
}

function UserView({ isCurrentTabAllReports }) {
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("All");
    const [stateFilter, setStateFilter] = useState("All States");
    
    const [currentPage, setCurrentpage] = useState(1);

    useEffect(() => {
        // async function loadReports() {
        //     const data = await getUserReport();
        //     setReports(data);
        // }

        // loadReports();

        if (isCurrentTabAllReports) {
            setReports(reports.concat(AdoptablePets))
        } else {
            setReports([])
        }


    }, [isCurrentTabAllReports])

    const filteredReports = getFilteredReport(reports, searchQuery, speciesFilter, stateFilter);
    const displayedReports = filteredReports.map((report, idx) => (
        <AdoptPetCard
            key={report.id}
            reportData={report}
            isUserDisplay={isCurrentTabAllReports !== true}
        />
    ))

    const REPORTS_PER_PAGE = 20;
    const totalPages = Math.ceil(displayedReports.length / REPORTS_PER_PAGE);

    return (
        <div
            className="bg-[FFF9F0] min-h screen pb-12.5 pt-5 flex
            flex-col gap-5"
        >

            <div className="flex-1">
                <SearchFilterBar
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    setSpeciesFilter={setSpeciesFilter}
                    speciesFilter={speciesFilter}
                    setStateFilter={setStateFilter}
                    stateFilter={stateFilter}
                />
                <Pagination setCurrentPage={setCurrentpage} currentPage={currentPage} totalPages={totalPages}/>
                
                {
                    totalPages > 0 ? (
                        <div className="grid grid-cols-4 gap-6 mt-8">
                            {displayedReports.slice((currentPage-1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE)}
                        </div>
                    ) : (
                        <div>
                            Fall back display
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default function AdoptPet() {
    const [currentActiveTab, setCurrentActiveTab] = useState("All Reports");

    return (
        <div className="mt-5 px-7">
            <div className="flex flex-row font-bold text-lg gap-7 my-5 border-b border-gray-500">
                {
                    ["All Reports", "User Reports"].map((tabName, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentActiveTab(tabName)}
                            className={`cursor-pointer w${currentActiveTab === tabName ? "border-b-2 border-red-600 text-red-600" : "text-black"}`}
                        >
                            {tabName}
                        </div>
                    ))
                }
            </div>

            <UserView isCurrentTabAllReports={currentActiveTab === "All Reports"}/>
        </div>
    )
}
