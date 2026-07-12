-- 12 real Singapore hawker centres, mixed hot/cold for demo purposes.
-- Run after 0001_init.sql.

insert into hawker_centres (name, address, lat, lng, is_hot) values
  ('Maxwell Food Centre', '1 Kadayanallur St, Singapore 069184', 1.2802, 103.8447, true),
  ('Tiong Bahru Market', '30 Seng Poh Rd, Singapore 168898', 1.2847, 103.8322, false),
  ('Chinatown Complex Food Centre', '335 Smith St, Singapore 050335', 1.2822, 103.8437, true),
  ('Old Airport Road Food Centre', '51 Old Airport Rd, Singapore 390051', 1.3086, 103.8853, true),
  ('Tekka Centre', '665 Buffalo Rd, Singapore 210665', 1.3062, 103.8508, false),
  ('Amoy Street Food Centre', '7 Maxwell Rd, Singapore 069111', 1.2789, 103.8477, true),
  ('Adam Road Food Centre', '2 Adam Rd, Singapore 289876', 1.3244, 103.8156, false),
  ('Newton Food Centre', '500 Clemenceau Ave North, Singapore 229495', 1.3126, 103.8382, false),
  ('Lau Pa Sat', '18 Raffles Quay, Singapore 048582', 1.2805, 103.8503, true),
  ('Tanjong Pagar Plaza Food Centre', '6 Tanjong Pagar Plaza, Singapore 081006', 1.2762, 103.8420, false),
  ('Golden Mile Food Centre', '505 Beach Rd, Singapore 199583', 1.3026, 103.8626, false),
  ('East Coast Lagoon Food Village', '1220 East Coast Parkway, Singapore 468960', 1.3007, 103.9284, true);
