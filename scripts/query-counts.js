const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:/home/z/my-project/db/custom.db' });

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
