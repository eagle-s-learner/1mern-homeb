import { Link } from "react-router-dom";
import AccountHeader from "../AccountHeader";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get("/user-places/").then(({ data }) => {
            setPlaces(data);
        });
    }, []);

    return (
        <div>
            <AccountHeader />
            <div className="text-center mt-6">
                <Link
                    className="bg-gray-500  pr-4 gap-1 inline-flex hover:underline p-2 mx-3 text-white rounded-full"
                    to={"/account/places/new"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Add new place
                </Link>
                <div className="text-left mt-3">Listed Places</div>
            </div>
            <div className="mt-4">
                {places.length > 0 &&
                    places.map((place) => {
                        return (
                            <Link to={'/account/places/'+place._id} key={place.title} className="bg-gray-200 mb-2 cursor-pointer gap-3 p-4 flex rounded-2xl">
                                {/* we can add className grow in img wrapper div */}
                                <div className="w-32 h-32 flex bg-gray-300 shrink-0">
                                    {place.photos.length > 0 && (
                                        <img className="object-cover" src={'http://localhost:5000/uploads/'+place.photos[0]} alt="" />
                                    )}
                                </div>
                                <div className="grow-0 shrink">
                                    <h2 className="text-2xl">{place.title}</h2>
                                    <p className="text-sm mt-2">
                                        {place.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}
