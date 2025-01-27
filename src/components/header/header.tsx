import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface HeaderProps {
  companyLogo: string;
}

const Header: React.FC<HeaderProps> = ({ companyLogo }) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md h-28">
      <div className="flex items-center h-64 w-64">
        <Image
          src={companyLogo}
          alt="Company Logo"
          width={230}
          height={230}
          objectFit="contain"
        />
      </div>

      <div
        className="flex flex-col items-center cursor-pointer ml-[-2px]"
        onClick={handleLogout}
      >
        <Image
          src="/images/logout.svg"
          alt="Logout"
          width={40}
          height={40}
          className="mb-1"
        />
        <span className="text-xl font-bold text-black transform -translate-x-[6px]">
          Cerrar
        </span>
      </div>
    </header>
  );
};

export default Header;
