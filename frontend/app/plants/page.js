'use client';

import PageLayout from '@/app/components/PageLayout';
import { Grid, Card, Text, Badge, Group, Title, Stack } from '@mantine/core';
import Link from 'next/link';
import {
  IconDroplet,
  IconBucketDroplet,
  IconPlant,
  IconPlantOff,
} from '@tabler/icons-react';

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

export default function PlantDashboard() {
  return (
    <PageLayout>
      <div className='PlantDashboard'>
        <Title order={2} mb='md'>
          My Plants
        </Title>
        <Grid>
          {plants.map((plant) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={plant.slug}>
              <Link
                href={`/plants/${plant.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Card shadow='sm' padding='lg' radius='md' withBorder>
                  <Group justify='space-between'>
                    <Text fw={500}>{plant.name}</Text>
                    <Badge color={plant.status === 'Healthy' ? 'green' : 'red'}>
                      {plant.status}
                    </Badge>
                  </Group>
                  <Group justify='space-between'>
                    <Stack gap='sm'>
                      <Group justify='center' align='center'>
                        <IconDroplet color={'#4069bf'} />
                        <p>Moisture: {plant.moisture}%</p>
                      </Group>
                      <Group justify='center' align='center'>
                        <IconBucketDroplet color={'#2d3386'} />
                        <p>Water: {plant.nextWater}</p>
                      </Group>
                    </Stack>
                    {plant.status === 'Healthy' ? (
                      <IconPlant size={100} color={'#2d863e'} />
                    ) : (
                      <IconPlantOff size={100} color='red' />
                    )}
                  </Group>
                </Card>
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </PageLayout>
  );
}
