

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAllAdoptionReports, getUserAdoptionReport } from "./dbAdoptAccess/getAdoptionReports";

import Pagination from "./components/Pagination";
import FilterButtons from "./components/FilterButtons";
import AdoptPetCard from "./components/AdoptPetCard";

const states = [
    "All States", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", 
    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", 
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", 
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", 
    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"

]

const dogBreedList = [
    "All",
    "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Malamute",
    "American Bulldog", "American Eskimo Dog", "Australian Cattle Dog", "Australian Shepherd",
    "Basenji", "Basset Hound", "Beagle", "Bernese Mountain Dog", "Bichon Frise",
    "Border Collie", "Border Terrier", "Boston Terrier", "Boxer", "Bulldog",
    "Bullmastiff", "Cavalier King Charles Spaniel", "Chihuahua", "Chow Chow",
    "Cocker Spaniel", "Dachshund", "Dalmatian", "Doberman Pinscher", "English Setter",
    "English Springer Spaniel", "French Bulldog", "German Shepherd", "German Shorthaired Pointer",
    "Golden Retriever", "Great Dane", "Greyhound", "Havanese", "Irish Setter",
    "Irish Wolfhound", "Jack Russell Terrier", "Labrador Retriever", "Lhasa Apso",
    "Maltese", "Mastiff", "Miniature Pinscher", "Miniature Schnauzer", "Newfoundland",
    "Norwegian Elkhound", "Old English Sheepdog", "Papillon", "Pekingese",
    "Pembroke Welsh Corgi", "Pit Bull Terrier", "Pointer", "Pomeranian", "Poodle",
    "Pug", "Rhodesian Ridgeback", "Rottweiler", "Saint Bernard", "Samoyed",
    "Shiba Inu", "Shih Tzu", "Siberian Husky", "Soft Coated Wheaten Terrier",
    "Staffordshire Bull Terrier", "Vizsla", "Weimaraner", "West Highland White Terrier",
    "Whippet", "Yorkshire Terrier"
];

const catBreedList = [
    "All",
    "Abyssinian", "American Bobtail", "American Curl", "American Shorthair",
    "American Wirehair", "Balinese", "Bengal", "Birman", "Bombay",
    "British Longhair", "British Shorthair", "Burmese", "Burmilla",
    "Chartreux", "Chausie", "Cornish Rex", "Devon Rex", "Egyptian Mau",
    "Exotic Shorthair", "Havana Brown", "Himalayan", "Japanese Bobtail",
    "Khao Manee", "Korat", "LaPerm", "Maine Coon", "Manx",
    "Munchkin", "Nebelung", "Norwegian Forest Cat", "Ocicat", "Oriental",
    "Persian", "Peterbald", "Pixiebob", "Ragamuffin", "Ragdoll",
    "Russian Blue", "Savannah", "Scottish Fold", "Selkirk Rex", "Siamese",
    "Siberian", "Singapura", "Snowshoe", "Somali", "Sphynx",
    "Thai", "Tonkinese", "Toyger", "Turkish Angora", "Turkish Van",
    "Other"
];

function FilterDisplay({ 
    setStateFilter, stateFilter, 
    setSpeciesFilter, speciesFilter, 
    setBreedFilter, breedFilter,
    handleRemoveFilters 
}) {
    const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState(speciesFilter);

    const handleSelectedSpeciesChange = (species) => {
        if(selectedSpeciesFilter !== species && species != "All") {
            setBreedFilter("All")
        }

        setSelectedSpeciesFilter(species);
    }

    let displayedBreedList = []
    if(selectedSpeciesFilter === "All") displayedBreedList = dogBreedList.concat(catBreedList.filter(breed => !dogBreedList.includes(breed)))
    else if(selectedSpeciesFilter === "Dog") displayedBreedList = dogBreedList
    else displayedBreedList = catBreedList
    
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
                                action={() => handleSelectedSpeciesChange(species)} 
                            />
                        ))
                    }
                </div>
            </div>

            <div className="border border-gray-300"/>

            <div>
                <p className="text-sm font-bold mb-2"> Breed </p>
                <div className="flex flex-row flex-wrap gap-2 overflow-y-auto h-40">
                    {
                        displayedBreedList.map((breed, idx) => (
                            <FilterButtons 
                                key={idx} 
                                text={breed}
                                stateVar={breedFilter}
                                action={() => setBreedFilter(breed)}
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
                        states.map((state, idx) => (
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

            <button 
                onClick={handleRemoveFilters}
                className="border rounded-xl px-3 py-1.5 text-sm font-semibold cursor-pointer transition-all 
                        duration-200 hover:shadow-md text-green-500 border-green-500 w-full sm:hidden"
            >
                Clear
            </button>
        </div>
    )
}

function SearchFilterBar({ 
    setSearchQuery, searchQuery, 
    setSpeciesFilter, speciesFilter, 
    setStateFilter, stateFilter, 
    setBreedFilter, breedFilter 
}) {
    const [currentQuery, setCurrentQuery] = useState(searchQuery)
    const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);
    const isFilterActive = (speciesFilter !== "All") || (stateFilter !== "All States") || (breedFilter !== "All")

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
        setBreedFilter("All");
    }

    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/AdoptionForm")
    }

    return (
        <div className="rounded-2xl bg-white shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:flex-wrap px-4 py-2 gap-2">
                <form
                    onSubmit={handleSubmitQuery}
                    className="rounded-xl px-4 py-2 min-w-45 flex-1 flex flex-row bg-gray-50 md:bg-white w-full"
                >
                    <span
                        className="mr-3 cursor-pointer"
                        onClick={handleSubmitQuery}
                    >
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name or by breed"
                        value={currentQuery}
                        onChange={handleQueryChange}
                        className="text-sm cursor-pointer flex-1 w-full outline-none"
                    />
                </form>

                <div className="border border-gray-400 h-10 hidden md:block"/>

    
                <button
                    onClick={handleNavigation}
                    className="border rounded-xl px-3 py-1.5 text-sm font-bold cursor-pointer bg-green-300
                    hover:bg-green-400"
                >
                    <span>
                        🐾 Put Pet for Adoption
                    </span>
                </button>

                <button 
                    onClick={() => setIsFilterDisplayed(!isFilterDisplayed)}
                    className={`border rounded-xl px-3 py-1.5 text-sm font-semibold cursor-pointer transition-all 
                        duration-200 hover:shadow-md
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
                        transition-al duration-200 hover:shadow-md hidden sm:block"
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
                    setBreedFilter={setBreedFilter}
                    breedFilter={breedFilter}
                    handleRemoveFilters={handleRemoveFilters}
                />}
        </div>
    );
}

function getFilteredReport(reportList, searchQuery, speciesFilter, stateFilter, breedFilter) {
    return reportList.filter((report) => {
        const query = (searchQuery || "").toLowerCase();
        const species = (speciesFilter || "All").toLowerCase();
        const state = (stateFilter || "All States").toLowerCase();
        const breed = breedFilter.toLowerCase();

        const matchesQuery = query === "" || 
        report.name.toLowerCase().includes(query) || 
        report.breed.toLowerCase().includes(query);
        
        const matchesSpecies = species === "all" || report.species.toLowerCase() === species;
        const matchesState = state === "all states" || report.state.toLowerCase() === state;
        const matchesBreed = breed === "all" || report.breed.toLowerCase() === breed;

        return matchesQuery && matchesSpecies && matchesState && matchesBreed;
    });
}

function UserView({ isCurrentTabAllReports }) {
    const [reports, setReports] = useState([]);
    const [allReports, setAllReports] = useState([]);
    const [userOnlyReports, setUserOnlyReports] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("All");
    const [breedFilter, setBreedFilter] = useState("All");
    const [stateFilter, setStateFilter] = useState("All States");
    
    const hasActiveFilters = 
        searchQuery !== ""
        speciesFilter !== "All" || 
        stateFilter !== "All States" || 
        breedFilter !== "All";

    const resetFilters = () => {
        setSearchQuery("");
        setSpeciesFilter("All");
        setBreedFilter("All");
        setStateFilter("All States");
    }
    
    const [currentPage, setCurrentpage] = useState(1);

    useEffect(() => {
        async function loadReports() {
            const allData = await getAllAdoptionReports();
            setAllReports(allData);

            const userData = await getUserAdoptionReport();
            setUserOnlyReports(userData);
        }

        loadReports();
    }, [])


    useEffect(() => {
        isCurrentTabAllReports ? setReports(allReports) : setReports(userOnlyReports);
        setCurrentpage(1);
        resetFilters();
    }, [isCurrentTabAllReports, allReports, userOnlyReports])

    const filteredReports = getFilteredReport(reports, searchQuery, speciesFilter, stateFilter, breedFilter);
    const displayedReports = filteredReports.map((report, idx) => (
        <AdoptPetCard
            key={report.id}
            reportData={report}
            isCurrentTabAllReports={isCurrentTabAllReports}
            setReports={setReports}
        />
    ))

    const REPORTS_PER_PAGE = 20;
    const totalPages = Math.ceil(displayedReports.length / REPORTS_PER_PAGE);

    return (
        <div
            className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5 flex
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
                    breedFilter={breedFilter}
                    setBreedFilter={setBreedFilter}
                />
                <Pagination setCurrentPage={setCurrentpage} currentPage={currentPage} totalPages={totalPages}/>
                
                {
                    totalPages == 0 && !isCurrentTabAllReports ? (
                        <div className="flex flex-col justify-center items-center mt-30">
                            <p className="text-5xl mb-5">🐾</p>
                            <p className="font-bold">
                                You currently do not have any active reports. You reports will be
                                displayed here once you create them.
                            </p>
                        </div>
                    ) : totalPages > 0 ? (

                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
                                {displayedReports.slice((currentPage-1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE)}
                            </div>

                            <Pagination setCurrentPage={setCurrentpage} currentPage={currentPage} totalPages={totalPages}/>
                        </>
                    ) : totalPages === 0 && hasActiveFilters ? (
                        <div className="flex flex-col justify-center items-center mt-30">
                            <span className="text-5xl mb-5">🐾</span>
                            <p className="font-bold">There is an error retrieving the reports</p>
                            <p className="font-bold">Please try again later</p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center mt-30">
                            <span className="text-5xl mb-5">🐾</span>
                            <p className="font-bold">No Pets Found</p>
                            <p className="text-sm">Try to adjust your search or filters</p>
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
                            className={`cursor-pointer ${currentActiveTab === tabName ? "border-b-2 border-red-600 text-red-600" : "text-black"}`}
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
