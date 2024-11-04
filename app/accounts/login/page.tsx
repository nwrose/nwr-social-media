import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const Login:React.FC = async () => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
        redirect('/');
    }

    const loginAction = async (formData: FormData) => {
        "use server"

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        let { data, error } = await supabase.auth.signInWithPassword({email: email, password: password});
        if(error){
            console.log("\n login error:", error, "\n");
            redirect("/error");
        }
        redirect("/");
    }

    return(
        <>
        <div>
            <div>
                <p> Login </p>
            </div>
            <div>
                <form action={loginAction}>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit"> Login </button>
                </form>
            </div>
            <div>
                <p> Don't Have an account? </p>
                <a href="/accounts/create/">
                    <div> Sign Up </div> 
                </a>
            </div>
        </div>
        </>
    )
}

export default Login;