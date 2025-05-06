/*Individual Plant Page to display plant details and offer actions*/
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Title,
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
  const { plant } = useParams();
  const router = useRouter();
  const [readings, setReadings] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [loading, setLoading] = useState(true);
  //may remove later or properly implement
  const [reloading, setReloading] = useState(false);
  const [checking, setChecking] = useState(false);

  //get data from database by calling API endpoints
  useEffect(() => {
    axios
      .get(`/api/readings/${plant}`)
      .then((res) => setReadings(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`/api/plants/${plant}`)
      .then((res) => setPlantData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [plant]);

  //callback handlers for action buttons
  //TODO: fix lack of notification display (not displayed because the notifications.show is outside the return and thus does not render)
  const handleReloadData = async () => {
    setReloading(true);
    let res;

    try {
      res = await axios.get(`/api/readings/${plant}`);
      setReadings(res.data);
      notifications.show({
        title: 'Data Reloaded',
        message: 'Latest sensor data fetched!',
      });
      const latestWatered = res.data.find((r) => r.watered === true);

      if (latestWatered) {
        await axios.put(`/api/plants/${plant}`, {
          last_water: new Date(latestWatered.timestamp).toISOString(),
        });
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to reload data',
        color: 'red',
      });
    } finally {
      setReloading(false);
    }
  };

  const handleWaterPlant = async () => {
    try {
      await axios.put(`/api/plants/${plant}`, {
        last_water: 'Today',
      });
      notifications.show({
        title: 'Plant Watered',
        message: 'Last_water updated!',
      });
      const updated = await axios.get(`/api/plants/${plant}`);
      setPlantData(updated.data);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update water time',
        color: 'red',
      });
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const status = calculateStatus(mostRecentReading);
      await axios.put(`/api/plants/${plant}`, { last_status: status });
      notifications.show({
        title: 'Status Checked',
        message: `Status: ${status}`,
      });
      const updated = await axios.get(`/api/plants/${plant}`);
      setPlantData(updated.data);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to check status',
        color: 'red',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleDeletePlant = async () => {
    try {
      await axios.delete(`/api/plants/${plant}`);
      notifications.show({
        title: 'Plant Deleted',
        message: 'Redirecting to dashboard...',
      });
      router.push('/plants');
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Could not delete plant',
        color: 'red',
      });
    }
  };

  const plantName = plantData.name;

  //find most recent database document in readins collection
  const mostRecentReading = readings.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp)
      ? current
      : latest;
  }, readings[0]);

  //calculate plant status
  //TODO: Update function for specific plants
  function calculateStatus({ soil_moisture, temperature, humidity, light }) {
    if (soil_moisture < 300) return 'Too much Water';
    if (soil_moisture > 650) return 'Needs Water';
    if (temperature > 90) return 'Too Hot';
    if (temperature < 40) return 'Too Cold';
    if (humidity < 30) return 'Too Dry';
    if (humidity > 60) return 'Too Humid';
    if (light < 100) return 'Needs Light';
    if (light > 400) return 'Too Bright';
    return 'Healthy';
  }

  const now = new Date();

  //calulate time filtering by getting current date and find n days back of data
  const filterByDays = (n) => {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - n);
    return readings.filter((r) => new Date(r.timestamp) >= cutoff);
  };

  //if loading or no readings received from database yet, set loading overlay
  if (loading || !readings.length) {
    return (
      <PageLayout>
        <Center>
          <Loader />
        </Center>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className='plant'>
        <Title order={2} mb='sm'>
          {plantName}
        </Title>
        {/*Display data from database about plant*/}
        <SimpleGrid cols={2} verticalSpacing='xl'>
          <Card padding='lg' radius='lg' withBorder>
            <Stack gap='xs'>
              <Group justify='space-between'>
                <h3>Current Sensor Data</h3>
                <Badge
                  color={
                    calculateStatus(mostRecentReading) === 'Healthy'
                      ? 'green'
                      : 'red'
                  }
                >
                  {calculateStatus(mostRecentReading)}
                </Badge>
              </Group>
              <Group>
                <IconDroplet color='#4069bf' />
                <p> Soil Moisture: {mostRecentReading.soil_moisture}</p>
              </Group>
              <Group>
                <IconTemperature color='#e67700' />
                <p> Temperature: {mostRecentReading.temperature}°F</p>
              </Group>
              <Group>
                <IconCloudRain color='#1c7ed6' />
                <p> Humidity: {mostRecentReading.humidity}%</p>
              </Group>
              <Group>
                <IconSun color='#fab005' />
                <p> Light: {mostRecentReading.light}</p>
              </Group>
              <Group>
                <IconBucketDroplet color={'#2d3386'} />
                {/*Date is displayed as BSON UTC, change formatting for more readable date */}
                <p>
                  Last Watered:{' '}
                  {mostRecentReading?.watered
                    ? new Date(mostRecentReading.timestamp).toLocaleString()
                    : plantData.last_water}
                </p>
              </Group>

              <Text size='sm' c='dimmed' mb='xs'>
                {new Date(mostRecentReading.timestamp).toLocaleString()}
              </Text>
            </Stack>
          </Card>
          {/*Action buttons */}
          <Card padding='lg' radius='lg' withBorder>
            <SimpleGrid col={2}>
              <Button onClick={handleReloadData} color='purple'>
                Reload Data
              </Button>
              <Button onClick={handleWaterPlant} color='blue'>
                Water Plant
              </Button>
              <Button onClick={handleCheckStatus} color='green'>
                Check Status
              </Button>
              <Button onClick={handleDeletePlant} color='red'>
                Delete Plant
              </Button>
            </SimpleGrid>
          </Card>
          {/*Tabs to display charts filtered by time*/}
          <div className='timeFilterGraphs'>
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
              {/*Choose number of days to filter time length and display charts */}
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
      </div>
    </PageLayout>
  );
}
