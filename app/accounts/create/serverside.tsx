"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function CreateServerside(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const filename = formData.get("pfp-filename") as string;

  if(!name || !username || !email || !password){
    console.log("\nerror on retreiving form data!! \n");
    redirect('/error');
  }
  else if(!filename){
    console.log("\nerror while retreiving form filename\n");
    redirect('/error');
  }
  else if(password != confirmPassword){
    console.log("passwords don't match");
    redirect('/accounts/create/?passwords-must-match');
  }

  // attempt auth and error if fail
  {
    const { error } = await supabase.auth.signUp({ email: email, password: password, });

    if(error){
      console.log("error with signup: ", error);
      redirect('/error');
    }
  }

  // send name, username, email, pfp-filename data to users table in DB
  {
    const { data, error } = await supabase.from('users').insert({
      username: username,
      fullname: name,
      email: email,
      filename: filename,
    }).select()

    if(error){
      console.log("error while inserting user into users table:", error);
      redirect('/errror');
    }
    else{
      console.log("successful data upload:", data);
    }
  }

  revalidatePath('/', 'layout');
  redirect('/accounts/edit');
};


export async function validateEmailUser(email: string, username: string){
  "use server"

  let usernameResult : "GOOD" | "SHORT" | "SPACE" | "TAKEN";
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("validate_email_username", {in_email: email.trim(), in_username: username.trim()});
  if(error){
    console.log("error validating email or username:", error);
    redirect('/error');
  }

  const validationResult: {
    email_available: boolean;
    username_available: boolean;
  } = data[0];

  if(username.length < 3){
    usernameResult = "SHORT";
  }
  else if(username.match(/\s/) !== null){
    usernameResult = "SPACE";
  }
  else if(!validationResult.username_available){
    usernameResult = "TAKEN";
  }
  else{
    usernameResult = "GOOD";
  }

  return{
    email_available: validationResult.email_available,
    username_status: usernameResult
  };
} 