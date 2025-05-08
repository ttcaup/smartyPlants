/*Home Page*/

'use client';
import React from 'react';
import Link from 'next/link';
import { IconClick } from '@tabler/icons-react';

export default function Home() {
  return (
    <div className='Home'>
      {/* Left side: logo + title + subtitle */}
      <div className='left-section'>
        <img src='./images/logo.png' alt='SmartyPlants Logo' className='logo' />
        <div className='title-text'>
          <h2 className='growing'>
            The <span className='italic'>smart</span> way to plant.
          </h2>
        </div>
        <p className='subtitle'>
          <span className='italic'>
            Moisture, temperature, humidity, and light readings to take the best
            possible care of your plants.
          </span>
        </p>
      </div>

      {/* Right side: background + styled link */}
      <div className='right-section'>
        <Link href='/plants' className='all-plants-link'>
          <div className='all-plants-btn'>
            <span>
              Your
              <br />
              Plants
            </span>
            <IconClick size={55} className='click-icon' />
          </div>
        </Link>
      </div>
    </div>
  );
}
