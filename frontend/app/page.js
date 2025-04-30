'use client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
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
