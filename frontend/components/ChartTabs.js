/*frontend\components\ChartTabs.js*/
/*displays charts for sensor data*/
/* frontend/components/ChartTabs.js */
/* Component that displays sensor data using vertical tabs and line charts */

'use client';

import React from 'react';
import { Tabs, Title } from '@mantine/core'; 
import { LineChart } from '@mantine/charts'; 
// import './plantdata.css'; // Not needed here since styling is handled at page level


function ChartTabs({ data, timeFilterChoice }) {
  // Custom styling for the chart titles
  const titleStyle = {
    fontSize: '28px',
    fontWeight: 600,
    color: '#274e27',
    fontFamily: 'Cormorant Garamond, serif',
  };

  return (
    <div className="sensorGraphs"> {/* wrapper div for custom styling */}
      <Tabs
        color="green"                    
        orientation="vertical"          //Tabs stack vertically
        defaultValue="soil_moisture"    //first tab is selected by default
        variant="pills"                 // Rounded button tabs
        className="chart-tabs"          // lass for layout styling
      >
        {/* List of selectable tabs */}
        <Tabs.List className="chart-tab-list">
          <Tabs.Tab value="soil_moisture">Soil Moisture</Tabs.Tab>
          <Tabs.Tab value="temperature">Temperature</Tabs.Tab>
          <Tabs.Tab value="humidity">Humidity</Tabs.Tab>
          <Tabs.Tab value="light">Light</Tabs.Tab>
        </Tabs.List>

        {/* Chart for Soil Moisture readings */}
        <Tabs.Panel value="soil_moisture">
          <Title style={titleStyle}>
            Soil Moisture <i>over the past</i> {timeFilterChoice}
          </Title>
          <LineChart
            h={300} // height in pixels
            data={data} // array of reading objects
            dataKey="timestamp" // x-axis key
            series={[{ name: 'soil_moisture', color: 'indigo.6' }]} // y-axis line
            curveType="linear" // line shape
          />
        </Tabs.Panel>

        {/* Chart for Temperature readings */}
        <Tabs.Panel value="temperature">
          <Title style={titleStyle}>
            Temperature <i>over the past</i> {timeFilterChoice}
          </Title>
          <LineChart
            h={300}
            data={data}
            dataKey="timestamp"
            series={[{ name: 'temperature', color: 'indigo.6' }]}
            curveType="linear"
          />
        </Tabs.Panel>

        {/* Chart for Humidity readings */}
        <Tabs.Panel value="humidity">
          <Title style={titleStyle}>
            Humidity <i>over the past</i> {timeFilterChoice}
          </Title>
          <LineChart
            h={300}
            data={data}
            dataKey="timestamp"
            series={[{ name: 'humidity', color: 'indigo.6' }]}
            curveType="linear"
          />
        </Tabs.Panel>

        {/* Chart for Light readings */}
        <Tabs.Panel value="light">
          <Title style={titleStyle}>
            Light <i>over the past</i> {timeFilterChoice}
          </Title>
          <LineChart
            h={300}
            data={data}
            dataKey="timestamp"
            series={[{ name: 'light', color: 'indigo.6' }]}
            curveType="linear"
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default ChartTabs;