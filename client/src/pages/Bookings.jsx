import { useEffect, useState } from "react";
import AccountHeader from "../AccountHeader";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Bookings() {
    const [userBookings, setUserBookings] = useState([]);
    useEffect(() => {
        axios.get("/user-booking").then((res) => {
            console.log(res.data)
            setUserBookings(res.data);
        });
    }, []);
    return (
        <div>
            <AccountHeader />
            <div className="my-2 text-2xl ">Booked Places</div>
            <div className="my-2">
                {userBookings.length > 0 &&
                    userBookings.map((booking) => {
                        return (
                            <Link to={'/account/bookings/'+booking._id}
                                key={booking._id}
                                className="flex gap-4 my-4 rounded-2xl bg-slate-300 overflow-hidden"
                            >
                                <div>
                                    <img
                                        className="object-cover"
                                        src={
                                            "http://localhost:5000/uploads/" +
                                            booking.placeId.photos[0]
                                        }
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl py-2">
                                        {booking.placeId.title}
                                    </h2>
                                    {format(
                                        new Date(booking.checkIn),
                                        "yyyy-MM-dd"
                                    )}{" "}
                                    to{" "}
                                    {format(
                                        new Date(booking.checkOut),
                                        "yyyy-MM-dd"
                                    )}
                                    <br/>
                                {booking.placeId.address}
                                <div className="font-bold text-gray-700">
                                    <p>Booking Amount: &#x20b9;
                                    {booking.bookingAmount}</p>
                                </div>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}
