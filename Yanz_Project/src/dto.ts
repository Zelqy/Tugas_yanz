export interface CreateRentalDto {
  customerName: string;
  customerEmail?: string;
  vehiclePlate: string;
  rentalDate: string;
  endDate?: string;
  totalCost: number;
  amount: number;
  method?: string;
}

export interface UpdateRentalDto {
  vehiclePlate?: string;
  rentalDate?: string;
  endDate?: string;
  totalCost?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const ISO_8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/;

function isFilled(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function lenBetween(v: string, min: number, max: number): boolean {
  const n = v.trim().length;
  return n >= min && n <= max;
}

function isIsoDate(v: unknown): v is string {
  return typeof v === 'string' && ISO_8601.test(v) && !Number.isNaN(Date.parse(v));
}

export function validateCreateRental(input: unknown): ValidationResult {
  const errors: string[] = [];
  const dto = (input ?? {}) as Partial<CreateRentalDto>;

  if (!isFilled(dto.customerName)) {
    errors.push('customerName wajib diisi');
  } else if (!lenBetween(dto.customerName, 3, 50)) {
    errors.push('customerName harus 3 sampai 50 karakter');
  }

  if (!isFilled(dto.vehiclePlate)) {
    errors.push('vehiclePlate wajib diisi');
  } else if (!lenBetween(dto.vehiclePlate, 4, 12)) {
    errors.push('vehiclePlate harus 4 sampai 12 karakter');
  }

  if (!isIsoDate(dto.rentalDate)) {
    errors.push('rentalDate wajib format ISO-8601, contoh 2026-11-01T08:00:00.000Z');
  }

  if (dto.endDate !== undefined && dto.endDate !== null) {
    if (!isIsoDate(dto.endDate)) {
      errors.push('endDate wajib format ISO-8601');
    } else if (isIsoDate(dto.rentalDate) && Date.parse(dto.endDate) <= Date.parse(dto.rentalDate)) {
      errors.push('endDate harus setelah rentalDate');
    }
  }

  if (typeof dto.totalCost !== 'number' || Number.isNaN(dto.totalCost)) {
    errors.push('totalCost wajib berupa angka');
  } else if (dto.totalCost < 0) {
    errors.push('totalCost tidak boleh negatif');
  }

  if (typeof dto.amount !== 'number' || Number.isNaN(dto.amount)) {
    errors.push('amount wajib berupa angka');
  } else if (dto.amount <= 0) {
    errors.push('amount harus lebih besar dari 0');
  }

  if (dto.method !== undefined && dto.method !== null) {
    if (!isFilled(dto.method) || !lenBetween(dto.method, 3, 20)) {
      errors.push('method harus 3 sampai 20 karakter');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateRental(input: unknown): ValidationResult {
  const errors: string[] = [];
  const dto = (input ?? {}) as Partial<UpdateRentalDto>;

  if (dto.vehiclePlate !== undefined && dto.vehiclePlate !== null) {
    if (!isFilled(dto.vehiclePlate)) errors.push('vehiclePlate wajib diisi');
    else if (!lenBetween(dto.vehiclePlate, 4, 12)) errors.push('vehiclePlate harus 4 sampai 12 karakter');
  }

  if (dto.rentalDate !== undefined && dto.rentalDate !== null && !isIsoDate(dto.rentalDate)) {
    errors.push('rentalDate wajib format ISO-8601');
  }

  if (dto.endDate !== undefined && dto.endDate !== null) {
    if (!isIsoDate(dto.endDate)) errors.push('endDate wajib format ISO-8601');
    else if (isIsoDate(dto.rentalDate) && Date.parse(dto.endDate) <= Date.parse(dto.rentalDate)) {
      errors.push('endDate harus setelah rentalDate');
    }
  }

  if (dto.totalCost !== undefined && dto.totalCost !== null) {
    if (typeof dto.totalCost !== 'number' || Number.isNaN(dto.totalCost)) errors.push('totalCost wajib berupa angka');
    else if (dto.totalCost < 0) errors.push('totalCost tidak boleh negatif');
  }

  if (
    (dto.vehiclePlate === undefined || dto.vehiclePlate === null) &&
    (dto.rentalDate === undefined || dto.rentalDate === null) &&
    (dto.endDate === undefined || dto.endDate === null) &&
    (dto.totalCost === undefined || dto.totalCost === null)
  ) {
    errors.push('tidak ada field yang diubah');
  }

  return { valid: errors.length === 0, errors };
}
