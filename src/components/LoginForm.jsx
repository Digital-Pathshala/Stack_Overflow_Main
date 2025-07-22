import { useState } from "react";

const LoginForm = () =>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("Login info:", email, password);
    }

    return(
        <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input type= "email"
            value= {email}
            onChange={(e)=> setEmail(e.target.value)}
            required
            /><br/>
            
        <label>Password:</label>
        <input
        type="password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        required
        />

        <button type="submit">Login</button>

        </form>
    )

}