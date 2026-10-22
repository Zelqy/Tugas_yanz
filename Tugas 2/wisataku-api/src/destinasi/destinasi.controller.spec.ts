import { Test, TestingModule } from '@nestjs/testing';
import { DestinasiController } from './destinasi.controller';

describe('DestinasiController', () => {
  let controller: DestinasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinasiController],
    }).compile();

    controller = module.get<DestinasiController>(DestinasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
