import React from 'react';
import { Title, Button, Group } from '@mantine/core';
import { IconPlant } from '@tabler/icons-react';  // Tabler Icon
import Link from 'next/link';

export default function Home() {
  return (
    <div className="Home">
      {/* Centered Logo */}
      <Group justify="center" align="center" mb="lg">
        <img src="/images/logo.jpg" alt="SmartyPlants Logo" width={150} /> 
      </Group>

      {/* "Growing Happiness" Text */}
      <div className="text-section">
        <Title order={1} align="left">
          Growing Happiness
        </Title>
        <p>
          Moisture, humidity, and light readings to take the best possible care of your plants.
        </p>
      </div>

      {/* Button to Link to Plants Page */}
      <Group justify="right">
        <Link href="/plants">
        <Button variant="outline" color="#274e27" size="xl" radius={0}>
           All Plants
        </Button>
        </Link>
      </Group>
    </div>
  );
}
