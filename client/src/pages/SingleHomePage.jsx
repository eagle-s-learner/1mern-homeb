import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function SingleHomePage() {
    const { id } = useParams();
    const [homeById, setHomeById] = useState([]);
    const [morePhotos, setMorePhotos] = useState(true);
    const [bookingCheckIn, setBookingCheckIn] = useState("");
    const [bookingCheckOut, setBookingCheckOut] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [dilogeBox, setDilogeBox] = useState(true);
    const [redirect, setRedirect] = useState('');
    // const [comp , setComp] = useState(false);
    const {user} = useContext(UserContext)
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            setName(user.name)
        }
    }, [user])

    useEffect(() => {
        if (!id) {
            return;
        }

        axios.get("/places/" + id).then((res) => {
            // console.log(res.data)
            setHomeById(res.data);
        });
    }, [id]);

    function showPhotos(ev) {
        ev.preventDefault();
        setMorePhotos((prev) => {
            return prev ? false : true;
        });
    }

    function closeDilogeBox(ev) {
        ev.preventDefault();
        setDilogeBox((prev) => {
            return prev ? false : true;
        });
    }

    let totalPrice = "";
    let totalDays = "";

    if (bookingCheckIn && bookingCheckOut) {

        if((bookingCheckIn > bookingCheckOut) || new Date(bookingCheckIn).getDate() < new Date().getDate() || new Date(bookingCheckOut).getDate() < new Date().getDate()){
            alert('Please fill all the data correctly!!')
            setBookingCheckIn('');
            setBookingCheckOut('')
            return
        }else{
        totalDays =
            new Date(bookingCheckOut).getDate() -
            new Date(bookingCheckIn).getDate();
        totalPrice = totalDays * homeById.perNightCharge;
        if(totalDays === 0){
            totalPrice = homeById.perNightCharge;
        }
        }
    }

    async function confirmBooking(ev){
        console.log('start')
        if (name === '') {
            navigate('/login');
            return; // Optionally, you can return here to prevent further execution
          }
        if(phone === '' ){
            alert('Please fill the every detial correctly before booking!!')
            return;
        }

        const {data} = await axios.get(`/checkdate/?id=${id}&checkIn=${bookingCheckIn}`)

        let cmp = false;

        let y2;
        let m2;
        let d2;
        if(data.length > 0){
            data.every((obj) => {
                y2 = Number(new Date(obj.checkOut).getFullYear())
                m2 = Number(new Date(obj.checkOut).getMonth())
                d2 = Number(new Date(obj.checkOut).getDate())
                
                let y = Number(new Date(bookingCheckIn).getFullYear())
                let m = Number(new Date(bookingCheckIn).getMonth())
                let d = Number(new Date(bookingCheckIn).getDate())
                
                let y1 = Number(new Date(obj.checkIn).getFullYear())
                let m1 = Number(new Date(obj.checkIn).getMonth())
                let d1 = Number(new Date(obj.checkIn).getDate())
                
                if(y < y2 || m < m2 || d < d2){
                    // setComp(true)
                    cmp = true;
                }
                if(y > y1 || m > m1 || d > d1){
                    cmp = true;
                    // setComp(true)
                }
                
            })
        }
        // console.log(comp);
        if(cmp){
            alert(`Occupied!! Please choose Date after ${y2}-${m2}-${d2}`)
            // setComp(false)
            return;
        }
        

        const amount = totalPrice * 100;
        const currency = 'INR';
        const receiptId = homeById._id;
        
        const response = await axios.post('/order', {
            amount, currency, receipt: receiptId
        })

        const order = await response.data;
        console.log(order);

        var option = {
            key: '',
            amount,
            currency,
            name: 'Shelter',
            description: 'Booking Transaction',
            image:'',
            order_id: order.id,
            handler: async function(response){
                const body = {...response,}
                
                const validateResponse = await axios.post('/validate', body)
                
                const jsonResponse = await validateResponse.data;
                console.log(jsonResponse);
                const {data} = await axios.post('/user-booking', {
                    placeId: homeById._id, checkIn: bookingCheckIn, checkOut: bookingCheckOut, bookingAmount: totalPrice, name, phone
                })
                
                const bookingId = data._id;
                
                setRedirect('/account/bookings/'+bookingId)
            },
            prefill: {
                name,
                email: user.email,
                contact: phone,
            },
            notes: {
                address: 'Razorypay comapny office'
            },
            theme:{
                color: '#2f2d3d',
            },
        }
        
        var rzpl = new Razorpay(option);
        rzpl.on('payment.failed', function(response) {
            console.log(response)
            alert('Transaction failed')
        })
        
        rzpl.open();
        ev.preventDefault();
        
        
    }
    // if(comp){
    //     setComp(false);
    // }
    
    if(redirect){
        return <Navigate to={redirect} />
    }

    // if(!homeById) return;
    // console.log(homeById)
    return (
        <div className="mt-8 pb-4 px-9 mx-9 rounded-2xl bg-gray-100 shadow-md">
            <div className="text-2xl border-2 rounded-md p-2 shadow-md my-2 w-fit">{homeById.title}</div>
            <span className="font-9xl">•</span>
            <a
                target="_blank"
                className="underline hover:text-red-500"
                href={"https://www.google.com/maps?q=" + homeById.address}
            >
                {homeById.address}
            </a>
            <div className="grid gap-2 grid-cols-[2fr_1fr] object-fill">
                <div className="aspect-square">
                    {homeById.photos?.[0] && (
                        <img
                            className="object-cover w-full h-full rounded-xl"
                            src={
                                "http://localhost:5000/uploads/" +
                                homeById.photos?.[0]
                            }
                            alt=""
                        />
                    )}
                </div>
                <div className="grid gap-2">
                    {homeById.photos?.[1] && (
                        <img
                            className="object-cover w-full h-full rounded-xl"
                            src={
                                "http://localhost:5000/uploads/" +
                                homeById.photos?.[1]
                            }
                            alt=""
                        />
                    )}

                    {homeById.photos?.[2] && (
                        <img
                            className="object-cover w-full h-full rounded-xl"
                            src={
                                "http://localhost:5000/uploads/" +
                                homeById.photos?.[2]
                            }
                            alt=""
                        />
                    )}
                </div>
            </div>
            <button
                onClick={showPhotos}
                className="active:bg-red-500 p-1 rounded-md mt-1 bg-blue-500 text-white"
            >
                {morePhotos ? "Show more photos" : "less"}
            </button>
            {!morePhotos && (
                <div className="grid grid-cols-3 gap-2">
                    {homeById.photos?.length > 0 &&
                        homeById.photos.map((photo) => {
                            return (
                                <img
                                    // className="object-cover w-full h-full"
                                    key={photo}
                                    src={
                                        "http://localhost:5000/uploads/" + photo
                                    }
                                    alt=""
                                />
                            );
                        })}
                </div>
            )}
            <div>
                {/* <h2 className="text-2xl">Description</h2> */}
                {homeById.description}
            </div>
            <br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-gray-100 rounded-2xl p-2 relative">
                    Check-In Time: {homeById.checkIn}
                    <br />
                    Check-Out Time: {homeById.checkOut}
                    <br />
                    Maximum Guest Allowed: {homeById.maxGuests} <br />
                    {bookingCheckIn && bookingCheckOut && dilogeBox && (
                        <div className="bg-slate-500 text-black mt-2 p-3 rounded-2xl relative">
                            <button onClick={closeDilogeBox}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 right-2"
                            >
                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                            </svg>
                            </button>

                            <h2 className="text-2xl">Personal Information</h2>
                            <label>Name</label>
                            <input
                                type="text"
                                value={name}
                                disabled
                                required
                                onChange={(ev) => setName(ev.target.value)}
                            />
                            <label>Phone Number</label>
                            <br />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(ev) => setPhone(ev.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-2xl">
                    <div className="text-center m-2">
                        Price: &#x20b9;{homeById.perNightCharge}/night
                        <br />
                        <div className="mb-2">
                            <label>Check-In: </label>
                            <input
                                type="date"
                                value={bookingCheckIn}
                                onChange={(ev) =>
                                    setBookingCheckIn(ev.target.value)
                                }
                            />
                        </div>
                        <div className="mb-2">
                            <label>Check-Out: </label>
                            <input
                                type="date"
                                value={bookingCheckOut}
                                onChange={(ev) =>
                                    setBookingCheckOut(ev.target.value)
                                }
                            />
                        </div>
                        <button onClick={confirmBooking} className="bg-green-400 rounded-xl text-white p-3 w-full shadow-gray-400">
                            Book
                            {bookingCheckIn && bookingCheckOut && (
                                <span> &#x20b9;{totalPrice}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <div className="text-center mt-4">
                <span className="text-2xl">More Information About Place</span>
                <br />
                {homeById.extraInfo}
            </div>
            <br/>
            {homeById.perks?.length > 0 && <div>
                <div className="text-2xl border-2 rounded-md p-2 shadow my-2 w-fit box-content">Avilable Facilities</div>
                {homeById.perks.map((perk) => {
                    return <div key={perk} className="text-gray-400">-{perk}</div>
                })}
            </div>}
        </div>
    );
}