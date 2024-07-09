import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountHeader from "../AccountHeader";

export default function AccountPage(){
    const [redirect, setRedirect] = useState(null);
    const {user, ready, setUser} = useContext(UserContext);
    let {subpages} = useParams();

    if(subpages === undefined){
        subpages = 'profile'
    }

    async function logout(){
        await axios.post('/logout')
        setRedirect('/')
        setUser(null)
    }

    if(!ready){
        return 'Loading...'
    }

    if(!user && ready){
        return <Navigate to={'/login'} />
    }


    // have to look on this redirection
    if(redirect && !user && redirect){
        return <Navigate to={redirect} />
    }

    return (<div>
        <AccountHeader />
        {subpages === 'profile' && (
            <div className="text-center max-w-lg mx-auto mt-8">
                Logged in as {user.name} ({user.email}) <br/>
                <button onClick={logout} className="primary text-white max-w-sm mt-2">Logout</button>
            </div>
        )}
        {subpages === 'places' && (
            <PlacesPage />
        )}
    </div>)
}