-- Insert sample gallery posts
INSERT INTO public.gallery_posts (title, category, description) VALUES
('Modern Family Home', 'residential', 'A beautiful contemporary family home with open-plan living'),
('Downtown Office Complex', 'commercial', 'State-of-the-art commercial building in the heart of the city'),
('Historic Home Restoration', 'renovation', 'Complete renovation of a 100-year-old Victorian home');

-- Insert sample gallery images
INSERT INTO public.gallery_images (gallery_post_id, image_url, display_order)
SELECT id, '/src/assets/building-modern-home.jpg', 0 FROM public.gallery_posts WHERE title = 'Modern Family Home'
UNION ALL
SELECT id, '/src/assets/building-commercial.jpg', 0 FROM public.gallery_posts WHERE title = 'Downtown Office Complex'
UNION ALL
SELECT id, '/src/assets/building-renovation-interior.jpg', 0 FROM public.gallery_posts WHERE title = 'Historic Home Restoration';

-- Insert sample realty posts (using correct values: type=sale/lease, category=residential/commercial)
INSERT INTO public.realty_posts (title, description, price, location, type, category, living_room_sqm, kitchen_sqm) VALUES
('Luxury Villa', 'Stunning luxury villa with mountain views', '$850,000', 'Highland District', 'sale', 'residential', 45.5, 25.0),
('Modern Apartment', 'Contemporary apartment in the city center', '$2,500/month', 'Downtown', 'lease', 'residential', 35.0, 15.0),
('Family House', 'Spacious family house with garden', '$650,000', 'Suburban Area', 'sale', 'residential', 50.0, 20.0);

-- Insert sample realty images
INSERT INTO public.realty_images (realty_post_id, image_url, display_order)
SELECT id, '/src/assets/project-residential.jpg', 0 FROM public.realty_posts WHERE title = 'Luxury Villa'
UNION ALL
SELECT id, '/src/assets/project-commercial.jpg', 0 FROM public.realty_posts WHERE title = 'Modern Apartment'
UNION ALL
SELECT id, '/src/assets/project-renovation.jpg', 0 FROM public.realty_posts WHERE title = 'Family House';

-- Insert sample bedrooms
INSERT INTO public.realty_bedrooms (realty_post_id, name, sqm)
SELECT id, 'Master Bedroom', 25.0 FROM public.realty_posts WHERE title = 'Luxury Villa'
UNION ALL
SELECT id, 'Bedroom 2', 18.0 FROM public.realty_posts WHERE title = 'Luxury Villa'
UNION ALL
SELECT id, 'Bedroom 3', 16.0 FROM public.realty_posts WHERE title = 'Luxury Villa'
UNION ALL
SELECT id, 'Master Bedroom', 20.0 FROM public.realty_posts WHERE title = 'Modern Apartment'
UNION ALL
SELECT id, 'Bedroom 2', 15.0 FROM public.realty_posts WHERE title = 'Modern Apartment'
UNION ALL
SELECT id, 'Master Bedroom', 22.0 FROM public.realty_posts WHERE title = 'Family House'
UNION ALL
SELECT id, 'Bedroom 2', 18.0 FROM public.realty_posts WHERE title = 'Family House'
UNION ALL
SELECT id, 'Bedroom 3', 16.0 FROM public.realty_posts WHERE title = 'Family House'
UNION ALL
SELECT id, 'Bedroom 4', 14.0 FROM public.realty_posts WHERE title = 'Family House';