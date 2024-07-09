import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [homePage, setHomePage] = useState([]);
    useEffect(() => {
        axios.get("/home-places").then((res) => {
            // console.log(res.data);
            setHomePage(res.data);
        });
    }, []);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-9">
            {homePage.length > 0 &&
                homePage.map((home) => {
                    return (
                        <Link to={'/home/'+home._id} className="hover:translate-x-2 hover:translate-y-2 hover:transition duration-150 ease-in-out m-auto border-4 p-1 bg-slate-200 rounded-2xl mb-2" key={home._id}>
                            <div className="rounded-2xl flex">
                                {home.photos?.[0] && (
                                    <img className="rounded-2xl object-cover aspect-square"
                                        src={
                                            "http://localhost:5000/uploads/" +
                                            home.photos?.[0]
                                        }
                                        alt=""
                                    />
                                )}
                            </div>
                            <h2 className="text-md text-gray-700">{home.title}</h2>
                            <h3 className="font-bold">{home.address}</h3>
                            <h3 className="font-sm text-gray-500">Per night <span className="font-bold">&#x20b9;{home.perNightCharge}</span></h3>
                        </Link>
                    );
                })}
        </div>
    );
}
