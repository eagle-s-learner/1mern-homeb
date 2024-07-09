import { Link, useLocation } from "react-router-dom";

export default function AccountHeader() {
    const {pathname} = useLocation();
    console.log(pathname);
    let subpage = pathname.split('/')?.[2];
    if(subpage === undefined){
        subpage = 'profile'
    }
  function linkClasses(type = null) {
    // const isAction = pathname === './account' && type === 'profile';
    let classes = "py-2 px-4";

    if (type === subpage) 
    {
        // || (subpages === undefined && type === "profile")
      classes += " bg-gray-500 rounded-full";
    }
    return classes;
  }
  return (
    <>
      <nav className="w-full flex mt-8 justify-center">
        <Link className={linkClasses("profile")} to={"/account"}>
          My Profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My accomodations
        </Link>
      </nav>
    </>
  );
}
