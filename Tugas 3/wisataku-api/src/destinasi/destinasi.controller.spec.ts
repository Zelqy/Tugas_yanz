import { Test, TestingModule } from '@nestjs/testing';
import { DestinasiController } from './destinasi.controller';
import { DestinasiService } from './destinasi.service';

// Mock DestinasiService
export const mockDestinasiService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('DestinasiController', () => {
  let controller: DestinasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinasiController],
      providers: [{ provide: DestinasiService, useValue: mockDestinasiService }],
    }).compile();

    controller = module.get<DestinasiController>(DestinasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array', async () => {
      mockDestinasiService.findAll.mockResolvedValue([{ id: 1, nama: 'Test', kategori: 'Test', hargaTiket: 1000 }]);
      const result = await controller.findAll();
      expect(result).toHaveLength(1);
    });
  });
});