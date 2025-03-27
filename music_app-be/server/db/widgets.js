const pg = require("pg");

const client = new pg.Client();

const createTables = async () => {
  try {
    const SQL = `
        DROP TABLE IF EXISTS widgets;
        CREATE TABLE widgets(id SERIAL PRIMARY KEY, name VARCHAR(64) NOT NULL);
    `;
    console.log("Creating tables...");
    await client.query(SQL);
    console.log("Tables created!");
  } catch (err) {
    console.error(err);
  }
};

const createWidget = async (widgetName) => {
  try {
    const SQL = `INSERT INTO widgets(name) VALUES($1) RETURNING *;`;
    const { rows } = await client.query(SQL, [widgetName]);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
};

const fetchWidgets = async () => {
  try {
    const SQL = `SELECT * FROM widgets;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { client, createTables, createWidget, fetchWidgets };
