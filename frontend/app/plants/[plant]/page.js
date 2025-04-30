'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Title, Text, Badge, Group, Divider } from '@mantine/core';
import PageLayout from '@/app/components/PageLayout';
import { IconDroplet, IconBucketDroplet } from '@tabler/icons-react';

const plants = [
  {
    name: 'Plant1',
    slug: 'plant1',
    moisture: 60,
    status: 'Healthy',
    nextWater: 'In 2 days',
  },
  {
    name: 'Plant2',
    slug: 'plant2',
    moisture: 22,
    status: 'Needs Water',
    nextWater: 'Today',
  },
  {
    name: 'Plant3',
    slug: 'plant3',
    moisture: 80,
    status: 'Healthy',
    nextWater: 'In 5 days',
  },
];

export default function PlantPage() {
  const params = useParams();
  const plantSlug = params.plant;

  const plant = useMemo(
    () => plants.find((p) => p.slug === plantSlug),
    [plantSlug]
  );

  if (!plant) {
    return (
      <PageLayout>
        <div className='plant'>Plant not found.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className='plant'>
        <Group justify='space-between' mb='xs'>
          <Title order={2}>{plant.name}</Title>
          <Badge color={plant.status === 'Healthy' ? 'green' : 'red'}>
            {plant.status}
          </Badge>
        </Group>
        <Divider my='sm' />

        <Text size='md' mb='sm'>
          {plant.description}
        </Text>
        <Text>
          <IconDroplet color={'#4069bf'} fill={'#4069bf'} /> Moisture:{' '}
          {plant.moisture}%
        </Text>
        <Text>
          <IconBucketDroplet color={'#2d3386'} /> Watering: {plant.nextWater}
        </Text>
      </div>
    </PageLayout>
  );
}
