import { useState } from "react";
import { deleteReport } from "../databaseAccess/DeleteReport";
import { getUserReport } from "../databaseAccess/GetReport";


export default function MissingPetCard({ reportData, isUserDisplay, setReports }) {
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleCardFlip = () => {
        setIsCardFlipped(!isCardFlipped);
    }

    return (
        <div className="w-85 h-105 perspective">
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
    async function handleDeleteReport(id, imageUrl) {
        try {
            await deleteReport(id, imageUrl);
            const newReports = await getUserReport();
            setReports(newReports);
        } catch (error) {
            console.log("Error deleting and getting new reports", error);
        }
    }

    return (
        <div 
            className="flex flex-col bg-white rounded-2xl transition-all 
            duration-1000 ease-in-out hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full"
        >
            <div className="overflow-hidden h-52.5 relative shrink-0">
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
                        onClick={() => handleDeleteReport(reportData.id, reportData.image)}
                    >
                        Delete Report
                    </button>
                }
            </div>
            
            <div className="px-2.5 py-2 flex-1 flex flex-col">
                <div>
                    <p className="font-bold text-xl">{reportData.petName}</p>
                    <div className="font-medium text-xs mt-0.5 text-green-500">
                        <span>{reportData.customBreed == "" ? reportData.breed : reportData.customBreed}</span>
                        {" · "}
                        <span className="capitalize">{reportData.petType}</span>
                    </div>
                </div>


                <div className="mb-1.5">
                    <span className="text-green-800 text-xs">Last seen {reportData.dateLastSeen}</span>
                </div>
                

                <div className="border-t pt-1 max-h-20 overflow-y-scroll ">
                    <span className="text-xs">
                        {reportData.additionalInfo}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center mt-2.5">
                <button 
                    onClick={flipCard}
                    className="rounded-lg border-0 bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold px-2.5 py-1.5 
                    cursor-pointer transition-colors duration-300 ease-in-out w-4/5 mb-5"
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
            className="bg-white rounded-2xl border-none transition-all duration-1000 ease-in-out 
            cursor-pointer hover:-translate-y-1.25 hover:shadow-2xl overflow-hidden h-full 
            flex flex-col  p-4 gap-5"
        >

            <div className="flex flex-row items-center gap-5 border-b pb-5">
                <img
                    src={reportData.image}
                    alt={`${reportData.petName}'s image`}
                    className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                    <p className="font-bold">{reportData.petName}</p>
                    <p className="text-xs">{reportData.customBreed == "" ? reportData.breed : reportData.customBreed}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="font-bold ">Contant the Owner</p>
                
                <div className="space-y-2 text-md">
                    <div className="bg-green-100 rounded-xl px-4 py-2.5 text-sm w-full">
                        <label className="font-bold">Name: </label>
                        <span>{reportData.ownerName}</span>
                    </div>

                    <div className="flex justify-center gap-1">
                        {
                            reportData.email != "" 
                            &&
                            <>
                                <div className="bg-green-100 rounded-xl px-4 py-2.5 text-sm w-full">
                                    <label className="font-bold">Email Address: </label>
                                    <span>{reportData.email}</span>
                                </div>
                            </>
                        }
                    </div>

                    <div className="flex justify-center gap-1">
                        {
                            reportData.phone != "" 
                            &&
                            <>
                                <div className="bg-green-100 rounded-xl px-4 py-2.5 text-sm w-full">
                                    <label className="font-bold">Phone Number: </label>
                                    <span>{reportData.phone}</span>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center mt-10">
                <button 
                    onClick={flipCard}
                    className="rounded-lg border-0 bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold px-2.5 py-1.5 
                    cursor-pointer transition-colors duration-300 ease-in-out w-4/5 mb-5"
                >
                    Back
                </button>
            </div>
        </div>
    )
}