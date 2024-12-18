'use server'

import LoginPage from "./clientside";
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Login(){
	const supabase = await createClient();

	// verify user not logged in
	const { data: { user } } = await supabase.auth.getUser();
	if(user) {
		redirect('/');
	}

	return(
		<LoginPage/>
	)
}