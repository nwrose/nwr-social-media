import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Edit:React.FC = () => {
    const handleLogout = async () => {
        "use server"

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        let { error } = await supabase.auth.signOut();
        if(error){
            console.log("error while logging out:", error);
            redirect("/error");
        }
        console.log("sucessful logout!");
        redirect("/accounts/login");
    }

    return(
        <>
        <div>
            <p>Edit page idk</p>
            <form onSubmit={handleLogout}>
                <button type="submit" className="bg-red"> Logout</button>
            </form>
        </div>
        </>
    )
}



export default Edit;