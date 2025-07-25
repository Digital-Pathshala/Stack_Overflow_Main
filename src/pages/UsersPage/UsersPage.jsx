import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebars/Sidebar";
import Footer from "../../components/Footer/Footer";
import UserCard from "../../components/UserCard/UserCard";
import dp1 from "../../assets/dp1.jpg";
import { Search, ShieldUser, Inbox, Trophy } from "lucide-react";

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/users");
                if (data.success) {
                    setUsers(data.data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <header className="bg-white border-b border-gray-300 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center space-x-4">
                        <img src={dp1} alt="Logo" className="w-10 h-10 rounded-full" />
                        <span className="font-bold text-xl">
                            <span style={{ color: "#1db954" }}>Digital</span>{" "}
                            <span className="font-normal">Pathsala</span>
                        </span>
                    </div>

                    <div className="flex-1 max-w-2xl mx-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Inbox />
                        <ShieldUser />
                        <Trophy />
                    </div>
                </div>
            </header>

            {/* Main Section */}
            <div className="flex min-h-screen bg-white">
                <Sidebar />

                <main className="flex-1 px-8 py-10">
                    {/* Page Title */}
                    <h1 className="text-2xl font-bold mb-6">Users</h1>

                    {/* Users Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map((user) => (
                            <UserCard key={user._id} user={user} />
                        ))}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default UsersPage;
