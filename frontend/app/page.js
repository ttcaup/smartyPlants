/* frontend\app\page.js*/
/*main entry point for the application */
'use client';
import { MantineProvider } from '@mantine/core';
import Home from '@/components/Home';

export default function App() {
  return (
    <div className='App'>
      <MantineProvider>
        <Home />
      </MantineProvider>
    </div>
  );
}
