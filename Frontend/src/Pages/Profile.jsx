import React from "react";
import { useAuthStore } from "../../store/authStore";
import DeleteAccountPopup from "../Components/DeleteAccountPopup";

const Profile = () => {
  const { user, deleteAccPopup } = useAuthStore();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      day: "numeric", month: "long", year: "numeric",
      hour: "numeric", minute: "numeric", hour12: true,
    });

  const openDeletePopup = () => useAuthStore.setState({ deleteAccPopup: true });

  return (
    <section className="min-h-[77vh] flexCenter px-4 bg-gray-50">
      <main className="bg-white border border-gray-200 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-black text-white flexCenter text-lg font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-bold text-black text-base capitalize">{user?.name}</h1>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 flex flex-col gap-4 text-sm">
          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Last Login</span>
            <span className="text-black text-xs text-right">
              {user?.lastLogin ? formatDate(user.lastLogin) : "Just signed up!"}
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={openDeletePopup}
              className="hover-cursorCSS text-xs text-gray-400 hover:text-black border border-gray-200 hover:border-black rounded-lg px-4 py-2 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {deleteAccPopup && <DeleteAccountPopup />}
    </section>
  );
};

export default Profile;
