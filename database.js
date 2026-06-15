import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT,
      price TEXT,
      category TEXT
    );
  `);
}

export async function getMenuItems() {
  const result = await db.getAllAsync('SELECT * FROM menuitems');
  return result;
}

export async function saveMenuItems(menuItems) {

  if (!menuItems?.length) return;

  const values = menuItems
    .map(
      (item) =>
        `('${item.id}', '${item.title}', '${item.price}', '${item.category}')`
    )
    .join(',');

  const query = `
    INSERT INTO menuitems (id, title, price, category)
    VALUES ${values};
  `;

  await db.execAsync(query);
}


export async function filterByQueryAndCategories(
  query,
  activeCategories
) {
  try {
    // Crear placeholders dinámicos para categorías
    const categoryPlaceholders = activeCategories
      .map(() => '?')
      .join(',');

    // SQL con filtros por título y categoría
    const sql = `
      SELECT *
      FROM menuitems
      WHERE title LIKE ?
      AND category IN (${categoryPlaceholders})
    `;

    // Parámetros
    const params = [
      `%${query}%`,
      ...activeCategories,
    ];

    // Ejecutar query
    const result = await db.getAllAsync(sql, params);

    return result;
  } catch (error) {
    throw error;
  }
}
