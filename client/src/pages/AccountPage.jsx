import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";

export default function AccountPage() {
  const { ready, user } = useContext(UserContext);

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    <Navigate to={"/login"} />;
  }

  return (
    <div className="border border-black">
      <nav className="w-full flex justify-center mt-8 gap-2">
        <Link
          className="p-2 px-6 bg-primary text-white rounded-full"
          to={"/account"}
        >
          My Account
        </Link>
        <Link className="p-2 px-6 " to={"/account/bookings"}>
          My bookings
        </Link>
        <Link className="p-2 px-6 " to={"/account/places"}>
          My Accomodates
        </Link>
      </nav>
    </div>
  );
}
