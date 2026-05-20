
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { getAllUserReports, getUserReport } from "./databaseAccess/GetReport";
import { deleteReport } from "./databaseAccess/DeleteReport";

import MissingPetCard from "./Components/MissingPetCard";
import Pagination from "./Components/Pagination";
import FilterButton from "./Components/FilterButtons";


function SearchBar({ searchQuery, setSearchQuery }) {
    const [currentQuery, setCurrentQuery] = useState(searchQuery);

    const handleQueryChange = (e) => {
        setCurrentQuery(e.target.value);
    }

    const handleSearchQueryChange = (e) => {
        e.preventDefault();
        setSearchQuery(currentQuery)
    }

    return (
        <div className="bg-white shadow-lg rounded-3xl px-4 py-2">
            <form
                onSubmit={handleSearchQueryChange}
                className="flex flex-row items-center"
            >
                <span 
                    className="mr-4 cursor-pointer"
                    onClick={handleSearchQueryChange}
                >
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="Search by Pet Name or Breed"
                    value={currentQuery}
                    onChange={handleQueryChange}
                    className="text-sm w-full outline-0" 
                />
            </form>
        </div>
    )
}

function FilterDisplay({ setIsFilterDisplayed, setSpeciesFilter, speciesFilter, setBreedFilter, breedFilter}) {
    const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState(speciesFilter);
    const [selectedBreedFilter, setSelectedBreedFilter] = useState(breedFilter);

    const dogBreedList = [
        "All", "Labrador Retriever", "Golden Retriever", "French Bulldog", "German Shepherd", "Poodle",
        "Bulldog", "Beagle", "Rottweiler", "Dachshund","Yorkshire Terrier"
    ]

    const catBreedList = [
        "All", "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
        "Bengal", "Sphynx", "Scottish Fold", "Abyssinian", "Russian Blue"
    ]

    let displayedBreedList = []
    if(selectedSpeciesFilter === "All") displayedBreedList = dogBreedList.concat(catBreedList.filter(breed => !dogBreedList.includes(breed)))
    else if(selectedSpeciesFilter === "Dog") displayedBreedList = dogBreedList
    else displayedBreedList = catBreedList

    const handleApplyFilters = () => {
        setSpeciesFilter(selectedSpeciesFilter);
        setBreedFilter(selectedBreedFilter);
        setIsFilterDisplayed(false)
    }

    const handleResetFilters = () => {
        setSpeciesFilter("All");
        setBreedFilter("All");
        setIsFilterDisplayed(false)
    }

    const handleSelectedSpeciesChange = (species) => {
        if(selectedSpeciesFilter !== species && species != "All") {
            setSelectedBreedFilter("All")
        }

        setSelectedSpeciesFilter(species);
    }

    return (
        <div className="flex flex-col gap-4 border-t border-gray-300 mx-4 pb-4">
            <div className="pt-2">
                <p className="text-xs font-bold">Species</p>

                <div className="flex gap-1.5 mt-1.5">
                    {
                        ["All", "Dog", "Cat"].map((species, idx) => (
                            <FilterButton key={idx} text={species} stateVar={selectedSpeciesFilter} action={() => handleSelectedSpeciesChange(species)}/>
                        ))
                    }
                </div>
            </div>
            
            <div>
                <p className="text-xs font-bold">Breeds</p>

                <div className="mt-1.5 flex flex-wrap gap-1.5 overflow-y-auto max-h-50">
                    {
                        displayedBreedList.map((breed, idx) => (
                            <FilterButton key={idx} text={breed} stateVar={selectedBreedFilter} action={() => setSelectedBreedFilter(breed)}/>
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
                {
                    ["Reset All", "Apply Filters"].map((text, idx) => (
                        <button
                            key={idx}
                            className="border rounded-xl px-3.5 py-1.5 text-sm transition-all duration-300 cursor-pointer
                            hover:shadow-md border-[#7ce68c] hover:bg-green-100 hover:border-[#58da6c]"
                            onClick={text === "Apply Filters" ? handleApplyFilters : handleResetFilters}
                        >
                            {text}
                        </button>
                    ))
                }

            </div>
        </div>
    )
}

function SideBar({ handleNavigation, setSpeciesFilter, speciesFilter, setBreedFilter, breedFilter}) {
    const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);

    return (
        <div className="flex flex-col gap-5 w-full lg:w-64">
            <div className="bg-white text-xs p-4 rounded-3xl text-center shadow-md
            flex flex-col justify-center items-center">
                <p className="text-2xl">🐾</p>
                <p className="font-bold">Missing a Pet?</p>
                <p>
                    We are sorry to hear that you have lost your pet. We hope you
                    can be reunited with your companion soon.
                </p>

                <button
                    className="text-white bg-[#f39f0e] hover:bg-[#d7790d] rounded-full border-o px-5 py-2 
                    font-bold cursor-pointer transition-all duration-300 ease-in-out mt-3"
                    onClick={handleNavigation}
                >
                    + Create a Report
                </button>
            </div>
            <div className="bg-white rounded-3xl shadow-md">
                <button
                    className="flex flex-row justify-between w-full px-4 py-2 text-sm cursor-pointer"
                    onClick={() => setIsFilterDisplayed(!isFilterDisplayed)}
                >
                    <span>Filter</span>
                    <span className={`transition-transofmr duration-200 ${isFilterDisplayed ? "rotate-180" : "rotate-0"}`}> 
                        ↓ 
                    </span>
                </button>

                {isFilterDisplayed && 
                    <FilterDisplay 
                        setIsFilterDisplayed={setIsFilterDisplayed}
                        setSpeciesFilter={setSpeciesFilter} 
                        speciesFilter={speciesFilter}
                        setBreedFilter={setBreedFilter}
                        breedFilter={breedFilter}
                    />
                }
            </div>
        </div>
    )
}

function getFilteredReports(reportList, searchQuery, speciesFilter, breedFilter) {
    return reportList.filter((report) => {
        const query = (searchQuery || "").toLowerCase();
        const species = (speciesFilter || "All").toLowerCase();
        const breed = (breedFilter || "All").toLowerCase();

        const matchesQuery = 
            query === "" || 
            report.petName.toLowerCase().includes(query) ||
            report.breed.toLowerCase().includes(query);
        const matchesSpecies = species === "all" || report.petType.toLowerCase() === species;
        const matchesBreed = breed === "all" || report.breed.toLowerCase() === breed;
        
        return matchesQuery && matchesSpecies && matchesBreed;
    });
}

function UserView({ isCurrentTabAllReports }) {
    // stores the report to prevent spam usuage of api
    const [allUserReports, setAllUserReports] = useState([]);
    const [onlyUserReports, setOnlyUserReports] = useState([]);

    const [reports, setReports] = useState([]); // repots that will actually be displayed
    const [currentPage, setCurrentPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("All");
    const [breedFilter, setBreedFilter] = useState("All");

    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/LostPetReport");
    }

    const hasActiveFilters = 
        searchQuery !== ""
        speciesFilter !== "All" ||  
        breedFilter !== "All";

    const resetFilters = () => {
        setSearchQuery("");
        setSpeciesFilter("All");
        setBreedFilter("All");
    }
    
    // initial api call to get all reports
    // (All Reports view and User Reports View)
    useEffect(() => {
        async function loadReports() {
            const allData = await getAllUserReports();
            setAllUserReports(allData);

            const userData = await getUserReport();
            setOnlyUserReports(userData);
        }

        loadReports();
        setCurrentPage(1);
    }, []);


    useEffect(() => {
        function setDisplayedReports() {
            isCurrentTabAllReports ? setReports(allUserReports) : setReports(onlyUserReports);
        }

        setDisplayedReports();
        setCurrentPage(1);
        resetFilters();
    }, [isCurrentTabAllReports, allUserReports, onlyUserReports])

    
    const filteredReports = getFilteredReports(reports, searchQuery, speciesFilter, breedFilter);
    const displayedReports = filteredReports.map((report, idx) => (
        <MissingPetCard
            key={report.id}
            reportData={report}
            isUserDisplay={isCurrentTabAllReports !== true}
            setReports={setReports}
        />
    ))
    const REPORTS_PER_PAGE = 15;
    const totalPages = Math.ceil(displayedReports.length / REPORTS_PER_PAGE);

    return (
        <div
            className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5 flex
            flex-col lg:flex-row gap-5"
        >
            <SideBar
                handleNavigation={handleNavigation}
                setSpeciesFilter={setSpeciesFilter} 
                speciesFilter={speciesFilter}
                setBreedFilter={setBreedFilter}
                breedFilter={breedFilter}
            />

            <div className="flex-1 lg:px-3">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>

                {totalPages == 0 && !isCurrentTabAllReports ? (
                    <div className="flex flex-col items-center mt-45">
                        <p className="text-5xl mb-5">🐾</p>
                        <p>
                            You currently do not have any active reports. You reports will be
                            displayed here once you create them.
                        </p>
                        <button
                            className="text-white bg-[#f39f0e] hover:bg-[#d7790d] rounded-full border-0 px-5
                            py-2 font-bold cursor-pointer transition-all duration-300 ease-in-out mt-3"
                            onClick={handleNavigation}
                        >
                            + Create a Report
                        </button>
                    </div>
                ) : totalPages > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 lg:px-8">
                            {displayedReports.slice((currentPage - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE)}
                        </div>
                        <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center mt-30">
                        <span className="text-5xl mb-5">🐾</span>
                        <p className="font-bold">No Pets Found</p>
                        <p className="text-sm">Try to adjust your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function LostPet() {
    const [currentActiveTab, setCurrentActiveTab] = useState("All Reports");

    return (
        <div className="mt-5 px-7">
            <div className="flex flex-row font-bold text-lg gap-7 my-5 border-b border-gray-500">
                {
                    ["All Reports", "User Reports"].map((tabName, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentActiveTab(tabName)}
                            className={`cursor-pointer ${currentActiveTab === tabName ? "border-b-2 border-green-500 text-[#92bf5a]" : "text-black"}`}
                        >
                            {tabName}
                        </div>
                    ))
                }
            </div>

            <UserView isCurrentTabAllReports={currentActiveTab === "All Reports"}/>
        </div>
    );
}

