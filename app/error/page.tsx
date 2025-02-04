import { redirect } from "next/navigation";

const Error:React.FC = () => {
    redirect('/');

    return (
        <div>
            Sorry,
        </div>
    )
}

export default Error;