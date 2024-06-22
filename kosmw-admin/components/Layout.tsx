import { useSession, signIn, signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useRouter } from 'next/router';
import { AiFillHourglass } from "react-icons/ai";
import Spinner from './Spinner';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  
   if(status === 'loading'){ return <div className='loading'><p><Spinner/></p></div>;
  }

  if (!session) {
    console.log("no session at this point")
      return <div className="bg-customSungloPeach w-screen h-screen flex items-center">
      <div className="text-center w-full">
        <button className="p-4 rounded-md bg-customWhite" onClick={() => signIn('google')}>
          Login with Google
        </button>
      </div>
    </div>
    
  }

  return (
    <div className="bg-customSungloPeach min-h-screen flex">
      <Navbar />
      <main className="bg-customWhite flex-grow m-2 ml-0 p-4 rounded-lg">{children}</main>
    </div>
  );
};

export default Layout;
