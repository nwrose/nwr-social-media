import CreateClientside from "./clientside";
import CreateServerside from "./serverside";

const CreatePage:React.FC = async () => {
    const handleFormSubmit = async (formData: FormData) => {
        "use server"
        await CreateServerside(formData);
    }

    return(
        <>
        <div>
            <CreateClientside handleSubmit={handleFormSubmit}/>
        </div>
        </>
    )
}

export default CreatePage;