

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { getAllUserReports, getUserReport } from "./GetReport"

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

function MissingPetCard({ reportData }) {
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
                    <CardFront reportData={reportData} flipCard={handleCardFlip}/>
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

function CardFront({ reportData, flipCard }) {
    return (
        <div 
            className="flex flex-col bg-white border rounded-lg border-red-500 transition-all duration-1000 ease-in-out 
            hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full"
        >
            <div className="overflow-hidden h-52.5">
                <img 
                    src={reportData.image}
                    alt="Pet Image"
                    className="w-full h-full object-cover"
                />
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

function SearchBar() {
    const [userInput, setUserInput] = useState('');

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    }

    return (
        <div className="flex justify-center flex-col items-center gap-2.5 mb-5">
            <div className="flex items-center rounded-3xl px-2.5 py-1.25 border bg-white hover:shadow-[0_2px_6px_rgb(113,111,111)]">
                <input
                    type="text"
                    placeholder="Search"
                    value={userInput}
                    onChange={handleInputChange}
                    className="border- text-base p-1.5 outline-0 w-112.5"
                />


                <img 
                    src="./searchBarIcons/searchIcon.png" 
                    alt="magnifying glass"
                    className="w-6.25 h-6.25 cursor-pointer ml-1.25"
                />
            </div>

            <button 
                className="border-0 rounded-3xl bg-[#FFB6B6] px-7 py-2.5 font-bold 
                cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#d28e8e]"
            >
                Filter
            </button>
        </div>
    )
}

function AllReports() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        async function loadReports() {
            const data = await getAllUserReports();
            setReports(data);
        }

        loadReports();
    }, [])

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/LostPetReport");
    }

    return (
        <div className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5">

            <h2 className="text-center text-2xl mb-7">
                <div 
                    className="inline-block bg-[rgb(238,235,235)] px-7.5 py-2.5 rounded-md font-bold"
                >
                    Current Lost Pets
                </div>
            </h2>

            <SearchBar/>

            <button 
                className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-3 font-bold cursor-pointer
                ml-5 transitioin-all duration-300 ease-in-out hover:bg-[#c71515]"
                onClick={handleNavigation}
            >
                Create Report
            </button>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className="grid grid-cols-4 gap-6 mt-8">
                {
                    reports.map(report => (
                        <MissingPetCard
                            id={report.id}
                            reportData={report}
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

function UserReports() {
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

    return (
        <div className="bg-[#FFF9F0] min-h-screen pb-12.5 pt-5">

            <h2 className="text-center text-2xl mb-7">
                <div 
                    className="inline-block bg-[rgb(238,235,235)] px-7.5 py-2.5 rounded-md font-bold"
                >
                    Current Lost Pets
                </div>
            </h2>

            <SearchBar/>

            <button 
                className="text-white bg-[#FC1818] rounded-full border-0 px-5 py-3 font-bold cursor-pointer
                ml-5 transitioin-all duration-300 ease-in-out hover:bg-[#c71515]"
                onClick={handleNavigation}
            >
                Create Report
            </button>
            
            {/* Filler image cards. Replace when database is set up */}
            <div className="grid grid-cols-4 gap-6 mt-8">
                {
                    reports.map(report => (
                        <MissingPetCard
                            id={report.id}
                            reportData={report}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default function LostPet() {
    const [allReportsTabSelected, setAllReportsTabSelected] = useState(true);

    return (
        <div className="mt-5">
            <div className="flex flex-row gap-7">
                <div 
                    onClick={() => setAllReportsTabSelected(true)}
                    className={`${allReportsTabSelected} ? "border-b-2" border-red-600`}
                
                >
                    All Reports
                </div>
                <div 
                    onClick={() => setAllReportsTabSelected(false)}
                >
                    My Reports
                </div>
            </div>
            
            {allReportsTabSelected && <AllReports/>}
            {allReportsTabSelected === false && <UserReports/>}
        </div>
    )
}