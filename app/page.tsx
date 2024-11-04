import Feed from "@/components/feed";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const Home:React.FC = async () => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if(!user) {
        redirect('/accounts/login/');
    }

    const editRedirect = () => {
        redirect('/accounts/edit');
    }

    return (
        <div>
            SUCCESSFUL LOGIN for user, NOW DISPLAYING FEED
            <Link href="/accounts/edit">Edit Account</Link>
        </div>
    );
}    

export default Home;




//e97033af-7567-48e9-acc6-6395961452f7
//e97033af-7567-48e9-acc6-6395961452f7


