const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
(async()=>{
  try { await p.$connect(); console.log('DB OK'); process.exit(0); }
  catch(e) { console.error('DB ERR:', e.message); process.exit(1); }
})();
