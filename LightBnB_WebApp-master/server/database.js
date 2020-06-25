const { Pool } = require('pg');

const configuration = {
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
};
const pool = new Pool(configuration);

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
	return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1`, [email])
		.then((res) => res.rows[0]);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
	return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1`, [id])
		.then((res) => res.rows[0]);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
	const { name, password, email} = user;
	return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [name, email, password])
		.then(res => res.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
	return pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
		.then((res) => res.rows);
	// return getAllProperties(null, 2);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
	const queryParams = [];
	// Default query
	let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

	// Query options
	if (options.city) {
		queryParams.push(`%${options.city}%`);
		queryString += `WHERE city LIKE $${queryParams.length} `;
	}

	if (options.owner_id) {
		queryParams.push(`${options.owner_id}`);
		queryString += concatOptionsHelper (queryParams);
		queryString += `owner_id LIKE $${queryParams.length} `;
	}

	if (options.minimum_price_per_night) {
		queryParams.push(options.minimum_price_per_night * 100);
		queryString += concatOptionsHelper (queryParams);
		queryString += `cost_per_night >= $${queryParams.length} `;
	}

	if (options.maximum_price_per_night) {
		queryParams.push(options.maximum_price_per_night * 100);
		queryString += concatOptionsHelper (queryParams);

		queryString += `cost_per_night <= $${queryParams.length} `;
	}

	if (options.minimum_rating) {
		queryParams.push(`${options.minimum_rating}`);
		queryString += concatOptionsHelper (queryParams);

		queryString += `rating >= $${queryParams.length} `;
	}

	// The limit option for the number of rows
	queryParams.push(limit);
	queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

	// Query call
	return pool.query(queryString, queryParams)
		.then(res => res.rows);
};


exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {

};
exports.addProperty = addProperty;

/**
 * Concats either AND or WHERE depending if there are previous options
 * @param {*} options The array that will be used to grab the number of options
 * @return {String} A string of either '\nAND' or 'WHERE'
 */
const concatOptionsHelper = (options) => {
	if (options.length > 1) {
		return '\nAND ';
	} else {
		return 'WHERE ';
	}
};