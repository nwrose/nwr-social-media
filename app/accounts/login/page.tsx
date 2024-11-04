import { login, signup } from "./actions";

export default function LoginPage() {
    return(
        <>
        <div>
            <div>
                <p> Login </p>
            </div>
            <div>
                <form>
                    <label htmlFor='email'>Email:</label> <input type="email" name="email" placeholder="Email" />
                    <label htmlFor='password'>Password:</label> <input type="password" name="password" placeholder="Password" />
                    <button formAction={login}> Login </button>
                    <div>
                        <p> Don't Have an account? </p>
                        <button formAction={signup}>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}