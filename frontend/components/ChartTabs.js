'use client';
import React from 'react';
import { Tabs, Title } from '@mantine/core';
import { LineChart } from '@mantine/charts';
function ChartTabs({ data, timeFilterChoice }) {
  return (
    <div className='sensorGraphs'>
      <Tabs color='green' orientation='vertical' defaultValue='soil_moisture'>
        <Tabs.List>
          <Tabs.Tab value='soil_moisture'>Soil Moisture</Tabs.Tab>
          <Tabs.Tab value='temperature'>Temperature</Tabs.Tab>
          <Tabs.Tab value='humidity'>Humidity</Tabs.Tab>
          <Tabs.Tab value='light'>Light</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='soil_moisture'>
          <Title>Soil Moisture Over the Past {timeFilterChoice}</Title>
          <LineChart
            h={300}
            data={data}
            dataKey='timestamp'
            series={[{ name: 'soil_moisture', color: 'indigo.6' }]}
            curveType='linear'
          />
        </Tabs.Panel>
        <Tabs.Panel value='temperature'>
          <Title>Temperature Over the Past {timeFilterChoice}</Title>
          <LineChart
            h={300}
            data={data}
            dataKey='timestamp'
            series={[{ name: 'temperature', color: 'indigo.6' }]}
            curveType='linear'
          />
        </Tabs.Panel>
        <Tabs.Panel value='humidity'>
          <Title>Humidity Over the Past {timeFilterChoice}</Title>
          <LineChart
            h={300}
            data={data}
            dataKey='timestamp'
            series={[{ name: 'humidity', color: 'indigo.6' }]}
            curveType='linear'
          />
        </Tabs.Panel>
        <Tabs.Panel value='light'>
          <Title>Light Over the Past {timeFilterChoice}</Title>
          <LineChart
            h={300}
            data={data}
            dataKey='timestamp'
            series={[{ name: 'light', color: 'indigo.6' }]}
            curveType='linear'
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default ChartTabs;
