import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";


export default function Header() {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [textBoxValue, setTextBoxValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [homePage, setHomePage] = useState([]);

  useEffect(() => {
    axios.get("/home-places").then((res) => {
      setHomePage(res.data);
    });
  }, []);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    setTextBoxValue(''); 
  };

  const handleChange = (event) => {
    setTextBoxValue(event.target.value.toLowerCase()); 
  };

  const searchPlaces = (searchText) => {
    if (searchText) {
      const filteredResults = homePage.filter((place) =>
        place.title.toLowerCase().includes(searchText) ||
        place.address.toLowerCase().includes(searchText)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]); 
    }
  };

  useEffect(() => {
    searchPlaces(textBoxValue); 
  }, [textBoxValue]);
    return (
        <header className=" flex justify-between">
        <Link to={'/'} href="" className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="font-bold text-xl">Shelter</span>
        </Link>

        <div className="flex gap-2 border border-gray-300 rounded-xl py-2 px-4 shadow-md shadow-gray-300">
          <Link to={'/'}>For Rent</Link>
          <div className="border-l border-gray-300"></div>
          <Link>For sale</Link>
          <button className="bg-primary text-white p-1 rounded-full" onClick={handleButtonClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          {isOpen && (
        <div className="text-box-container">
          <input
            type="text"
            value={textBoxValue}
            onChange={handleChange}
            placeholder="Enter place..."
            className="text-box" 
          />
        </div>
      )}
        </div>

        <Link to={user ? '/account' :'/login'} className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-600 overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 relative top-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          {!!user && (
            <div>
              {user.name}
            </div>
          )}
        </Link>
        {isOpen && (
        <div className="search-results absolute top-24 w-auto ml-96 grid overflow-y-auto  z-50">
          {searchResults.map((place) => (
            <Link to={'/home/'+place._id} key={place._id} className="search-result-card bg-white shadow-md rounded-md p-2 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">{place.title}</h3>
              <p className="text-gray-600">{place.address}</p>
            </Link>
          ))}
          </div>
        )}

      {isOpen && searchResults.length === 0 && textBoxValue.length > 0 && (
        <div className="no-results absolute top-24 w-auto ml-96 grid overflow-y-auto  z-50">Place not found.</div>
      )}
      </header>
    );
}