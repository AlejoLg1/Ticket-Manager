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
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between py-8 md:py-3 px-6 gap-4 md:gap-0">
        <p className="text-body-m leading-m text-center w-full md:w-auto">
          Copyright &copy; {getCurrentYear()} Redsys Control
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto items-center md:items-end text-center">
          <a
            href="https://jehskix4eyb3bg1v.public.blob.vercel-storage.com/politica_de_privacidad-ZpenOhFbljZ5fEPUfSbf8Vv5kq7kZs.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="px-6 py-3 font-bold text-body-m leading-m">
              Política de privacidad
            </p>
          </a>

          <a
            href="https://jehskix4eyb3bg1v.public.blob.vercel-storage.com/terminos_y_condiciones-qMaVEtVqVkXVZC7tNDwHFwSBfLmyrw.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="px-6 py-3 font-bold text-body-m leading-m">
              Términos y condiciones
            </p>
          </a>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
