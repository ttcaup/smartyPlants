import { mockClient, mockDatabase, mockCollection } from './mockMongoDB.js';
import { GET } from '@/app/api/readings/route';
import { GET as GET_PLANT } from '@/app/api/readings/[plant]/route';
import { NextResponse } from 'next/server';

//create mocks
jest.mock('@/lib/mongo', () => ({
  __esModule: true,
  default: Promise.resolve({
    db: mockClient.db,
  }),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('/api/readings route handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test GET all readings for all plants', async () => {
    const fakePlantReadings = [
      {
        timestamp: {
          $date: '2025-05-03T23:00:00.000Z',
        },
        plant_info: {
          plant_link: 'fern',
        },
        humidity: 57,
        light: 887,
        temperature: 75,
        watered: true,
        soil_moisture: 673,
      },
      {
        timestamp: {
          $date: '2025-05-03T22:00:00.000Z',
        },
        plant_info: {
          plant_link: 'fern',
        },
        humidity: 63,
        light: 576,
        temperature: 78,
        soil_moisture: 342,
      },
      {
        timestamp: {
          $date: '2025-05-06T12:30:50.000Z',
        },
        plant_info: {
          plant_link: 'cactus',
        },
        humidity: 45,
        light: 200,
        temperature: 95,
        soil_moisture: 302,
      },
    ];
    mockCollection.toArray.mockResolvedValue(fakePlantReadings);

    await GET(); //Send GET request and wait for response

    expect(mockDatabase.collection).toHaveBeenCalledWith('readings');
    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$plant_info.plant_link',
          latestReading: { $first: '$$ROOT' },
        },
      },
    ]);
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(fakePlantReadings);
  });
});

describe('/api/readings/[plant] route handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test GET latest readings for specific plant', async () => {
    const fakePlantReadings = [
      {
        timestamp: {
          $date: '2025-05-03T23:00:00.000Z',
        },
        plant_info: {
          plant_link: 'fern',
        },
        humidity: 57,
        light: 887,
        temperature: 75,
        watered: true,
        soil_moisture: 673,
      },
      {
        timestamp: {
          $date: '2025-05-03T22:00:00.000Z',
        },
        plant_info: {
          plant_link: 'fern',
        },
        humidity: 63,
        light: 576,
        temperature: 78,
        soil_moisture: 342,
      },
      {
        timestamp: {
          $date: '2025-05-06T12:30:50.000Z',
        },
        plant_info: {
          plant_link: 'cactus',
        },
        humidity: 45,
        light: 200,
        temperature: 95,
        soil_moisture: 302,
      },
    ];
    mockCollection.toArray.mockResolvedValue(fakePlantReadings);

    const params = { plant: 'fern' };

    await GET_PLANT(null, { params });

    expect(mockDatabase.collection).toHaveBeenCalledWith('readings');
    expect(mockCollection.find).toHaveBeenCalledWith({
      'plant_info.plant_link': 'fern',
    });
    expect(mockCollection.sort).toHaveBeenCalledWith({ timestamp: -1 });
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(fakePlantReadings);
  });
});
