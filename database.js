import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {  
  await db.execAsync('DROP TABLE IF EXISTS menuitems;');
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT,
      description TEXT,
      price TEXT,
      category TEXT,
      image TEXT
    );
  `);
}

export async function getMenuItems() {
  const result = await db.getAllAsync('SELECT * FROM menuitems');
  return result;
}

export async function saveMenuItems(menuItems) {
  if (!menuItems?.length) return;

  // ✅ Limpiar tabla antes de insertar nuevos datos
  await db.execAsync('DELETE FROM menuitems;');

  for (const item of menuItems) {
    const query = `
      INSERT INTO menuitems (id, title, description, price, category, image)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await db.runAsync(query, [
      item.id,
      item.title,
      item.description || '',
      item.price,
      item.category,
      item.image || ''
    ]);
  }
}