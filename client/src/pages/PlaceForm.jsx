import { useEffect, useState } from "react";
import PhotosUpload from "../PhotosUpload";
import Perks from "../Perks";
import axios from "axios";
import AccountHeader from "../AccountHeader";
import { Navigate, useParams } from "react-router-dom";

export default function PlaceForm() {
    const { id } = useParams();
    const [address, setAddress] = useState("");
    const [title, setTitle] = useState("");
    const [photos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [maxGuests, setMaxGuest] = useState("");
    const [perNightCharge, SetPerNightCharge] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get("/places/" + id).then((res) => {
            const { data } = res;
            setTitle(data.title);
            setAddress(data.address);
            setDescription(data.description);
            setExtraInfo(data.extraInfo);
            SetPerNightCharge(data.perNightCharge);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuest(data.maxGuests);
            setAddedPhotos(data.photos);
            setPerks(data.perks);
        });
    }, []);

    async function savePlace(ev) {
        ev.preventDefault();
        if (id) {
            // updated existing place
            const postInfo = {
                id,
                address,
                title,
                // addedPhotos
                photos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                perNightCharge,
            };
            await axios.put("/places/", postInfo);
            setRedirect(true);
        } else {
            const postInfo = {
                address,
                title,
                photos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                perNightCharge,
            };
            await axios.post("/places", postInfo);
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={"/account/places"} />;
    }
    return (
        <>
            <div>
                <AccountHeader />
                <div className="mt-2 font-bold">Add new place</div>
                <form onSubmit={savePlace}>
                    <h2 className="text-xl mt-4">Title</h2>
                    <input
                        type="text"
                        placeholder="helooo"
                        value={title}
                        onChange={(ev) => setTitle(ev.target.value)}
                    ></input>
                    <h2 className="text-xl mt-4">Address</h2>
                    <input
                        type="text"
                        placeholder="address"
                        value={address}
                        onChange={(ev) => setAddress(ev.target.value)}
                    ></input>
                    <h2 className="text-xl mt-4">Photos</h2>
                    <PhotosUpload
                        addedPhotos={photos}
                        onChangeAddedPhotos={setAddedPhotos}
                    />

                    <h2 className="text-2xl mt-4">Description</h2>
                    <textarea
                        className="rounded-full p-4"
                        placeholder="Add description about the place"
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)}
                    />
                    <h2 className="text-2xl mt-4">Perks</h2>
                    <div className="gap-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks} />
                    </div>
                    <h2 className="text-2xl mt-4">Extra Info</h2>
                    <textarea
                        className="rounded-full p-4"
                        placeholder="Add Extra Info"
                        value={extraInfo}
                        onChange={(ev) => setExtraInfo(ev.target.value)}
                    />
                    <h2 className="text-2xl mt-4">
                        Check In&Out Time, Maximum guests{" "}
                    </h2>
                    <div className="mx-2 grid sm:grid-cols-3 gap-2">
                        <div>
                            <h3>Check In Time</h3>
                            <input
                                type="text"
                                placeholder="15:00"
                                value={checkIn}
                                onChange={(ev) => setCheckIn(ev.target.value)}
                            />
                        </div>
                        <div>
                            <h3>Check Out Time</h3>
                            <input
                                type="text"
                                placeholder="15:00"
                                value={checkOut}
                                onChange={(ev) => setCheckOut(ev.target.value)}
                            />
                        </div>
                        <div>
                            <h3>Maximun Guests</h3>
                            <input
                                type="number"
                                placeholder="3"
                                value={maxGuests}
                                onChange={(ev) => setMaxGuest(ev.target.value)}
                            />
                        </div>
                        <div>
                            <h3>Per night &#x20b9;</h3>
                            <input
                                type="number"
                                placeholder="&#x20b9; 1000"
                                value={perNightCharge}
                                onChange={(ev) => SetPerNightCharge(ev.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mx-10">
                        <button className="primary">Save</button>
                    </div>
                </form>
            </div>
        </>
    );
}
