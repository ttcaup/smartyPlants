/*frontend\components\PlantActions.js*/
/*modals for adding,editing, and deleting plant data*/

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
import { DateInput } from '@mantine/dates';

import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { formatISO } from 'date-fns';

export default function PlantAction({
  actionMode, // current mode: 'add', 'edit', or 'delete'
  setActionMode, // function to update action mode
  selectedPlant, // the plant currently selected for editing/deleting
  setSelectedPlant, // function to update selected plant
  refreshPlants, // function to refresh plant list after update
}) {
  // form field state variables
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('');
  const [lastWatered, setLastWatered] = useState('');

  // populate form fields when entering edit mode, or clear fields otherwise
  useEffect(() => {
    if (actionMode === 'edit' && selectedPlant) {
      setName(selectedPlant.name);
      setLink(selectedPlant.plant_link);
      setStatus(selectedPlant.last_status);
      setLastWatered(selectedPlant.last_water);
    } else {
      setName('');
      setLink('');
      setStatus('');
      setLastWatered('');
    }
  }, [actionMode, selectedPlant]);

  // reset all fields and close modals
  const reset = () => {
    setName('');
    setLink('');
    setStatus('');
    setLastWatered('');
    setSelectedPlant(null);
    setActionMode(null);
  };

  // handle add form submission
  const handleAdd = async () => {
    await axios.post('/api/plants', {
      name: name,
      plant_link: link,
      last_status: status,
      last_watered: formatISO(lastWatered),
    });
    refreshPlants();
    reset();
  };

  // handle edit form submission
  const handleEdit = async () => {
    await axios.put(`/api/plants/${selectedPlant.plant_link}`, {
      name: name ? name : selectedPlant.name,
      plant_link: selectedPlant.plant_link,
      last_status: status ? status : selectedPlant.status,
      last_watered: lastWatered
        ? formatISO(lastWatered)
        : selectedPlant.last_watered,
    });
    refreshPlants();
    reset();
  };

  // handle delete confirmation
  const handleDelete = async () => {
    await axios.delete(`/api/plants/${selectedPlant.plant_link}`);
    refreshPlants();
    reset();
  };

  return (
    <>
      {/* Add Plant Modal */}
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
            defaultValue='Healthy'
            data={[
              'Healthy',
              'Needs Water',
              'Too Bright',
              'Needs Light',
              'Too much Water',
              'Too Hot',
              'Too Cold',
              'Too Dry',
              'Too Humid',
            ]}
            value={status}
            onChange={setStatus}
          />
          <DateInput
            clearable
            valueFormat='MMM DD YYYY'
            defaultValue={new Date()}
            label='Last Watered'
            placeholder='Pick date'
            value={lastWatered}
            onChange={setLastWatered}
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={reset}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Plant Modal */}
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
          <Select
            label='Status'
            data={[
              'Healthy',
              'Needs Water',
              'Too Bright',
              'Needs Light',
              'Too much Water',
              'Too Hot',
              'Too Cold',
              'Too Dry',
              'Too Humid',
            ]}
            value={status}
            onChange={setStatus}
          />
          <DateInput
            clearable
            valueFormat='MMM DD YYYY'
            label='Last Watered'
            placeholder='Pick date'
            value={lastWatered}
            onChange={setLastWatered}
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={reset}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={actionMode === 'delete' && selectedPlant}
        onClose={reset}
        title='Confirm Deletion'
      >
        <Text mb='md'>Delete plant: {selectedPlant?.name}?</Text>
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
