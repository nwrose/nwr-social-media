"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";


export async function CreateServerside(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword");
  const pfp = formData.get("pfp") as File;

  if(!name || !username || !email || !password){
    console.log("\nerror on retreiving form data!! \n");
    redirect('/error');
  }
  else if(!pfp){
    console.log("\nerror while retreiving form file\n");
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

  // save file in static images and keep the filename for database
  const buffer = Buffer.from(await pfp.arrayBuffer());
  const filename = Date.now() + pfp.name.replaceAll(" ", "_");
  console.log(`\nsaving pfp with filename: ${filename}\n`);
  try {
    await writeFile(
      path.join(process.cwd(), "public/pfps/" + filename), 
      buffer
    ); 
  } catch (error) {
    console.log("Error occurred while saving pfp image:\n", error, "\n");
    redirect("/error");
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


export async function validateEmailUser(email: string, username:string){
  "use server"

  console.log("in_email:", email, "--in_username:", username,email,username);

  const supabase = await createClient();
  const {data, error} = await supabase.rpc("validate_email_username", {in_email: email.trim(), in_username: username.trim()});
  if(error){
    console.log("error validating email or username:", error);
    redirect('/error');
  }

  console.log("data", data);

  const validationResult: {
    email_available: boolean;
    username_available: boolean;
  } = data[0];

  console.log("validation_result: ", validationResult);

  return {
    email: validationResult.email_available, 
    username: validationResult.username_available
  };
} 