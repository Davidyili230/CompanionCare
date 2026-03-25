

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { getAllUserReports, getUserReport } from "./GetReport"
import { deleteReport } from "./DeleteReport";


function MissingPetCard({ reportData, isUserDisplay, setReports }) {
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleCardFlip = () => {
        setIsCardFlipped(!isCardFlipped);
    }

    return (
        <div className="w-85 h-120 perspective">
            <div 
                className="relative w-full h-full transition-transform duration-700"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
            >
                <div className="absolute w-full h-full backface-hidden">
                    <CardFront reportData={reportData} flipCard={handleCardFlip} isUserDisplay={isUserDisplay} setReports={setReports}/>
                </div>

                <div 
                    className="absolute w-full h-full backface-hidden"
                    style={{ transform: "rotateY(180deg" }}
                >
                    <CardBack reportData={reportData} flipCard={handleCardFlip}/>
                </div>
            </div>
        </div>
    );
}

function CardFront({ reportData, flipCard, isUserDisplay, setReports }) {
    async function handleDeleteReport(id) {

        console.log("The report id to be deleted", id)
        try {
            await deleteReport(id);
            const newReports = await getAllUserReports();
            setReports(newReports);
        } catch (error) {
            console.log("Error deleting and getting new reports", error);
        }
    }

    return (
        <div 
            className="flex flex-col bg-white border rounded-lg border-red-500 transition-all duration-1000 ease-in-out 
            hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full"
        >
            <div className="overflow-hidden h-52.5 relative">
                <img 
                    src={reportData.image}
                    alt="Pet Image"
                    className="w-full h-full object-cover"
                />

                {
                    isUserDisplay && 
                    <button 
                        className="absolute top-2 right-2 rounded-lg border-0 text-white font-bold bg-[#f16b6b] px-2.5 py-1.5 cursor-pointer 
                        transition-colors duration-300 ease-in-out mb-5 hover:bg-[#f61c1c]"
                        onClick={() => handleDeleteReport(reportData.id)}
                    >
                        Delete Report
                    </button>
                }
            </div>

            <div className="px-2.5 py-2 flex-1">
                <div>
                    <span className="font-bold text-2xl">{reportData.petName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-xl">
                        {reportData.customBreed == "" ? reportData.breed : reportData.customBreed}
                    </span>
                    {/* <span>Age</span> */}
                </div>

                <div className="mb-1.5">
                    <span>{reportData.petType}</span>
                </div>

                <div className="mb-1.5">
                    <span>{reportData.dateLastSeen}</span>
                </div>

                <div className="border-t border-t-[rgb(186, 146, 146)] pt-1 max-h-20 overflow-y-scroll ">
                    <span className="text-[14px]">
                        {reportData.additionalInfo}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center mt-2.5">
                <button 
                    onClick={flipCard}
                    className="rounded-lg border-0 text-white font-bold bg-[#f16b6b] px-2.5 py-1.5 cursor-pointer 
                    transition-colors duration-300 ease-in-out w-4/5 mb-5 hover:bg-[#f61c1c]"
                >
                    Contact Owner
                </button>
            </div>
        </div>
    )
}

function CardBack({ reportData, flipCard }) {
    return (
        <div 
            className="bg-white border rounded-lg border-red-600 transition-all duration-1000 ease-in-out cursor-pointer 
            hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full flex flex-col justify-between p-4"
        >
            <div>
                
                <h2 className="text-2xl font-bold mb-10 text-center underline mt-5">Owner Information</h2>
                
                <div className="space-y-2 text-md">
                    <div className="flex justify-center gap-1">
                        <label className="font-bold">Name: </label>
                        <span>{reportData.ownerName}</span>
                    </div>

                    <div className="flex justify-center gap-1">
                        {
                            reportData.email != "" 
                            &&
                            <>
                                <label className="font-bold">Email Address: </label>
                                <span>{reportData.email}</span>
                            </>
                        }
                    </div>

                    <div className="flex justify-center gap-1">
                        {
                            reportData.phone != "" 
                            &&
                            <>
                                <label className="font-bold">Phone Number: </label>
                                <span>{reportData.phone}</span>
                            </>
                        }
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center mt-2.5">
                <button 
                    onClick={flipCard}
                    className="rounded-lg border-0 text-white font-bold bg-[#f16b6b] px-2.5 py-1.5 cursor-pointer 
                    transition-colors duration-300 ease-in-out w-4/5 mb-5 hover:bg-[#f61c1c]"
                >
                    Back
                </button>
            </div>
        </div>
    )
}

function SearchBar({ setSearchQuery, setBreedFilter, setPetFilter }) {
    const [userInput, setUserInput] = useState('');
    const [displayFilter, setDisplayFilter] = useState(false);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    }

    const handleSearchQueryChange = (e) => {
        e.preventDefault();
        setSearchQuery(userInput);
    }

    const handleDisplayFilter = () => {
        setDisplayFilter(!displayFilter);
    }

    return (
        <div className="flex justify-center flex-col items-center gap-2.5 mb-5">
            <div className="flex items-center rounded-3xl px-2.5 py-1.25 border bg-white hover:shadow-[0_2px_6px_rgb(113,111,111)]">
                <form onSubmit={handleSearchQueryChange}>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={userInput}
                        onChange={handleInputChange}
                        className="border- text-base p-1.5 outline-0 w-112.5"
                    />
                </form>

                <img 
                    src="./searchBarIcons/searchIcon.png" 
                    alt="magnifying glass"
                    className="w-6.25 h-6.25 cursor-pointer ml-1.25"
                    onClick={handleSearchQueryChange}
                />
            </div>

            <button 
                className="border-0 rounded-3xl bg-[#FFB6B6] px-7 py-2.5 font-bold 
                cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#d28e8e]"
                onClick={handleDisplayFilter}
            >
                Filter
            </button>

            {displayFilter && 
                <FilterPopUp 
                    setBreedFilter={setBreedFilter}
                    setPetFilter={setPetFilter}
                />}
        </div>
    )
}

function FilterPopUp({ setBreedFilter, setPetFilter}) {
    const [selectedBreedFilter, setSelectedBreedFilter] = useState("all");
    const [selectedPetFilter, setSelectedPetFilter] = useState("all");

    const handleBreedChange = (selectedBreed) => {
        setSelectedBreedFilter(selectedBreed)
    }

    const handlePetFilterChange = (selectedPet) => {
        setSelectedPetFilter(selectedPet);
    }

    const handleResetFilters = () => {
        setBreedFilter("all");
        setPetFilter("all");
    }

    const handleApplyFilters = () => {
        setBreedFilter(selectedBreedFilter);
        setPetFilter(selectedPetFilter);
    }

    const dogBreedList = [
        "Labrador Retriever", "Golden-Retriever", "French Bulldog", "German Shepherd", "Poodle",
        "Bulldog", "Beagle", "Rottweiler", "Dachshund","Yorkshire Terrier"
    ]

    const catBreedList = [
        "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
        "Bengal", "Sphynx", "Scottish Fold", "Abyssinian", "Russian Blue"
    ]

    let breedList = []
    if(selectedPetFilter == "all") breedList = dogBreedList.concat(catBreedList)
    else if(selectedPetFilter == "dog") breedList = dogBreedList
    else breedList = catBreedList

    return (
        <div className="border rounded-xl mt-2.5 bg-white px-5 py-2.5 w-100">
            <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold">Filters</span>
                <button
                    className="border rounded-md px-1.25 py-1 transition-all duration-300 ease-in-out cursor-pointer
                    hover:scale-[1.03] hover:bg-gray-200"
                    onClick={handleResetFilters}
                >
                    Reset all
                </button>
            </div>

            <div className="text-sm mb-1.5">
                <div className="font-semibold">
                    Species
                </div>
                <div className="flex flex-wrap gap-1.25">
                    <button
                        className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
                        hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedPetFilter == "all" ? "bg-[#efc3c3]" : "bg-white"}`}
                        onClick={() => handlePetFilterChange('all')}
                    >
                        All
                    </button>
                    <button
                        className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
                        hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedPetFilter == "dog" ? "bg-[#efc3c3]" : "bg-white"}`}
                        onClick={() => handlePetFilterChange('dog')}
                    >
                        Dogs
                    </button>
                    <button
                        className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
                        hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedPetFilter == "cat" ? "bg-[#efc3c3]" : "bg-white"}`}
                        onClick={() => handlePetFilterChange('cat')}
                    >
                        Cats
                    </button>
                </div>
            </div>

            <div className="border-t-2 my-3"/>

            <div>
                <div className="font-semibold">
                    Breed
                </div>
                <div className="flex flex-wrap gap-1.25">
                    <button
                        className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
                        hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedBreedFilter == "all" ? "bg-[#efc3c3]" : "bg-white"}`}
                        onClick={() => handleBreedChange('all')}
                    >
                        All
                    </button>

                    {
                        breedList.map((breed, idx) => (
                            <button
                                key={idx}
                                className={`border rounded-xl px-2.5 py-1.25 text-sm transition-all duration-300 ease-in-out
                                hover:scale-[1.03] hover:shadow-[0_3px_3px_black] ${selectedBreedFilter == breed ? "bg-[#efc3c3]" : "bg-white"}`}
                                onClick={() => handleBreedChange(breed)}
                            >
                                {breed}
                            </button>
                        ))
                    }
                </div>
            </div>

        <button
            className="border rounded-md font-bold mt-3.5 w-full px-2.5 py-1.25 cursor-pointer
            transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_3px_3px_black]"
            onClick={handleApplyFilters}
        >
            Apply Filters
        </button>
        </div>
    );
}

function AllReports({
    setSearchQuery,
    setBreedFilter,
    setPetFilter,
    displayedMissingPets
}) {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        async function loadReports() {
            const data = await getAllUserReports();
            setReports(data);
        }

        loadReports();
    }, [])

    const filteredReports = displayedMissingPets(reports);

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/LostPetReport");
    }

    return (
        <div className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5">
            <SearchBar setSearchQuery={setSearchQuery}/>

            <div className="px-3">
                <button 
                    className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-3 font-bold cursor-pointer
                    ml-5 transitioin-all duration-300 ease-in-out hover:bg-[#c71515]"
                    onClick={handleNavigation}
                >
                    Create Report
                </button>
            </div>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className="grid grid-cols-4 gap-6 mt-8 px-8">
                {
                    filteredReports.map(report => (
                        <MissingPetCard
                            key={report.id}
                            reportData={report}
                            setReports={setReports}
                        />
                    ))
                }
                {
                    fillerReports.map(fillerReport => (
                        <MissingPetCard
                            key={fillerReport.id}
                            reportData={fillerReport}
                        />
                    ))
                }
            </div>
        </div>
    )
}

function UserReports({ 
    setSearchQuery,
    setBreedFilter,
    setPetFilter,
    displayedMissingPets
}) {
    const [reports, setReports] = useState([]);
    
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/LostPetReport");
    }

    useEffect(() => {
        async function loadReports() {
            const data = await getUserReport();
            setReports(data);
        }

        loadReports();
    }, []);

    const filterdReports = displayedMissingPets(reports);

    return (
        <div className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5">
            <SearchBar 
                setSearchQuery={setSearchQuery}
                setBreedFilter={setBreedFilter}
                setPetFilter={setPetFilter}
            />

            <div className="px-3">
                <button 
                    className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-3 font-bold cursor-pointer
                    ml-5 transitioin-all duration-300 ease-in-out hover:bg-[#c71515]"
                    onClick={handleNavigation}
                >
                    Create Report
                </button>
            </div>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className="grid grid-cols-4 gap-6 mt-8 px-8">
                {
                    filterdReports.map(report => (
                        <MissingPetCard
                            key={report.id}
                            reportData={report}
                            isUserDisplay={true}
                            setReports={setReports}
                        />
                    ))
                }
            </div>
        </div>
    )
}


export default function LostPet() {
    const [allReportsTabSelected, setAllReportsTabSelected] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [breedFilter, setBreedFilter] = useState("all");
    const [petFilter, setPetFilter] = useState("all");

    const displayedMissingPets = (reports) => {
        return reports.filter((report) => {
            const query = searchQuery.toLowerCase();

            const matchesSearch = (
                searchQuery == "" ||
                report.petName.toLowerCase().includes(query)
            );

            const matchesBreedFilter = (
                breedFilter == "all" ||
                report.breed.toLowerCase() == breedFilter
            );

            const matchesPetFilter = (
                petFilter == "all" ||
                report.petType.toLowerCase() == petFilter
            );

            return matchesSearch && matchesBreedFilter && matchesPetFilter;
        });
    }

    return (
        <div className="mt-5">
            <div className="flex flex-row justify-center font-bold text-lg gap-7 my-5">
                <div 
                    onClick={() => setAllReportsTabSelected(true)}
                    className={`cursor-pointer 
                        ${allReportsTabSelected
                         ? "border-b-2 border-red-600"
                         : ""
                    }`}
                >
                    All Reports
                </div>
                <div 
                    onClick={() => setAllReportsTabSelected(false)}
                    className={`cursor-pointer 
                        ${allReportsTabSelected == false
                         ? "border-b-2 border-red-600"
                         : ""
                    }`}
                >
                    My Reports
                </div>
            </div>
                
            {allReportsTabSelected && 
                <AllReports
                    setSearchQuery={setSearchQuery}
                    setBreedFilter={setBreedFilter}
                    setPetFilter={setPetFilter}
                    displayedMissingPets={displayedMissingPets}
                />
            }
            {allReportsTabSelected === false && 
                <UserReports
                    setSearchQuery={setSearchQuery}
                    setBreedFilter={setBreedFilter}
                    setPetFilter={setPetFilter}
                    displayedMissingPets={displayedMissingPets}
                />
            }
        </div>
    )
}



const fillerReports = [
  {
    id: "1",
    additionalInfo: "Very friendly and loves treats",
    breed: "Golden Retriever",
    customBreed: "",
    dateLastSeen: "2026-03-10",
    email: "johnsmith1@gmail.com",
    image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
    ownerName: "John Smith",
    petName: "Buddy",
    petType: "dog",
    phone: "555-123-4567",
    userId: "user_001"
  },
  {
    id: "2",
    additionalInfo: "Shy, may hide under cars",
    breed: "Siamese",
    customBreed: "",
    dateLastSeen: "2026-03-12",
    email: "emilyjones@gmail.com",
    image: "https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg",
    ownerName: "Emily Jones",
    petName: "Luna",
    petType: "cat",
    phone: "555-234-5678",
    userId: "user_002"
  },
  {
    id: "3",
    additionalInfo: "Has a red collar with tag",
    breed: "German Shepherd",
    customBreed: "",
    dateLastSeen: "2026-03-08",
    email: "mikebrown@gmail.com",
    image: "./animalImgs/pomeranian.webp",
    ownerName: "Mike Brown",
    petName: "Max",
    petType: "dog",
    phone: "555-345-6789",
    userId: "user_003"
  },
  {
    id: "4",
    additionalInfo: "Very fluffy, responds to name",
    breed: "",
    customBreed: "Persian Mix",
    dateLastSeen: "2026-03-15",
    email: "sarahlee@gmail.com",
    image: "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg",
    ownerName: "Sarah Lee",
    petName: "Snowball",
    petType: "cat",
    phone: "555-456-7890",
    userId: "user_004"
  },
  {
    id: "5",
    additionalInfo: "Limping slightly on left leg",
    breed: "Bulldog",
    customBreed: "",
    dateLastSeen: "2026-03-18",
    email: "davidwilson@gmail.com",
    image: "https://images.dog.ceo/breeds/bulldog-english/jager-2.jpg",
    ownerName: "David Wilson",
    petName: "Rocky",
    petType: "dog",
    phone: "555-567-8901",
    userId: "user_005"
  },
  {
    id: "6",
    additionalInfo: "Green eyes, very vocal",
    breed: "Maine Coon",
    customBreed: "",
    dateLastSeen: "2026-03-20",
    email: "oliviawhite@gmail.com",
    image: "./animalImgs/cat.webp",
    ownerName: "Olivia White",
    petName: "Leo",
    petType: "cat",
    phone: "555-678-9012",
    userId: "user_006"
  },
  {
    id: "7",
    additionalInfo: "Wearing a blue harness",
    breed: "",
    customBreed: "Labradoodle",
    dateLastSeen: "2026-03-22",
    email: "chrisgreen@gmail.com",
    image: "./animalImgs/pomeranian.webp",
    ownerName: "Chris Green",
    petName: "Charlie",
    petType: "dog",
    phone: "555-789-0123",
    userId: "user_007"
  },
  {
    id: "8",
    additionalInfo: "Very small, may be scared",
    breed: "Chihuahua",
    customBreed: "",
    dateLastSeen: "2026-03-19",
    email: "lauramartin@gmail.com",
    image: "./animalImgs/pomeranian.webp",
    ownerName: "Laura Martin",
    petName: "Bella",
    petType: "dog",
    phone: "555-890-1234",
    userId: "user_008"
  }
];