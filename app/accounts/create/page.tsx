import CreateClientside from "./clientside";
import CreateServerside from "./serverside";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const CreatePage:React.FC = async () => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
        redirect('/');
    }

    const handleFormSubmit = async (formData: FormData) => {
        "use server"
        await CreateServerside(formData);
    }

    return(
        <>
        <div>
            <CreateClientside handleSubmit={handleFormSubmit}/>
        </div>
        </>
    )
}

export default CreatePage;