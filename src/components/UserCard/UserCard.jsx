import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow rounded-lg p-4 hover:shadow-md transition">
      <img
        src={
          user.avatar ||
          "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName)
        }
        alt={user.fullName}
        className="w-16 h-16 rounded-full border mb-3"
      />
      <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
      <p className="text-sm text-gray-500">{user.role}</p>
      <span className="mt-2 text-xs text-green-600">
        {user.isVerified ? "Verified" : "Not Verified"}
      </span>
    </div>
  );
};

export default UserCard;
