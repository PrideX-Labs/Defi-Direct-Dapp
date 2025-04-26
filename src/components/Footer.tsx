import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className='flex flex-col items-center text-center p-10 border-t-2 border-purple-950'>
      <div>&copy; {currentYear} Defi-Direct</div>
      <div className='flex space-x-4 mt-2'>
        <a href='https://x.com/defi_direct' target='_blank' rel='noopener noreferrer'>
          <FaTwitter />
        </a>
        <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
          <FaFacebook />
        </a>
        <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
          <FaInstagram />
        </a>
      </div>
    </div>
  );
}

export default Footer;