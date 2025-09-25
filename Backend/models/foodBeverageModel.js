import db from '../config/db.js';

const FoodBeverage = {
  getAll: () => db.query('SELECT * FROM food_beverages'),
  getById: (id) => db.query('SELECT * FROM food_beverages WHERE id = ?', [id]),
  create: (data) => db.query('INSERT INTO food_beverages SET ?', [data]),
  update: (id, data) => db.query('UPDATE food_beverages SET ? WHERE id = ?', [data, id]),
  delete: (id) => db.query('DELETE FROM food_beverages WHERE id = ?', [id]),
};

export default FoodBeverage;
