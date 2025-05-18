import { mockClient, mockDatabase, mockCollection } from './mockMongoDB.js';
import { GET, POST } from '@/app/api/plants/route';
import { GET as GET_PLANT, PUT, DELETE } from '@/app/api/plants/[plant]/route';
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

describe('/api/plants route handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test GET all plants', async () => {
    const fakePlants = [
      {
        name: 'Fern',
        plant_link: 'fern',
        last_status: 'Healthy',
        last_watered: '2025-05-05T15:30:00.000Z',
      },
      {
        name: 'Cactus',
        plant_link: 'cactus',
        last_status: 'Needs Water',
        last_watered: '2025-05-05T15:20:00.000Z',
      },
    ];
    mockCollection.toArray.mockResolvedValue(fakePlants);

    await GET(); //Send GET request and wait for response

    expect(mockDatabase.collection).toHaveBeenCalledWith('plants');
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCollection.toArray).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(fakePlants);
  });

  test('Test POST to create and add new plant', async () => {
    const requestBody = {
      name: 'Basil',
      plant_link: 'basil',
      last_status: 'Healthy',
      last_watered: '2025-05-10T10:30:00.000Z',
    };
    const mockRequest = {
      json: jest.fn().mockResolvedValue(requestBody),
    };

    await POST(mockRequest); //send POST request with body and await response

    expect(mockDatabase.collection).toHaveBeenCalledWith('plants');
    expect(mockCollection.insertOne).toHaveBeenCalledWith(requestBody);
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Plant added' });
  });
});

describe('/api/plants/[plant] route handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test GET a specific plant', async () => {
    const fakePlant = {
      name: 'Fern',
      plant_link: 'fern',
      last_status: 'Healthy',
      last_watered: '2025-05-05T15:30:00.000Z',
    };
    mockCollection.findOne.mockResolvedValue(fakePlant);
    const params = { plant: 'fern' };

    await GET_PLANT(null, { params });

    expect(mockDatabase.collection).toHaveBeenCalledWith('plants');
    expect(mockCollection.findOne).toHaveBeenCalledWith({ plant_link: 'fern' });
    expect(NextResponse.json).toHaveBeenCalledWith(fakePlant);
  });

  test('Test PUT to edit a specific plant', async () => {
    const params = { plant: 'fern' };
    const editedPlant = {
      last_status: 'Too Bright',
      last_watered: '2025-05-09T18:00:00.000Z',
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(editedPlant),
    };
    mockCollection.updateOne.mockResolvedValue({
      acknowledged: true,
      modifiedCount: 1,
    });

    await PUT(mockRequest, { params });

    expect(mockDatabase.collection).toHaveBeenCalledWith('plants');
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      {
        plant_link: 'fern',
      },
      { $set: editedPlant }
    );
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Plant updated',
    });
  });

  test('Test DELETE a specific plant', async () => {
    const params = { plant: 'fern' };

    mockCollection.deleteOne.mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });

    await DELETE(null, { params });

    expect(mockDatabase.collection).toHaveBeenCalledWith('plants');
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({
      plant_link: 'fern',
    });
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Plant deleted',
    });
  });
});
