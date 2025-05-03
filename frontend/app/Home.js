'use client';
import { React, useState, useEffect } from 'react';
import { Title, Group, Card, Text, Stack, Divider, Badge } from '@mantine/core';
import { IconPlant } from '@tabler/icons-react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [plants, setPlants] = useState([]);
  useEffect(() => {
    axios.get('/api/plants').then((res) => setPlants(res.data));
  }, []);

  return (
    <div className='Home'>
      <Group justify='space-between' align='center' mb='lg'>
        <IconPlant size={32} />
        <h1>SmartyPlants</h1>
        <IconPlant size={32} />
      </Group>

      <Divider my='md' />

      <Link href={`/plants`} style={{ textDecoration: 'none' }}>
        <Card padding='lg' radius='lg' withBorder>
          <Title order={4} mb='sm'>
            Plants
          </Title>
          <Stack gap='md'>
            {plants.map((plant) => {
              return (
                <Card key={plant._id} padding='lg' radius='md' withBorder>
                  <Group justify='space-between' align='center'>
                    <Text fw={500}>{plant.name}</Text>
                    <Badge
                      color={plant.last_status === 'Healthy' ? 'green' : 'red'}
                    >
                      {plant.last_status}
                    </Badge>
                  </Group>
                </Card>
              );
            })}
            ;
          </Stack>
        </Card>
      </Link>
    </div>
  );
}
