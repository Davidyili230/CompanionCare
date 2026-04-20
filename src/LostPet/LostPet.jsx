

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom";

// import { getAllUserReports, getUserReport } from "./GetReport"
// import { deleteReport } from "./DeleteReport";

// import { fillerReports } from "./TempReports";
// import MissingPetCard from "./Components/MissingPetCard";
// import Pagination from "./Components/ReportPagination";

// function SearchBar({ setSearchQuery }) {
//     const [userInput, setUserInput] = useState('');

//     const handleInputChange = (e) => {
//         setUserInput(e.target.value);
//     }

//     const handleSearchQueryChange = (e) => {
//         e.preventDefault();
//         setSearchQuery(userInput);
//     }

//     return (
//         <div className="bg-white shadow-lg rounded-3xl px-4 py-2">
//             <form 
//                 onSubmit={handleSearchQueryChange}
//                 className="flex flex-row items-center"
//             >
//                 <img 
//                     src="./searchBarIcons/searchIcon.png" 
//                     alt="magnifying glass"
//                     className="w-5 h-5 cursor-pointer mr-2"
//                     onClick={handleSearchQueryChange}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Search by pet name"
//                     value={userInput}
//                     onChange={handleInputChange}
//                     className="text-sm w-full outline-0"
//                 />
//             </form>
//         </div>
//     )
// }

// function FilterPopUp({ setBreedFilter, setPetFilter, setDisplayFilter }) {
//     const [selectedBreedFilter, setSelectedBreedFilter] = useState("all");
//     const [selectedPetFilter, setSelectedPetFilter] = useState("all");

//     const handleBreedChange = (selectedBreed) => {
//         setSelectedBreedFilter(selectedBreed)
//     }

//     const handlePetFilterChange = (selectedPet) => {
//         setSelectedPetFilter(selectedPet);
//     }

//     const handleResetFilters = () => {
//         setBreedFilter("all");
//         setPetFilter("all");
//     }

//     const handleApplyFilters = () => {
//         setBreedFilter(selectedBreedFilter);
//         setPetFilter(selectedPetFilter);
//         setDisplayFilter(false)
//     }

//     const dogBreedList = [
//         "Labrador Retriever", "Golden-Retriever", "French Bulldog", "German Shepherd", "Poodle",
//         "Bulldog", "Beagle", "Rottweiler", "Dachshund","Yorkshire Terrier"
//     ]

//     const catBreedList = [
//         "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
//         "Bengal", "Sphynx", "Scottish Fold", "Abyssinian", "Russian Blue"
//     ]

//     let breedList = []
//     if(selectedPetFilter == "all") breedList = dogBreedList.concat(catBreedList)
//     else if(selectedPetFilter == "dog") breedList = dogBreedList
//     else breedList = catBreedList

//     return (
//         <div className="flex flex-col gap-4 border-t border-gray-300 mx-4 pb-4">
//             <div className="pt-2">
//                 <p className="text-xs font-bold">Species</p>

//                 <div className="flex gap-1.5 mt-1.5">
//                     <button
//                         className={`border rounded-xl px-2.5 py-1.25 text-xs transition-all duration-300 ease-in-out
//                         hover:scale-[1.02] hover:shadow-md ${selectedPetFilter == "all" ? "bg-[#efc3c3]" : "bg-white"}`}
//                         onClick={() => handlePetFilterChange('all')}
//                     >
//                         All
//                     </button>
//                     <button
//                         className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
//                         hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedPetFilter == "dog" ? "bg-[#efc3c3]" : "bg-white"}`}
//                         onClick={() => handlePetFilterChange('dog')}
//                     >
//                         Dogs
//                     </button>
//                     <button
//                         className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
//                         hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedPetFilter == "cat" ? "bg-[#efc3c3]" : "bg-white"}`}
//                         onClick={() => handlePetFilterChange('cat')}
//                     >
//                         Cats
//                     </button>
//                 </div>
//             </div>

//             <div>
//                 <p className="text-xs font-bold">Breeds</p>

//                 <div className="mt-1.5 flex flex-wrap gap-1.5 overflow-y-auto max-h-50">
//                      <button
//                         className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
//                         hover:scale-[1.03] hover:shadow-md ${selectedBreedFilter == "all" ? "bg-[#efc3c3]" : "bg-white"}`}
//                         onClick={() => handleBreedChange('all')}
//                     >
//                         All
//                     </button>
//                         {
//                             breedList.map((breed, idx) => (
//                                 <button
//                                     key={idx}
//                                     className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
//                                     hover:scale-[1.03] hover:shadow-md ${selectedBreedFilter == breed ? "bg-[#efc3c3]" : "bg-white"}`}
//                                     onClick={() => handleBreedChange(breed)}
//                                 >
//                                     {breed}
//                                 </button>
//                             ))
//                         }
//                 </div>
//             </div>

//             <div className="flex flex-row gap-2">
//                 <button
//                     className="border rounded-xl px-2 py-1.25 text-sm flex-1 cursor-pointer
//                     transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.03]"
//                     onClick={handleResetFilters}
//                 >
//                     Reset all
//                 </button>
//                 <button
//                     className="border rounded-xl px-2 py-1.25 text-sm flex-1 cursor-pointer
//                     transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.03]"
//                     onClick={handleApplyFilters}
//                 >
//                     Apply Filters
//                 </button>
//             </div>
//         </div>
//     );
// }

// function SideBar({ handleNavigation, setBreedFilter, setPetFilter}) {
//     const [displayFilter, setDisplayFilter] = useState(false);

//     return (
//         <div className="flex flex-col gap-5 w-64">
//             <div className="bg-white text-xs p-4 rounded-3xl text-center shadow-md flex flex-col justify-center items-center">
//                 <p className="text-2xl mb-2">🐾</p>
//                 <p className="font-bold">Missing a Pet?</p>
//                 <p>
//                     We are sorry to hear that you have lost your pet. We hope you 
//                     can be reunited with your companion soon.
//                 </p>

//                 <button 
//                     className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-2 font-bold cursor-pointer
//                     transitioin-all duration-300 ease-in-out hover:bg-[#c71515] mt-3"
//                     onClick={handleNavigation}
//                 >
//                     + Create a Report
//                 </button>
//             </div>

//             <div className="bg-white rounded-3xl shadow-md ">
//                 <button
//                     className="flex flex-row justify-between w-full px-4 py-2 text-sm
//                     cursor-pointer"
//                     onClick={() => setDisplayFilter(prevDisplayFiler => !prevDisplayFiler)}
//                 >
//                     <span>Filter</span>
//                     <span className={`transition-transform duration-200 ${displayFilter ? "rotate-180" : "rotate-0"}`}>
//                         ↓
//                     </span>
//                 </button>

//                 {displayFilter && 
//                     <FilterPopUp
//                         setBreedFilter={setBreedFilter}
//                         setPetFilter={setPetFilter}
//                         setDisplayFilter={setDisplayFilter}
//                     />
//                 }
//             </div>
//         </div>
//     )
// }

// function AllReports({
//     setSearchQuery,
//     setBreedFilter,
//     setPetFilter,
//     displayedMissingPets
// }) {
//     const [reports, setReports] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const REPORTS_PER_PAGE = 15;

//     // useEffect(() => {
//     //     async function loadReports() {
//     //         const data = await getAllUserReports();
//     //         setReports(data);
//     //     }

//     //     loadReports();
//     // }, [])

//     const filteredReports = displayedMissingPets(reports);

//     const navigate = useNavigate();

//     const handleNavigation = () => {
//         navigate("/LostPetReport");
//     }

//     const actualCards = filteredReports.map(report => (
//         <MissingPetCard
//             key={report.id}
//             reportData={report}
//             setReports={setReports}
//         />
//     ))

//     const fillerCards = fillerReports.map(fillerReport => (
//         <MissingPetCard
//             key={fillerReport.id}
//             reportData={fillerReport}
//         />
//     ))

//     const allReports = [...actualCards, ...fillerCards]
//     const totalPages = Math.ceil(allReports.length / REPORTS_PER_PAGE)

//     return (
//         <div 
//             className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5 flex
//             flex-row gap-5"
//         >
//             <SideBar
//                 handleNavigation={handleNavigation}
//                 setBreedFilter={setBreedFilter}
//                 setPetFilter={setPetFilter}
//             />

//             <div className="flex-1 px-3">
//                 <SearchBar setSearchQuery={setSearchQuery}/>
//                 <Pagination
//                     setCurrentPage={setCurrentPage}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                 />
//                 <div className="grid grid-cols-3 gap-6 mt-8 px-8">
//                     {allReports.slice((currentPage - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE)}
//                 </div>
//                 <Pagination
//                     setCurrentPage={setCurrentPage}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                 />
//             </div>
//         </div>
//     )
// }

// function UserReports({ 
//     setSearchQuery,
//     setBreedFilter,
//     setPetFilter,
//     displayedMissingPets
// }) {
//     const [reports, setReports] = useState([]);
    
//     const navigate = useNavigate();

//     const handleNavigation = () => {
//         navigate("/LostPetReport");
//     }

//     // useEffect(() => {
//     //     async function loadReports() {
//     //         const data = await getUserReport();
//     //         setReports(data);
//     //     }

//     //     loadReports();
//     // }, []);

//     const filteredReports = displayedMissingPets(reports);

//     const reportArr = filteredReports.map(report => (
//         <MissingPetCard
//             key={report.id}
//             reportData={report}
//             isUserDisplay={true}
//             setReports={setReports}
//         />
//     ))

//     const REPORTS_PER_PAGE = 15;
//     const [currentPage, setCurrentPage] = useState(1)
//     const totalPages = Math.ceil(reportArr.length / REPORTS_PER_PAGE)

//     return (
//         <div 
//             className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5 flex
//             flex-row gap-5"
//         >
//             <SideBar
//                 handleNavigation={handleNavigation}
//                 setBreedFilter={setBreedFilter}
//                 setPetFilter={setPetFilter}
//             />

//             <div className="flex-1 px-3">
//                 <SearchBar setSearchQuery={setSearchQuery}/>
//                 <Pagination
//                     setCurrentPage={setCurrentPage}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                 />

//                 {totalPages > 0 ? (
//                     <div className="grid grid-cols-3 gap-6 mt-8 px-8">
//                         {reportArr.slice((currentPage - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE)}
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center mt-45">
//                         <p className="text-5xl mb-5">🐾</p>
//                         <p>
//                             You current do not have any active reports. Your reports will be 
//                             displayed here once you create them.
//                         </p>
//                         <button 
//                             className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-2 font-bold cursor-pointer
//                             transitioin-all duration-300 ease-in-out hover:bg-[#c71515] mt-3"
//                             onClick={handleNavigation}
//                         >
//                             + Create a Report
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default function LostPet() {
//     const [allReportsTabSelected, setAllReportsTabSelected] = useState(true);

//     const [searchQuery, setSearchQuery] = useState("");
//     const [breedFilter, setBreedFilter] = useState("all");
//     const [petFilter, setPetFilter] = useState("all");

//     const displayedMissingPets = (reports) => {
//         return reports.filter((report) => {
//             const query = searchQuery.toLowerCase();

//             const matchesSearch = (
//                 searchQuery == "" ||
//                 report.petName.toLowerCase().includes(query)
//             );

//             const matchesBreedFilter = (
//                 breedFilter == "all" ||
//                 report.breed.toLowerCase() == breedFilter
//             );

//             const matchesPetFilter = (
//                 petFilter == "all" ||
//                 report.petType.toLowerCase() == petFilter
//             );

//             return matchesSearch && matchesBreedFilter && matchesPetFilter;
//         });
//     }

//     return (
//         <div className="mt-5 px-7">
            
//             <div className="flex flex-row font-bold text-lg gap-7 my-5 border-b border-gray-500">
//                 <div 
//                     onClick={() => setAllReportsTabSelected(true)}
//                     className={`cursor-pointer 
//                         ${allReportsTabSelected
//                          ? "border-b-2 border-red-600 text-red-600"
//                          : "text-black"
//                     }`}
//                 >
//                     All Reports
//                 </div>
//                 <div 
//                     onClick={() => setAllReportsTabSelected(false)}
//                     className={`cursor-pointer 
//                         ${allReportsTabSelected == false
//                          ? "border-b-2 border-red-600 text-red-600"
//                          : ""
//                     }`}
//                 >
//                     My Reports
//                 </div>
//             </div>
                
//             {allReportsTabSelected 
//                 ? <AllReports
//                     setSearchQuery={setSearchQuery}
//                     setBreedFilter={setBreedFilter}
//                     setPetFilter={setPetFilter}
//                     displayedMissingPets={displayedMissingPets} />
//                 : <UserReports
//                     setSearchQuery={setSearchQuery}
//                     setBreedFilter={setBreedFilter}
//                     setPetFilter={setPetFilter}
//                     displayedMissingPets={displayedMissingPets} />
//             }
//         </div>
//     )
// }

import { useState, useEfect } from "react"
import { useNavigate } from "react-router-dom";

import { getAllUserReports, getUserReport } from "./GetReport";
import { deleteReport } from "./DeleteReport";

import { fillerReports } from "./TempReports";
import MissingPetCard from "./Components/MissingPetCard";
import Pagination from "./Components/Pagination";

function FilterDisplay({}) {
    return (
        <div>

        </div>
    )
}


function SideBar({ handleNavigation }) {
    const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);

    return (
        <div className="flex flex-col gap-5 w-64">
            <div className="bg-white text-xs p-4 rounded-3xl text-center shadow-md
            flex flex-col justify-center items-center">
                <p className="text-2xl">🐾</p>
                <p className="font-bold">Missing a Pet?</p>
                <p>
                    We are sorrty to hear that you have lost your pet. We hope you
                    can be reunited with your companion soon
                </p>

                <button
                    className="text-white bg-[#FC1818] rounded-full border-o px-5 py-2 font-bold
                    cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#c71717] mt-3"
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

            </div>
        </div>
    )
}


function UserView({ isCurrentTabAllReports }) {
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/LostPetReport");
    }

  
    // useEffect(() => {
    //     async function loadReports() {
    //         const data = await getUserReport();
    //         setReports(data);
    //     }

    //     loadReports();
    // }, [])

    const fillerReportsArr = fillerReports.map(fillerReport => (
        <MissingPetCard
            key={reports.id}
            reportData={fillerReports}
            isUserDisplay={isCurrentTabAllReports !== "All Reports"}
            setReports={""}
        />
    ))

    if (isCurrentTabAllReports) {
        // setReports(pReports => pReports + fillerReportsArr)
    }

    const REPORTS_PER_PAGE = 15;
    const totalPages = Math.ceil(reports.length / REPORTS_PER_PAGE);

    return (
        <div
            className="bg-[#FFF9F0] min-h screen pb-12.5 pt-5 flex
            flex-row gap-5"
        >
            <SideBar handleNavigation={handleNavigation}/>

            <div className="flex-1 px-3">
                <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>

                {totalPages > 0 ? (
                    <div className="grid grid-cols-3 gap-6 mt-8 px-8">
                        {reports.slice((current_page - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center mt-45">
                        <p className="text-5xl mb-5">🐾</p>
                        <p>
                            You currently do not have any active reports. You reports will be
                            displayed here once you create them.
                        </p>
                        <button
                            className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-2
                            font-bold cursor-pointer transition-all duration-300 ease-in-out
                            hover:bg-[#c71515] mt-3"
                            onClick={handleNavigation}
                        >
                            + Create a Report
                        </button>
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
                            className={`cursor-pointer ${currentActiveTab === tabName ? "border-b-2 border-red-600 text-red-600" : "text-black"}`}
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

