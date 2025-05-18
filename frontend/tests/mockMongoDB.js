export const mockCollection = {
  find: jest.fn().mockReturnThis(),
  aggregate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
  insertOne: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

export const mockDatabase = {
  collection: jest.fn(() => mockCollection),
};

export const mockClient = {
  db: jest.fn(() => mockDatabase),
};
