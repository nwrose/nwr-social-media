"use client"

import { CldImage } from "@/app/components/UI/Cld"

export default function PFP({filename}: {filename: string}){
    "use client"
    
    return(
        <div style={{ width: 36, height: 36, position: 'relative', overflow: 'hidden' }} className="rounded-full border-2 border-blue-400 my-2 shadow-xl hover:border-blue-500">
            <CldImage
                src={filename}
                alt='pfp'
                fill
                style={{ objectFit: 'cover' }}
                sizes="36px"
            />
        </div>
    )
}