

// import styles from "./AdoptPet.module.css"

// import AdoptablePets from "./AdoptablePets.json"

// import { useState } from "react"


// function Card({ pet }) {
//     return (
//         <div className={styles.animalCard}>
//             <div className={styles.imageContainer}>
//                 <img src={pet.img} alt="pet image"/>
//             </div>
//             <div className={styles.animalCardBody}>
//                 <div className={styles.petSpeciesAgeContainer}>
//                     <span className={styles.petSpeciesText}>{pet.breed}</span>
//                     <span className={styles.petAgeText}>{pet.age} years old</span>
//                 </div>
//                 <div className={styles.petTypeInfoContainer}>
//                     <span className={styles.petBreedText}>{pet.species}</span>
//                 </div>
//                 <div className={styles.petLocationContainer}>
//                     <span>{`${pet.city}, ${pet.state}`}</span>
//                     <span>{`${pet.address}`}</span>
//                 </div>
//                 <div className={styles.petNotesContainer}>
//                     <span>
//                         {pet.notes}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function SearchAndFilterUI({ setSearchQuery, setPetFilter, setStateFilter }) {
//     return (
//         <div className={styles.SearchAndFilter}>
//             <SearchBar setSearchQuery={setSearchQuery}/>
//             <FilterUI setPetFilter={setPetFilter} setStateFilter={setStateFilter}/>
//         </div>
//     )
// }

// function SearchBar({ setSearchQuery }) {

//     const [userSearch, setUserSearch] = useState("");

//     const handleUserSearchChange = (e) => {
//         setUserSearch(e.target.value);
//     }

//     const handleSearchQueryChange = (e) => {
//         e.preventDefault();
//         setSearchQuery(userSearch)
//     }

//     return (
//         <div className={styles.searchContainer}>
//             <div className={styles.searchInput}>
//                 <form onSubmit={handleSearchQueryChange}>
//                     <input
//                         type="text"
//                         placeholder="Search by breed"
//                         value={userSearch}
//                         onChange={handleUserSearchChange}
//                     />
//                 </form>

//                 <img 
//                     src="./searchBarIcons/searchIcon.png" 
//                     alt="magnifying glass"
//                     onClick={handleSearchQueryChange}
//                 />
//             </div>
//         </div>
//     )
// }

// function FilterUI({ setPetFilter, setStateFilter }) {
//     const [showFilters, setShowFilters] = useState(false);
//     const [selectedPetFilter, setSelectedPetFilter] = useState("all");
//     const [selectedStateFilter, setSelectedStateFilter] = useState("all");


//     const handlePetFilterChanger = (selectedFilter) => {
//         setSelectedPetFilter(selectedFilter);
//     }

//     const handlePetStateChanger = (selectedState) => {
//         setSelectedStateFilter(selectedState)
//     }

//     const handleResetFilters = () => {
//         setSelectedPetFilter("all");
//         setSelectedStateFilter("all");
//     }

//     const handleApplyFilters = () => {
//         setPetFilter(selectedPetFilter);
//         setStateFilter(selectedStateFilter);
//         setShowFilters(false)
//     }

//     return (
//         <div className={styles.filterButtonContainer}>
//             <button 
//                 className={styles.filterButton}
//                 onClick={() => setShowFilters(!showFilters)}
//             >
//                 Filter
//             </button>
    

//             {showFilters && (
//                 <div className={styles.filterDisplayContainer}> 

//                     <div className={styles.filterHeader}>
//                         <span>Filters</span>
//                         <button 
//                             className={styles.filterResetButton}
//                             onClick={handleResetFilters}
//                         >
//                             Reset all
//                         </button>
//                     </div>

//                     <div className={styles.filterSection}>
//                         <div className={styles.filterByTitle}>
//                             Animal Type
//                         </div>
//                         <div className={styles.filterButtonsContainer}>
//                             <button 
//                                 onClick={() => handlePetFilterChanger('all')}
//                                 className={`${selectedPetFilter == "all" ? styles.activeFilter : styles.inactiveFilter}`}
//                             >
//                                 All
//                             </button>
//                             <button 
//                                 onClick={() => handlePetFilterChanger('dog')}
//                                 className={`${selectedPetFilter == "dog" ? styles.activeFilter : styles.inactiveFilter}`}
//                             > 
//                                 Dogs
//                             </button>
//                             <button 
//                                 onClick={() => handlePetFilterChanger('cat')}
//                                 className={`${selectedPetFilter == "cat" ? styles.activeFilter : styles.inactiveFilter}`}
//                             >
//                                 Cats
//                             </button>
//                         </div>
//                     </div>

//                     <div className={styles.sectionDivider}/>

//                     <div className={styles.filterSection}>
//                         <div className={styles.filterByTitle}>
//                             State
//                         </div>
//                         <div className={styles.filterButtonsContainer}>
//                             <button 
//                                 onClick={() => handlePetStateChanger('all')}
//                                 className={`${selectedStateFilter == "all" ? styles.activeFilter : styles.inactiveFilter}`}
//                             >
//                                 All
//                             </button>
//                             <button 
//                                 onClick={() => handlePetStateChanger('NY')}
//                                 className={`${selectedStateFilter == "NY" ? styles.activeFilter : styles.inactiveFilter}`}
//                             > 
//                                 New York
//                             </button>
//                             <button 
//                                 onClick={() => handlePetStateChanger('NJ')}
//                                 className={`${selectedStateFilter == "NJ" ? styles.activeFilter : styles.inactiveFilter}`}
//                             >
//                                 New Jersey
//                             </button>
//                         </div>
//                     </div>

//                     <button 
//                         className={styles.applyFilterButton}
//                         onClick={handleApplyFilters}
//                     >
//                         Apply Filters
//                     </button>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default function AdoptPet() {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [petFilter, setPetFilter] = useState("all");
//     const [stateFilter, setStateFilter] = useState("all")
    
//     const displayedAdoptablePets = AdoptablePets.filter((adoptablePet) => {
//         const query = searchQuery.toLowerCase();

//         const matchesSearch = (
//             searchQuery == "" || 
//             adoptablePet.breed.toLowerCase().includes(query)
//         );

//         const matchesPetFilter = (
//             petFilter == "all" ||
//             adoptablePet.species.toLowerCase() == petFilter
//         );

//         const matchesStateFilter = (
//             stateFilter === "all" ||
//             adoptablePet.state == stateFilter
//         )

//         return matchesSearch && matchesPetFilter && matchesStateFilter;
//     });

//     return (
//         <div className={styles.adoptPetContainer}>

//             <h2 className={styles.title}>
//                 <div className={styles.titleContainer}>Adopt Pet</div>
//             </h2>

//             <SearchAndFilterUI
//                 setSearchQuery={setSearchQuery}
//                 setPetFilter={setPetFilter}
//                 setStateFilter={setStateFilter}
//             />
            
//             {/* Filler image cards. Replace when database is set up */}
//             <div className={styles.cardContainer}>
//                 {
//                     displayedAdoptablePets.map((adoptablePet) => {
//                         return <Card key={adoptablePet.id} pet={adoptablePet}/> 
//                     })
//                 }
//             </div>
//         </div>
//     )
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "./components/Pagination";
import FilterButtons from "./components/FilterButtons";

function FilterDisplay() {
    return (
        <div className="border-t border-gray-300 bg-[#f8f5f0] px-4 py-4 gap-6">
            <div>
                <p className="text-sm font-bold mb-2"> State</p>
                <div className="flex flex-row flex-wrap gap-2">
                    {
                        ["All States", "New York", "New Jersey"].map((state, idx) => (
                            <FilterButtons id={idx} text={state}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

function SearchFilterBar({ }) {
    const [userInput, setUserInput] = useState()
    const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);


    return (
        <div className="border rounded-2xl bg-white shadow-md">
            <div className="flex flex-row items-center px-4 py-2 gap-2">
                <form
                    className=""
                >
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name"
                    />
                </form>

                <div className="border h-6"/>

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
            </div>
            
            {isFilterDisplayed && <FilterDisplay/>}
        </div>
    );
}

function UserView({ isCurrentTabAllReports }) {
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [petFilter, setPetFilter] = useState("all");
    const [stateFilter, setStateFilter] = useState("all");

    const navigate = useNavigate();
    const handleNavigation = () => {
        console.log("User is taken to a new view")
    }

    const displayedReports = reports.filter(report => {
        const query = searchQuery.toLowerCase()

        return (
            (searchQuery === "" || report.breed.toLowerCase().includes(query) || report.name.toLowerCase().includes(q)) &&
            (petFilter === "all" || report.species.toLowerCase() === petFilter) && 
            (stateFilter === "all" || report.state === stateFilter)
        );
    });

    // useEffect(() => {
    //     async function loadReports() {
    //         const data = await getUserReport();
    //         setReports(data);
    //     }

    //     loadReports();
    // }, [])

    if (isCurrentTabAllReports) {
        // setReports(pReports => pReports + fillerReportsArr)
    }

    return (
        <div
            className="bg-[FFF9F0] min-h screen pb-12.5 pt-5 flex
            flex-col gap-5"
        >

            <div className="flex-1">
                <SearchFilterBar/>
                <Pagination ReportList={reports}/>
                

                
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
