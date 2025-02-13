"use client"

export default function AspectChange(){
    "use client"

    return (
        <button 
            className="w-full py-2 my-4 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition"
            onClick={() => alert("Better crop control is in the works!")}
        >
            Edit Crop
        </button>
    )
}