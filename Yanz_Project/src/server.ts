import { readFileSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { validateCreateRental, validateUpdateRental } from './dto';
import * as penyewaan from './penyewaan.service';

const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8');

const iso = (value: any) => (value instanceof Date ? value.toISOString() : value);

function serializeRental(rental: any): any {
  if (!rental) return null;
  const out: any = { ...rental };
  out.rentalDate = iso(rental.rentalDate);
  out.endDate = iso(rental.endDate);
  out.transactions = Array.isArray(rental.transactions) ? rental.transactions.map(serializeTransaction) : [];
  return out;
}

function serializeTransaction(transaction: any): any {
  if (!transaction) return null;
  const out: any = { ...transaction };
  out.createdAt = iso(transaction.createdAt);
  out.rental = serializeRental(transaction.rental);
  return out;
}

const resolvers = {
  Query: {
    rentals: async () => (await penyewaan.listRentals()).map(serializeRental),
    rental: async (_parent: any, args: { id: number }) => serializeRental(await penyewaan.getRentalById(args.id)),
    transactions: async () => (await penyewaan.listTransactions()).map(serializeTransaction),
    transaction: async (_parent: any, args: { id: number }) => serializeTransaction(await penyewaan.getTransactionById(args.id))
  }
};

const app = express();
app.use(cors());
app.use(express.json());

const wrap = (handler: any) => (req: any, res: any, next: any) => handler(req, res, next).catch(next);

app.get('/health', (_req: any, res: any) => res.json({ status: 'ok', service: 'penyewaan' }));

const playgroundHtml = readFileSync(new URL('./graphiql.html', import.meta.url), 'utf8');
app.get('/playground', (_req: any, res: any) => res.type('html').send(playgroundHtml));

app.post('/api/rentals', wrap(async (req: any, res: any) => {
  const check = validateCreateRental(req.body);
  if (!check.valid) return res.status(400).json({ errors: check.errors });
  const created = await penyewaan.createRental(req.body);
  return res.status(201).json(created);
}));

app.put('/api/rentals/:id', wrap(async (req: any, res: any) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ errors: ['id harus integer positif'] });
  const check = validateUpdateRental(req.body);
  if (!check.valid) return res.status(400).json({ errors: check.errors });
  const updated = await penyewaan.updateRental(id, req.body);
  if (!updated) return res.status(404).json({ errors: ['rental tidak ditemukan'] });
  return res.json(updated);
}));

app.get('/api/rentals', wrap(async (_req: any, res: any) => {
  return res.json(await penyewaan.listRentals());
}));

app.get('/api/transactions/:id', wrap(async (req: any, res: any) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ errors: ['id harus integer positif'] });
  const transaction = await penyewaan.getTransactionById(id);
  if (!transaction) return res.status(404).json({ errors: ['transaksi tidak ditemukan'] });
  return res.json(transaction);
}));

const apollo = new ApolloServer({ typeDefs, resolvers, csrfPrevention: false, introspection: true });
await apollo.start();

const sandboxHtml = readFileSync(new URL('./sandbox.html', import.meta.url), 'utf8');
app.get('/graphql', (req: any, res: any, next: any) => {
  if (req.accepts(['json', 'html']) === 'html') return res.type('html').send(sandboxHtml);
  return next();
});
app.use('/graphql', expressMiddleware(apollo));

app.use((req: any, res: any) => {
  res.status(404).json({ errors: ['endpoint tidak ditemukan: ' + req.method + ' ' + req.originalUrl] });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  const status = Number(err && (err.status || err.statusCode)) || 500;
  const clientError = err && (err.type === 'entity.parse.failed' || (status >= 400 && status < 500));
  const message = err && err.type === 'entity.parse.failed'
    ? 'body bukan JSON yang valid'
    : (err instanceof Error ? err.message : 'internal error');
  if (!clientError) console.error(err);
  res.status(clientError ? status : 500).json({ errors: [message] });
});

const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, () => {
  console.log('REST siap   : http://localhost:' + PORT + '/api/rentals');
  console.log('GraphQL/Sandbox: http://localhost:' + PORT + '/graphql');
});

server.on('error', (err: any) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error('Port ' + PORT + ' sudah dipakai proses lain.');
    console.error('Matikan proses itu, atau jalankan di port lain: $env:PORT=3001; npm start');
    process.exit(1);
  }
  throw err;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      penyewaan.prisma.$disconnect().finally(() => process.exit(0));
    });
  });
}
