/* frontend\app\page.js*/
/*main entry point for the application */
'use client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import Home from './Home';

export default function App() {
  return (
    <div className='App'>
      <MantineProvider>
        <Home />
      </MantineProvider>
    </div>
  );
}
