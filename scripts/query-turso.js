const { createClient } = require('@libsql/client');

const db = createClient({
  url: 'libsql://dc254-kjonathan254.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODY1NTIxNTEsImlkIjoiMDE5ZmY2Y2QtYzEwMS03MDdiLWI0NWItMTgwOGQyMzUwYWNjIiwia2lkIjoiSmN4TklHeTM4NFl1SmI4S1BETV9DMzJqRDBkdFZJa3ZCbm92X1pLWDR2ZyIsInJpZCI6Ijc4NTE3YWY5LTFhNGItNDA4NC1iZjcxLWNhNzJlYzkwNjgxYyJ9.ruBdMiPR0QJ5PD_gFVrUrv7IA4L_E_611iJnxbLtIVrt9fTbn-wXwqiDmSWfKNEYgUNvjwYhSeap0nht1M3IBg',
});

async function main() {
  const articles = await db.execute(`
    SELECT cluster, status, COUNT(*) as cnt 
    FROM Article 
    GROUP BY cluster, status 
    ORDER BY cluster, status
  `);
  console.log('\n=== ARTICLES BY CLUSTER ===');
  console.log('Cluster'.padEnd(15) + 'Status'.padEnd(12) + 'Count');
  console.log('-'.repeat(40));
  articles.rows.forEach(r => console.log(String(r[0]).padEnd(15) + String(r[1]).padEnd(12) + r[2]));

  const total = await db.execute('SELECT COUNT(*) as n FROM Article');
  const published = await db.execute("SELECT COUNT(*) as n FROM Article WHERE status = 'Published'");
  console.log('\nTotal: ' + total.rows[0][0] + ' | Published: ' + published.rows[0][0]);

  const fac = await db.execute('SELECT COUNT(*) as n FROM Facility');
  const facOp = await db.execute("SELECT COUNT(*) as n FROM Facility WHERE status = 'Operational'");
  console.log('\n=== FACILITIES ===');
  console.log('Total: ' + fac.rows[0][0] + ' | Operational: ' + facOp.rows[0][0]);

  const subs = await db.execute("SELECT COUNT(*) as n FROM Subscriber WHERE status = 'Active'");
  console.log('\nNewsletter subscribers: ' + subs.rows[0][0]);

  db.close();
}
main().catch(e => console.error(e.message));
