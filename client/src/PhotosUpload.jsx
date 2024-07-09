import axios from "axios";
import { useState } from "react";

export default function PhotosUpload({ addedPhotos, onChangeAddedPhotos }) {
    const [photoLink, setPhotoLink] = useState("");

    async function addPhotoByLink(ev) {
        ev.preventDefault();

        try {
            const { data: fileName } = await axios.post("/upload-by-link", {
                link: photoLink,
            });
            onChangeAddedPhotos((prev) => {
                return [...prev, fileName];
            });
            setPhotoLink("");
        } catch (error) {
            console.log(error);
        }
    }

    function uploadPhoto(ev) {
        ev.preventDefault();
        const files = ev.target.files;
        // console.log({files})
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append("photos", files[i]);
        }
        axios
            .post("/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                const { data: filenames } = response;
                onChangeAddedPhotos((prev) => {
                    return [...prev, ...filenames];
                });
            });
    }

    function deletePhoto(ev, link) {
        ev.preventDefault();
        onChangeAddedPhotos((prev) => {
            const newPhoto = [];
            for (let i = 0; i < prev.length; i++) {
                if (prev[i] !== link) {
                    newPhoto.push(prev[i]);
                }
            }
            return newPhoto;
        });
    }
    function favPhoto(ev,link) {
        ev.preventDefault();
        onChangeAddedPhotos((prev) => {
            const newPhoto = [];
            for (let i = 0; i < prev.length; i++) {
                if (prev[i] === link) {
                    let a = prev[0]
                    prev[0] = link;
                    prev[i] = a;
                }
                newPhoto.push(prev[i])
            }
            return newPhoto;
        });
    }
    return (
        <>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="add photos using links"
                    value={photoLink}
                    onChange={(ev) => setPhotoLink(ev.target.value)}
                ></input>
                <button
                    className="bg-gray-200 px-2 rounded-2xl"
                    onClick={(ev) => addPhotoByLink(ev)}
                >
                    Add photo
                </button>
            </div>

            <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {addedPhotos.length > 0 &&
                    addedPhotos.map((link) => {
                        return (
                            <div
                                className="h-32 flex relative group"
                                key={link}
                            >
                                <img
                                    className="rounded-2xl w-full object-cover"
                                    src={
                                        "http://localhost:5000/uploads/" + link
                                    }
                                    alt=""
                                />
                                <button
                                    className="absolute bottom-1 left-1 hidden group-hover:block rounded-full"
                                    onClick={(ev) => deletePhoto(ev, link)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-7 h-7 text-white text-9xl bg-black border-red-400 border-2 rounded-full"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="absolute top-1 right-1 hidden group-hover:block rounded-full"
                                    onClick={(ev) => favPhoto(ev, link)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-7 h-7 text-white text-9xl bg-black border-red-400 border-2 rounded-full active:text-purple-700"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                <label className="h-32 cursor-pointer flex items-center justify-center gap-1 bg-transparent rounded-2xl p-4 border-solid border-2">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={uploadPhoto}
                    />
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
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    upload
                </label>
            </div>
        </>
    );
}
