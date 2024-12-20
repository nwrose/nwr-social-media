import AccountForm from './edit-account-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { Sidebar } from '@/app/components';

export default async function Account() {
  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();
  if(!user){
    redirect('/accounts/login');
  }

  const {data, error, status} = await supabase.from('users').select('username').eq('uuid', user.id).single();
  if(error){
    console.log("error fetching current username:", error);
    redirect('/error');
  }
  const username = data?.username;
  
  return (
  <>
    <div className='w-[100%] min-h-screen flex bg-gray-50'>
      <Sidebar username={username}/>
      <AccountForm user={user} />
    </div>
  </>)  
}