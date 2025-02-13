"use client"


export default function Modal({message, onCancel, onConfirm, loading}
    : { message: string | React.ReactNode; onCancel: () => void; onConfirm: () => void; loading: boolean;}) {
    "use client"
    
    return (
        
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}>
            <div className="bg-white p-6 rounded-lg shadow-gray-500 w-[90%] max-w-md opacity-100">
                <div className="mb-6 text-center">
                    {message}
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={onCancel}
                        className="bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg shadow text-white ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                        }`}
                    >
                        {loading ? 'Processing...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}