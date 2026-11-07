import { strict as assert } from 'node:assert';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function post(path: string, body: unknown) {
  return fetch(BASE + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

async function gql(query: string) {
  const res = await post('/graphql', { query });
  assert.equal(res.status, 200, 'graphql status');
  const json: any = await res.json();
  assert.ok(!json.errors, 'graphql errors: ' + JSON.stringify(json.errors));
  return json.data;
}

const health = await fetch(BASE + '/health');
assert.equal(health.status, 200);

const list = await fetch(BASE + '/api/rentals');
assert.equal(list.status, 200);
const rentals: any = await list.json();
assert.ok(Array.isArray(rentals) && rentals.length >= 1, 'rental list tidak kosong');
assert.ok(rentals[0].customer.name, 'relasi customer ikut terkirim');
assert.ok(rentals[0].vehicle.brand, 'relasi vehicle ikut terkirim');

const bad = await post('/api/rentals', { customerName: 'Ya', vehiclePlate: 'AB', rentalDate: '06-11-2026', totalCost: -1, amount: 0 });
assert.equal(bad.status, 400, 'DTO harus menolak input tidak valid');
const badBody: any = await bad.json();
assert.ok(badBody.errors.length >= 5, 'semua error validasi terkumpul: ' + badBody.errors.length);

const created = await post('/api/rentals', {
  customerName: 'Smoke Test 011',
  customerEmail: 'smoke.011@example.com',
  vehiclePlate: 'B 1011 SM',
  rentalDate: '2026-11-06T09:00:00.000Z',
  endDate: '2026-11-09T09:00:00.000Z',
  totalCost: 450000,
  amount: 450000,
  method: 'transfer'
});
assert.equal(created.status, 201, 'POST /api/rentals');
const createdBody: any = await created.json();
const newId = createdBody.rental.id;
assert.ok(createdBody.transaction.id, 'transaksi ikut dibuat');
assert.ok(JSON.stringify(createdBody).includes('011'), 'NIM suffix muncul di response');

const updated = await fetch(BASE + '/api/rentals/' + newId, {
  method: 'PUT',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ totalCost: 500000 })
});
assert.equal(updated.status, 200, 'PUT /api/rentals/:id');
const updatedBody: any = await updated.json();
assert.equal(updatedBody.totalCost, 500000);

const tx = await fetch(BASE + '/api/transactions/1');
assert.equal(tx.status, 200);
const txBody: any = await tx.json();
assert.equal(txBody.id, 1);
assert.ok(txBody.customer.name, 'transaksi + customer');
assert.ok(txBody.rental.vehicle.plate, 'transaksi + rental + vehicle');

const data: any = await gql('query { rental(id: 1) { rentalDate totalCost customer { name } vehicle { brand } } }');
assert.ok(data.rental.rentalDate, 'rentalDate');
assert.equal(typeof data.rental.totalCost, 'number', 'totalCost');
assert.ok(data.rental.customer.name, 'customer.name');
assert.ok(data.rental.vehicle.brand, 'vehicle.brand');

const data2: any = await gql('query { transaction(id: 1) { id amount customer { name } rental { rentalDate vehicle { brand } } } }');
assert.ok(data2.transaction.customer.name, 'transaction.customer');
assert.ok(data2.transaction.rental.vehicle.brand, 'transaction.rental.vehicle');

console.log('SMOKE OK - semua endpoint + DTO + GraphQL lolos');
