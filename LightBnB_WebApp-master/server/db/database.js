const { Pool } = require("pg");

const configuration = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};
const pool = new Pool(configuration);

module.exports = {
  /**
   * Get a single user from the database given their email.
   * @param {String} email The email of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserWithEmail: function (email) {
    return pool
      .query(
        `
  SELECT *
  FROM users
  WHERE email = $1`,
        [email]
      )
      .then((res) => res.rows[0]);
  },

  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserWithId: function (id) {
    return pool
      .query(
        `
  SELECT *
  FROM users
  WHERE id = $1`,
        [id]
      )
      .then((res) => res.rows[0]);
  },
  /**
   * Add a new user to the database.
   * @param {{name: string, password: string, email: string}} user
   * @return {Promise<{}>} A promise to the user.
   */
  addUser: function (user) {
    const { name, password, email } = user;
    return pool
      .query(
        `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`,
        [name, email, password]
      )
      .then((res) => res.rows[0]);
  },
  /// Reservations

  /**
   * Get all reservations for a single user.
   * @param {string} guest_id The id of the user.
   * @return {Promise<[{}]>} A promise to the reservations.
   */
  getAllReservations: function (guest_id, limit = 10) {
    return pool
      .query(
        `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `,
        [guest_id, limit]
      )
      .then((res) => res.rows);
    // return getAllProperties(null, 2);
  },
  getAllProperties: function (options, limit = 10) {
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
      queryString += concatOptionsHelper(queryParams);
      queryString += `owner_id LIKE $${queryParams.length} `;
    }

    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += concatOptionsHelper(queryParams);
      queryString += `cost_per_night >= $${queryParams.length} `;
    }

    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += concatOptionsHelper(queryParams);

      queryString += `cost_per_night <= $${queryParams.length} `;
    }

    if (options.minimum_rating) {
      queryParams.push(`${options.minimum_rating}`);
      queryString += concatOptionsHelper(queryParams);

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
    return pool.query(queryString, queryParams).then((res) => res.rows);
  },

  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  addProperty: function (property) {
    const {
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
      country,
      street,
      city,
      province,
      post_code,
    } = property;
    return pool
      .query(
        `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`,
        [
          owner_id,
          title,
          description,
          thumbnail_photo_url,
          cover_photo_url,
          cost_per_night * 100,
          parking_spaces,
          number_of_bathrooms,
          number_of_bedrooms,
          country,
          street,
          city,
          province,
          post_code,
        ]
      )
      .then((res) => {
        console.log(res.rows[0]);
        res.rows[0];
      });
  },
  concatOptionsHelper: (options) => {
    if (options.length > 1) {
      return "\nAND ";
    } else {
      return "WHERE ";
    }
  },
};