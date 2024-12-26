import React from "react";

interface HeaderProps {
  companyLogo: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ companyLogo, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md h-28">
      <div className="flex items-center h-64 w-64">
        <img
          src={companyLogo}
          alt="Company Logo"
          className="h-full w-auto"
        />
      </div>

      <div className="flex flex-col items-center cursor-pointer ml-[-2px]" onClick={onLogout}>
        <img
          src="/images/logout.svg"
          alt="Logout"
          className="h-10 w-10 mb-1"
        />
        <span className="text-xl font-bold text-black transform -translate-x-[6px]">Cerrar</span>
      </div>
    </header>
  );
};

export default Header;
