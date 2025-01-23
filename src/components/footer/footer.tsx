import React from 'react';

function Footer() {
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  };

  return (
    <footer
      id="footer"
      className="w-full md:h-[72px] bg-[#101D3E] text-[#FFFFFF] mt-8"
    >
      <div className="full flex items-center justify-between py-8 md:py-3 px-6">
        <p className="text-body-m leading-m">
           Copyright &copy; {getCurrentYear()} Finaer
        </p>
        <div className="flex gap-6">
          <p className="px-6 py-3 font-bold text-body-m leading-m">
            Política de cookies
          </p>
          <p className="px-6 py-3 font-bold text-body-m leading-m">
            Política de privacidad
          </p>
          <p className="px-6 py-3 font-bold text-body-m leading-m">
            Términos y condiciones
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
