// components/Navbar.tsx
import { FaHome } from "react-icons/fa";
import { LiaStoreAltSolid } from "react-icons/lia";
import { TiCog } from "react-icons/ti";
import { CiBoxList } from "react-icons/ci";
import { MdOutlineMoveToInbox } from "react-icons/md";
import { useRouter } from 'next/router';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
    const inactiveLink = 'flex items-center gap-1';
    const activeLink = `${inactiveLink} + bg-white rounded-l-lg text-customSungloDark p-1 `;
  return (
   <aside className="text-white p-4 pr-0">
    <Link className="flex items-center gap-1 mb-4" href={"/"}>
    <LiaStoreAltSolid />
    <span className="px-2">
        KosmwAdmin
    </span>
    </Link>
    <nav className="flex flex-col gap-2">
        <Link href={"/"} className={router.pathname === "/" ? activeLink : inactiveLink}>
            <FaHome /> 
            <span>Dashboard</span>
            </Link>
        <Link href={"/products"} className={router.pathname === "/products" ? activeLink : inactiveLink}>
            <CiBoxList />
            <span>Products</span>
            </Link>
        <Link href={"/orders"} className={router.pathname === "/orders" ? activeLink : inactiveLink}>
            <MdOutlineMoveToInbox />
            <span>Orders</span>
            </Link>
        <Link href={"/settings"} className={router.pathname === "/settings" ? activeLink : inactiveLink} >
            <TiCog />
            <span>Settings</span>
            </Link>
            <button onClick={()=>signOut()} className={inactiveLink} >
            <RiLogoutBoxRLine/>
            <span>Logout</span>
            </button>
    </nav>
   </aside>
  );
};

export default Navbar;
