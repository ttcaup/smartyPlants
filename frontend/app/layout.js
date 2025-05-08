/* frontend\app\layout.js*/
/*ROOT LAYOUT*/

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/home.css'; //styles for Home page
import '../styles/dashboard.css'; //styles for plant dashboard
import '../styles/plantdata.css'; // custom styling for this plant page

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <MantineProvider>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
