import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerError, setRegisterError] = useState(null);
    const [registerEmail, setRegisterEmail] = useState(null);
    const validatePassword = (password) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/; // Password validation regex
        return regex.test(password);
    };

    async function registerUser(ev) {
        ev.preventDefault();

        if (!validatePassword(password)) {
            setRegisterError(
                "Password must be 8-16 characters, including 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
            );
            return; // Don't send data to server if validation fails
        }

        try {
            await axios.post("/register", {
                name,
                email,
                password,
            });

            alert("Regestration Sucessfull!");
            <Navigate to={"/login"} />;
        } catch (error) {
            if (error.response && error.response.data) {
                setRegisterEmail(error.response.data.message);
            } else {
                alert("Registration failed!");
            }
        }
    }

    // if(registerError){
    //   setRegisterError(null)
    // }
    // if(registerEmail){
    //   setRegisterEmail(null)
    // }

    return (
        <div className="mt-5 grow flex items-center justify-around">
            <div className="-mt-15">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto mt-3" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="john doe"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => {
                            setEmail(ev.target.value);
                            setRegisterEmail(null);
                        }}
                    />
                    {registerEmail && (
                        <p className="text-red-500">{registerEmail}</p>
                    )}
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(ev) => {
                            setPassword(ev.target.value);
                            setRegisterError(null);
                        }}
                    />
                    {registerError && (
                        <p className="text-red-500">{registerError}</p>
                    )}
                    <button className="primary">Register</button>
                    <div className="text-center py-2">
                        Already have account?
                        <Link className="underline text-bn" to={"/login"}>
                            login now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
