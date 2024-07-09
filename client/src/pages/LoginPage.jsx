import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post("/login", { email, password });
      setUser(data);
      alert("Login Successful");
      setRedirect(true)
    } catch (e) {
      alert("login Failed");
    }
  }

  if(redirect){
    return <Navigate to={'/'} />;
  }

  return (
    <div className="mt-5 grow flex items-center justify-around">
      <div className="-mt-15">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto mt-3" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            required
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            required
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2">
            Don't have account yet?
            <Link className="underline text-bn" to={"/register"}>
              register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
