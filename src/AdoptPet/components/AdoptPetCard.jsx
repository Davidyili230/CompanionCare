


export default function AdoptPetCard({ reportData, isCurrentTabAllReports }) {
    return (
        <div className="flex flex-col border rounded-2xl overflow-hidden bg-white
        transition-all duration-300 hover:translate-y-1.25 hover:shadow-md">
            <TopCard reportData={reportData}/>
            <BottomCard reportData={reportData}/>
        </div>
    );
}

function TopCard({ reportData }) {
    return (
        <div className="overflow-hidden h-52.5 relative shrink-0">
            <img
                src={reportData.img}
                alt="Pet Image"
                className="w-full h-full object-cover"
            />

            <span className="absolute bottom-2.5 left-3 font-bold text-sm bg-gray-300 rounded-2xl px-1.5 py-0.5">
                {reportData.name}
            </span>

            <span className="absolute bottom-2.5 right-3 font-semibold text-sm bg-gray-300 rounded-full px-1.5 py-0.5">
                {reportData.age} years old
            </span>
        </div>
    );
}

function BottomCard({ reportData }) {
    return (
        <div className="flex flex-col px-3 pt-2 gap-2">
            <div>
                <p className="font-bold text-sm">{reportData.breed}</p>
                <p className="text-xs">{reportData.species}</p>
            </div>

            <div>
                <span className="px-1.5 py-0.5 bg-green-300 rounded-full  text-sm">
                    {reportData.city}, {reportData.state}
                </span>
            </div>

            <div className="border-t">
                <p className="overflow-scroll text-sm pt-2 h-20">
                    {reportData.notes}
                </p>
            </div>

            <button className="border rounded-2xl text-sm text-white font-bold bg-green-500
            py-2 mb-3 transition-all duratioin-300 hover:bg-green-600 cursor-pointer">
                Contact Center
            </button>
        </div>
    );
}