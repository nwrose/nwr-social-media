import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
    const supabase = await createClient();

    // check if user logged in
    const { data: {user}, } = await supabase.auth.getUser();
    if(user){
        await supabase.auth.signOut();
    } 

    revalidatePath('/', 'layout');
    return NextResponse.redirect(new URL('/accounts/login', req.url), {status: 302});
}