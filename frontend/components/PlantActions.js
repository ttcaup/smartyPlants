'use client';
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Button,
  Group,
  Text,
} from '@mantine/core';
import { React, useState, useEffect } from 'react';
import axios from 'axios';

export default function PlantAction({
  actionMode,
  setActionMode,
  selectedPlant,
  setSelectedPlant,
  refreshPlants,
}) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('');
  const [lastWater, setLastWater] = useState('');

  useEffect(() => {
    if (actionMode === 'edit' && selectedPlant) {
      setName(selectedPlant.name);
      setLink(selectedPlant.plant_link);
      setStatus(selectedPlant.last_status);
      setLastWater(selectedPlant.last_water);
    } else {
      setName('');
      setLink('');
      setStatus('');
      setLastWater('');
    }
  }, [actionMode, selectedPlant]);

  const reset = () => {
    setName('');
    setLink('');
    setStatus('');
    setLastWater('');
    setSelectedPlant(null);
    setActionMode(null);
  };

  const handleAdd = async () => {
    await axios.post('/api/plants', {
      name,
      plant_link: link,
      last_status: status,
      last_water: lastWater,
    });
    refreshPlants();
    reset();
  };

  const handleEdit = async () => {
    await axios.put(`/api/plants/${selectedPlant.plant_link}`, {
      name,
      plant_link: link,
      last_status: status,
      last_water: lastWater,
    });
    refreshPlants();
    reset();
  };

  const handleDelete = async () => {
    await axios.delete(`/api/plants/${selectedPlant.plant_link}`);
    refreshPlants();
    reset();
  };

  return (
    <>
      {/* Add Modal */}
      <Modal opened={actionMode === 'add'} onClose={reset} title='Add Plant'>
        <Stack>
          <TextInput
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label='Link'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Select
            label='Status'
            data={['Healthy', 'Needs Water', 'Too Bright']}
            value={status}
            onChange={setStatus}
          />
          <TextInput
            label='Last Watered'
            value={lastWater}
            onChange={(e) => setLastWater(e.target.value)}
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={reset}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={actionMode === 'edit' && selectedPlant}
        onClose={reset}
        title='Edit Plant'
      >
        <Stack>
          <TextInput
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label='Link'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Select
            label='Status'
            data={['Healthy', 'Needs Water', 'Too Bright']}
            value={status}
            onChange={setStatus}
          />
          <TextInput
            label='Last Watered'
            value={lastWater}
            onChange={(e) => setLastWater(e.target.value)}
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={reset}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={actionMode === 'delete' && selectedPlant}
        onClose={reset}
        title='Confirm Deletion'
      >
        <Text mb='md'>Delete plant "{selectedPlant?.name}"?</Text>
        <Group justify='flex-end'>
          <Button variant='default' onClick={reset}>
            Cancel
          </Button>
          <Button color='red' onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
