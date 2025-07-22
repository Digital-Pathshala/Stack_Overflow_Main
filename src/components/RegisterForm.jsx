import { useState } from "react";

const RegisterForm = () => {

    const [name,SetName] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log("Register Info:", {name, email, password})
    }

    return(
        <form onSubmit={handleSubmit}>
            <label></label>
        </form>
    )
}