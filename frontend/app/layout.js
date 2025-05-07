/* frontend\app\layout.js*/
/*ROOT LAYOUT*/

// import './globals.css';

'use client';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
