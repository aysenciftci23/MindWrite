// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </>
    );
}