import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Ceating a handler for GET request to route /auth/confirm
export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = '/' // redirect to index page

    // create redirect link without secret token
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete('token_hash');
    redirectTo.searchParams.delete('type');

    let supaError;
    if(token_hash && type){
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({ type, token_hash, });

        if(!error){
            redirectTo.searchParams.delete('next');
            return NextResponse.redirect(redirectTo);
        }
        else{
            supaError = error;
        }
    }

    // otherwise error
    console.log("error in auth/confirm GET route:");
    if(!token_hash) console.log("no token hash");
    if(!type) console.log("no type");
    if(supaError) console.log("supabase Error:", supaError);

    redirectTo.pathname = '/error';
    return NextResponse.redirect(redirectTo);
}