/* frontend/app/plants/page.js */
/* manages dashboard for all plants */
'use client';

import { React, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PlantAction from '@/components/PlantActions';
import PageLayout from '@/components/PageLayout';
import { format } from 'date-fns';

import { Button, Loader, Center } from '@mantine/core';
import {
  IconDroplet,
  IconBucketDroplet,
  IconPlant,
  IconPlantOff,
} from '@tabler/icons-react';

import './dashboard.css'; //styles for plant dashboard

export default function PlantDashboard() {
  const [plants, setPlants] = useState([]); //plant objects
  const [readings, setReadings] = useState([]); //sensor readings
  const [loading, setLoading] = useState(true); //state
  const [actionMode, setActionMode] = useState(null); // current mode: add/edit/delete
  const [selectedPlant, setSelectedPlant] = useState(null); //selected plant(for editing/deleting)

  // fetch plant + reading data on mount
  useEffect(() => {
    const fetchData = async () => {
      const plantsRes = await axios.get('/api/plants');
      const readingsRes = await axios.get('/api/readings');
      setPlants(plantsRes.data);
      setReadings(readingsRes.data);
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0); //scrolls to top on page load
  }, []);

  // find the latest reading associated with the plant by _id
  const getReading = (plant_link) => {
    const found = readings.find((r) => r._id === plant_link);
    return found?.latestReading || {};
  };

  // refresh plant data only (after add/edit/delete)
  const refreshPlants = async () => {
    const res = await axios.get('/api/plants');
    setPlants(res.data);
  };

  // intercept card click if in edit or delete mode
  const handleCardClick = (e, plant) => {
    if (actionMode === 'edit' || actionMode === 'delete') {
      e.preventDefault(); // prevent navigation
      setSelectedPlant(plant); // select plant for action
      setActionMode(actionMode); // ensure mode is still active
    }
  };

  // loading screen while fetching data
  if (loading || plants.length === 0 || readings.length === 0) {
    return (
      <PageLayout>
        <Center style={{ minHeight: '50vh' }}>
          <Loader color='green' />
        </Center>
      </PageLayout>
    );
  }

  // render dashboard once data is loaded
  return (
    <PageLayout>
      {/* heading */}
      <h2 className='page-title'>Plants</h2>

      {/* action buttons */}
      <div className='action-buttons'>
        <Button
          color=' #f9f8f4'
          variant='outline'
          onClick={() => setActionMode('add')}
        >
          Add
        </Button>
        <Button
          color=' #f9f8f4'
          variant='outline'
          onClick={() => setActionMode('edit')}
        >
          Edit
        </Button>
        <Button
          color=' #f9f8f4'
          variant='outline'
          onClick={() => setActionMode('delete')}
        >
          Delete
        </Button>

        {/* cancel button appears when in an action mode */}
        {actionMode && (
          <Button
            variant='subtle'
            color='gray'
            onClick={() => setActionMode(null)}
          >
            Cancel {actionMode.charAt(0).toUpperCase() + actionMode.slice(1)}
          </Button>
        )}
      </div>

      {/* plant card grid */}
      <div className='plant-grid'>
        {plants.map((plant) => {
          const reading = getReading(plant.plant_link); // gets latest reading
          return (
            <Link
              href={`plants/${plant.plant_link}`}
              className='plant-card'
              key={plant.plant_link}
              onClick={(e) => handleCardClick(e, plant)} // intercept if in edit/delete mode
            >
              {/* plant name */}
              <div className='plant-name'>{plant.name}</div>

              {/* status badge */}
              <span
                className={`status-badge ${
                  plant.last_status === 'Healthy' ? 'healthy' : 'unhealthy'
                }`}
              >
                {plant.last_status}
              </span>

              {/* sensor summary info */}
              <div className='reading-info'>
                <p>
                  <IconDroplet size={16} style={{ marginRight: 6 }} />
                  Moisture: {reading.soil_moisture ?? 'N/A'}
                </p>
                <p>
                  <IconBucketDroplet size={16} style={{ marginRight: 6 }} />
                  Last Watered:
                  {new Date(plant.last_watered).toLocaleString() || 'Unknown'}
                </p>
              </div>

              {/* bottom icon is based on health (so healthy or not helthy) */}
              <div
                className={`plant-icon ${
                  plant.last_status === 'Healthy' ? 'healthy' : 'danger'
                }`}
              >
                {plant.last_status === 'Healthy' ? (
                  <IconPlant size={64} />
                ) : (
                  <IconPlantOff size={64} />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* action modal (add/edit/delete logic) */}
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
