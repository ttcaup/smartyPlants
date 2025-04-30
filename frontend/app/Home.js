'use client';

import {
  Title,
  Group,
  Card,
  Text,
  Stack,
  Anchor,
  Divider,
} from '@mantine/core';
import { IconPlant } from '@tabler/icons-react';

export default function Home() {
  return (
    <div className='Home'>
      <Group justify='space-between' align='center' mb='lg'>
        <IconPlant size={32} />
        <Title order={2}>SmartyPlants</Title>
        <IconPlant size={32} />
      </Group>

      <Divider my='md' />

      <Anchor href='/plants' underline='never'>
        <Card padding='lg' radius='lg' withBorder>
          <Title order={4} mb='sm'>
            Plants
          </Title>

          <Stack gap='md'>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Group justify='space-between' align='center'>
                <Text fw={500}>Plant 1</Text>
              </Group>
            </Card>

            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Group justify='space-between' align='center'>
                <Text fw={500}>Plant 2</Text>
              </Group>
            </Card>
          </Stack>
        </Card>
      </Anchor>
    </div>
  );
}
