/*frontend\app\plants\page.js*/
/*manages dashboard for all plants*/
'use client';
import { React, useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import {
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Title,
  Stack,
  Button,
  Space,
} from '@mantine/core';
import {
  IconDroplet,
  IconBucketDroplet,
  IconPlant,
  IconPlantOff,
} from '@tabler/icons-react';
import Link from 'next/link';
import axios from 'axios';
import PlantAction from '@/components/PlantActions';

export default function PlantDashboard() {
  const [plants, setPlants] = useState([]);
  const [readings, setReadings] = useState([]);
  const [actionMode, setActionMode] = useState(null); // 'add' | 'edit' | 'delete' | null
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    axios.get('/api/plants').then((res) => setPlants(res.data));
    axios.get('/api/readings').then((res) => setReadings(res.data));
  }, []);

  const getReading = (plant_link) => {
    const found = readings.find((r) => r._id === plant_link);
    return found?.latestReading || {};
  };
  const refreshPlants = async () => {
    const res = await axios.get('/api/plants');
    setPlants(res.data);
  };
  const handleCardClick = (e, plant) => {
    if (actionMode === 'edit' || actionMode === 'delete') {
      e.preventDefault(); // Stop <Link> navigation
      setSelectedPlant(plant);
      setActionMode(actionMode);
    }
  };

  return (
    <PageLayout>
      {/* Centered "Plants" Title */}
      <Group position="center" direction="column" mb="lg">
        <Title order={2}>Plants</Title>

        {/* Modals (Add, Edit, Delete buttons) centered below the title */}
        <Group position="center" direction="row" mb="md">
          <Button onClick={() => setActionMode('add')}>Add Plant</Button>
          <Button onClick={() => setActionMode('edit')}>Edit Plant</Button>
          <Button color="red" onClick={() => setActionMode('delete')}>
            Delete Plant
          </Button>
          {actionMode && (
            <Button
              variant="light"
              color="gray"
              onClick={() => setActionMode(null)}
            >
              Cancel {actionMode.charAt(0).toUpperCase() + actionMode.slice(1)}
            </Button>
          )}
        </Group>
      </Group>

      {/* Plant Grid: Displaying plants in rows of 3 */}
      <Grid grow mb="lg" gutter="md">
        {plants.map((plant) => {
          const reading = getReading(plant.plant_link);
          const cardClickable = actionMode === 'edit' || actionMode === 'delete';
          return (
            <Grid.Col key={plant._id} span={4}>
              <Link
                href={`plants/${plant.plant_link}`}
                style={{ textDecoration: 'none' }}
                onClick={(e) => handleCardClick(e, plant)}
              >
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={
                    cardClickable
                      ? { cursor: 'pointer', border: '2px solid #228be6' }
                      : {}
                  }
                >
                  <Group justify="space-between">
                    <Text fw={500}>{plant.name}</Text>
                    <Badge color={plant.last_status === 'Healthy' ? 'green' : 'red'}>
                      {plant.last_status}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Stack gap="sm">
                      <Group align="center">
                        <IconDroplet color={'#4069bf'} />
                        <p>Moisture: {reading.soil_moisture ?? 'N/A'}</p>
                      </Group>
                      <Group align="center">
                        <IconBucketDroplet color={'#2d3386'} />
                        <p>Last Water: {plant.last_water ?? 'Unknown'}</p>
                      </Group>
                    </Stack>
                    {plant.last_status === 'Healthy' ? (
                      <IconPlant size={100} color={'#2d863e'} />
                    ) : (
                      <IconPlantOff size={100} color="red" />
                    )}
                  </Group>
                </Card>
              </Link>
            </Grid.Col>
          );
        })}
      </Grid>

      {/* PlantAction Modals */}
      <PlantAction
        actionMode={actionMode}
        setActionMode={setActionMode}
        selectedPlant={selectedPlant}
        setSelectedPlant={setSelectedPlant}
        refreshPlants={refreshPlants}
      />
    </PageLayout>
  );
}
