INSERT INTO users (name, email, password)
VALUES ('Sheppard Toothill', 'stoothill0@ask.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ches Cristou', 'ccristou1@java.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Rossy Frost', 'rfrost2@ycombinator.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Anton Dossetter', 'adossetter3@illinois.edu', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Had Bodocs', 'hbodocs4@smh.com.au', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Overhold', 'description', 'thumbnail', 'cover photo', 1064, 1, 6, 2, 'Canada', '381 Barby Alley', 'Notre-Dame-de-lÎle-Perrot', 'Québec', 'H9X4Z1', true),
(2, 'Opela', 'description', 'thumbnail', 'cover photo', 1234, 3, 5, 4, 'Canada', '98 Brown Trail', 'Victoria', 'British Columbia', 'V9A3W5', true),
(3, 'Home Ing', 'description', 'thumbnail', 'cover photo', 651, 1, 7, 1, 'Canada', '57370 Clyde Gallagher Alley', 'Montréal-Est', 'Québec', 'J4M7L5', true),
(4, 'Job', 'description', 'thumbnail', 'cover photo', 1637, 3, 5, 2, 'Canada', '17999 Charing Cross Drive', 'Melville', 'Saskatchewan', 'S7W5L7', true),
(5, 'Tempsoft', 'description', 'thumbnail', 'cover photo', 1983, 4, 1, 2, 'Canada', '6495 Mayfield Way', 'Baie-DUrfé', 'Québec', 'H9X6L1', true);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 2, '2018-09-11', '2018-09-26'),
(2, 5, '2019-03-04', '2019-04-12'),
(3, 4, '2020-01-27', '2020-02-18'),
(5, 1, '2019-11-09', '2019-11-13'),
(4, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 5, 1, 5, 'message'),
(3, 4, 2, 4, 'message'),
(1, 2, 3, 5, 'message'),
(4, 1, 4, 3, 'message'),
(5, 3, 5, 5, 'message');