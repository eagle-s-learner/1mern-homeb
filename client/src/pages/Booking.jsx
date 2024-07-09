import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Booking() {
    const { id } = useParams();
    const [booking, setBooking] = useState([]);

    useEffect(() => {
        if (id) {
            axios.get("/user-booking").then((res) => {
                const fBookin = res.data.find(({ _id }) => {return _id === id});
                if (fBookin) {
                    setBooking(fBookin);
                }
            });
        }
    }, [id]);
    return <div className="mt-8 pb-4 px-9 mx-9 rounded-2xl bg-gray-100 shadow-md w-fit">
            <div className="text-xl font-medium">Booked By: {booking.name}</div>
            <div>Phone Number: {booking.phone}</div>
            <div>Date of booking: {new Date().getDate()}-{new Date().getMonth()}-{new Date().getFullYear()}</div>
            <div>Check-In Date: {booking.checkIn}</div>
            <div>Check-Out Date: {booking.checkOut}</div>
            <div className="text-gray-500">Your booking amount &#x20b9;{booking.bookingAmount} has been recived!!</div>
    </div>;
}
