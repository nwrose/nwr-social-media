"use client"
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import JoinFam from "@/app/components/Fams/JoinFam";
import { CldImage } from "@/app/components/UI/Cld";

export default function Famcard({
    is_member,
    fam_data

  }: {
    current_uuid: string,
    is_member: boolean,
    fam_data: {
        fam_id: number,
        name: string,
        owner_username: string,
        description: string,
        created: string,
        filename: string
    }

  }) {
    "use client"

    return (
    <div className="m-2 mb-8 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex flex-col items-center justify-between w-[80%] md:w-[40%] xl:w-[27%]">
        <div className="flex flex-col items-center w-full">
            <Link href={`/fams/${fam_data.fam_id}`} className="flex flex-col items-center w-full rounded-t-lg">
                <div className="text-lg font-bold text-white bg-blue-600 w-full rounded-t-lg p-4 shadow-md text-center">
                    {fam_data.name}
                </div>
                <div className="relative w-40 h-40 rounded-full border-4 border-blue-400 overflow-hidden m-1">
                    <CldImage 
                        src={fam_data.filename} 
                        alt={""}
                        fill 
                        style={{ objectFit: 'cover' }} 
                        sizes="160px"
                    />
                </div>
            </Link>
            <div className="text-sm text-gray-600 mx-4">
                <span className="flex flex-col items-center mb-2"> 
                    Created {formatDistanceToNow(new Date(fam_data.created), { addSuffix: true })} <a href={`/users/${fam_data.owner_username}`} className="hover:text-blue-600"><span className="text-gray-600">by </span> {fam_data.owner_username}</a>
                </span>
            </div>
            <div className="text-sm md:text-base text-black mx-4">
                {fam_data.description}
            </div>
        </div>
        <JoinFam fam_id={fam_data.fam_id} is_member={is_member}/>
    </div>
    );
}
  
