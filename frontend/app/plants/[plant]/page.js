/*Individual Plant Page to display plant details and offer actions*/

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Button,
  Center,
  Tabs,
  Space,
  Card,
  SimpleGrid,
  Modal,
} from '@mantine/core';
import PageLayout from '@/components/PageLayout';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import {
  IconDroplet,
  IconTemperature,
  IconSun,
  IconCloudRain,
  IconBucketDroplet,
  IconCalendarMonth,
  IconCalendarWeek,
  IconClock24,
} from '@tabler/icons-react';
import axios from 'axios';
import ChartTabs from '@/components/ChartTabs';

export default function PlantPage() {
  const { plant } = useParams(); // gets plant name from URL
  const router = useRouter(); // for redirection
  const [readings, setReadings] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading screen toggle
  const [reloading, setReloading] = useState(false); // Reload button toggle
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch plant and reading data from API on mount
  useEffect(() => {
    axios
      .get(`/api/readings/${plant}`)
      .then((res) => setReadings(res.data))
      .catch(console.error);
    axios
      .get(`/api/plants/${plant}`)
      .then((res) => setPlantData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [plant]);

  // Reload readings and update last_watered if watered
  const handleReloadData = async () => {
    setReloading(true);
    try {
      const res = await axios.get(`/api/readings/${plant}`);
      setReadings(res.data);
      notifications.show({
        title: 'Data Reloaded',
        message: 'Latest sensor data fetched!',
      });
      const status = calculatePlantStatus(mostRecentReading);
      await axios.put(`/api/plants/${plant}`, { last_status: status });

      const latestWatered = res.data.find((r) => r.watered === true);
      if (latestWatered) {
        await axios.put(`/api/plants/${plant}`, {
          last_watered: new Date(latestWatered.timestamp).toISOString(),
        });
      }

      const updated = await axios.get(`/api/plants/${plant}`);
      setPlantData(updated.data);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to reload data',
        color: 'red',
      });
    } finally {
      setReloading(false);
    }
  };

  // Manually set the plant's last_water to "Today"
  const handleWaterPlant = async () => {
    try {
      await axios.put(`/api/plants/${plant}`, { last_watered: new Date() });
      notifications.show({
        title: 'Plant Watered',
        message: 'Last_watered updated!',
      });

      const updated = await axios.get(`/api/plants/${plant}`);
      setPlantData(updated.data);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update water time',
        color: 'red',
      });
    }
  };

  // Delete plant from the database and return to dashboard
  const handleDeletePlant = async () => {
    try {
      await axios.delete(`/api/plants/${plant}`);
      notifications.show({
        title: 'Plant Deleted',
        message: 'Redirecting to dashboard...',
      });
      router.push('/plants');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Could not delete plant',
        color: 'red',
      });
    }
  };

  const plantName = plantData.name;

  // Get most recent sensor reading
  const mostRecentReading = readings.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp)
      ? current
      : latest;
  }, readings[0]);

  //calculate status for specific plants or general
  function calculatePlantStatus({
    plant_info,
    soil_moisture,
    temperature,
    humidity,
    light,
  }) {
    if (plant_info.plant_link === 'monstera') {
      return calculateStatusForMonstera({
        soil_moisture,
        temperature,
        humidity,
        light,
      });
    }
    return calculateStatusGeneral(soil_moisture, temperature, humidity, light);
  }

  //calculate generic plant status
  function calculateStatusGeneral({
    soil_moisture,
    temperature,
    humidity,
    light,
  }) {
    if (soil_moisture < 300) return 'Too much Water';
    if (soil_moisture > 650) return 'Needs Water';
    if (temperature > 90) return 'Too Hot';
    if (temperature < 40) return 'Too Cold';
    if (humidity < 30) return 'Too Dry';
    if (humidity > 60) return 'Too Humid';
    if (light < 100) return 'Too Bright';
    if (light > 600) return 'Needs Light';
    return 'Healthy';
  }
  //calculate status for monstera plant
  function calculateStatusForMonstera({
    soil_moisture,
    temperature,
    humidity,
    light,
  }) {
    if (soil_moisture < 300) return 'Too much Water';
    if (soil_moisture > 500) return 'Needs Water';
    if (temperature > 85) return 'Too Hot';
    if (temperature < 65) return 'Too Cold';
    if (humidity < 60) return 'Too Dry';
    if (humidity > 70) return 'Too Humid';
    if (light < 150) return 'Too Bright';
    if (light > 350) return 'Needs Light';
    return 'Healthy';
  }

  // Filter readings by number of days
  const now = new Date();
  const filterByDays = (n) => {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - n);
    return readings.filter((r) => new Date(r.timestamp) >= cutoff);
  };

  // Show loader until data is ready
  if (loading || !readings.length) {
    return (
      <PageLayout>
        <Center>
          <Loader />
        </Center>
      </PageLayout>
    );
  }

  const status = mostRecentReading
    ? calculatePlantStatus(mostRecentReading)
    : null;
  // Main page content
  return (
    <div className='plant'>
      <PageLayout>
        <div className='plant-title'>
          <h2>{plantName}</h2>
        </div>
        <SimpleGrid cols={2} verticalSpacing='xl'>
          {/* Sensor readings card */}
          <Card className='sensor-card' padding='lg' radius='lg' withBorder>
            <Stack gap='xs'>
              <Group justify='space-between'>
                <h3>Current Sensor Data</h3>
                {status && (
                  <Badge
                    size='lg'
                    className={`status-badge ${
                      status === 'Healthy' ? 'badge-healthy' : 'badge-unhealthy'
                    }`}
                  >
                    {status}
                  </Badge>
                )}
              </Group>
              <Group>
                <IconDroplet color='#4069bf' />
                <p>Soil Moisture: {mostRecentReading.soil_moisture}</p>
              </Group>
              <Group>
                <IconTemperature color='#e67700' />
                <p>Temperature: {mostRecentReading.temperature}°F</p>
              </Group>
              <Group>
                <IconCloudRain color='#1c7ed6' />
                <p>Humidity: {mostRecentReading.humidity}%</p>
              </Group>
              <Group>
                <IconSun color='#fab005' />
                <p>Light: {mostRecentReading.light}</p>
              </Group>
              <Group>
                <IconBucketDroplet color='#2d3386' />
                <p>
                  Last Watered:{' '}
                  {mostRecentReading?.watered
                    ? new Date(mostRecentReading.timestamp).toLocaleString()
                    : new Date(plantData.last_watered).toLocaleString()}
                </p>
              </Group>
              <Text size='sm' c='dimmed' mb='xs'>
                {new Date(mostRecentReading.timestamp).toLocaleString()}
              </Text>
            </Stack>
          </Card>

          {/* Action buttons */}
          <Card className='sensor-card' spadding='lg' radius='lg' withBorder>
            <h3>Plant Actions</h3>
            <div className='action-buttons vertical'>
              <Button
                className='button-styled button-blue-light'
                onClick={handleReloadData}
              >
                Reload Data
              </Button>
              <Button
                className='button-styled button-green-light'
                onClick={handleWaterPlant}
              >
                Water Plant
              </Button>
              <Button
                className='button-styled button-orange-light'
                onClick={handleDeletePlant}
              >
                Delete Plant
              </Button>
            </div>
          </Card>

          {/* Time-filtered charts section */}
          <div className='timeFilterGraphs chart-fullwidth'>
            <Tabs color='green' defaultValue='Day'>
              <Tabs.List>
                <Tabs.Tab value='Day' leftSection={<IconClock24 size={12} />}>
                  Day
                </Tabs.Tab>
                <Tabs.Tab
                  value='Week'
                  leftSection={<IconCalendarWeek size={12} />}
                >
                  Week
                </Tabs.Tab>
                <Tabs.Tab
                  value='Month'
                  leftSection={<IconCalendarMonth size={12} />}
                >
                  Month
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value='Day'>
                <Space h='xl' />
                <ChartTabs data={filterByDays(1)} timeFilterChoice='Day' />
              </Tabs.Panel>
              <Tabs.Panel value='Week'>
                <Space h='xl' />
                <ChartTabs data={filterByDays(7)} timeFilterChoice='Week' />
              </Tabs.Panel>
              <Tabs.Panel value='Month'>
                <Space h='xl' />
                <ChartTabs data={filterByDays(30)} timeFilterChoice='Month' />
              </Tabs.Panel>
            </Tabs>
          </div>
        </SimpleGrid>
        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={`Delete ${plantName}?`}
          centered
        >
          <Text>Are you sure you want to permanently delete this plant?</Text>

          <Group justify='flex-end' mt='md'>
            <Button variant='default' onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color='red' onClick={handleDeletePlant}>
              Delete
            </Button>
          </Group>
        </Modal>
      </PageLayout>
    </div>
  );
}
