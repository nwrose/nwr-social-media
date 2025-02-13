"use client"


export default function CaptionChange(){
    "use client"

    return (
        <button 
            className="w-full py-2 my-4 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition"
            onClick={() => alert("caption support coming soon!")}
        >
            Edit caption
        </button>
    )
}

