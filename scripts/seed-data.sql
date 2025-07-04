-- Seed Data for CivicHero Platform

-- Insert sample users
INSERT INTO users (phone, county, language, tokens, role) VALUES
('+254712345678', 'Nairobi', 'en', 1250, 'user'),
('+254723456789', 'Mombasa', 'sw', 890, 'user'),
('+254734567890', 'Kisumu', 'en', 2100, 'user'),
('+254745678901', 'Nakuru', 'sw', 450, 'user'),
('+254756789012', 'Eldoret', 'en', 1800, 'user'),
('+254767890123', 'Nairobi', 'sw', 0, 'admin'),
('+254778901234', 'Mombasa', 'en', 0, 'partner');

-- Insert sample lessons
INSERT INTO lessons (title_en, title_sw, content_en, content_sw, difficulty, category, status) VALUES
('Understanding County Government', 'Kuelewa Serikali ya Kaunti', 
 'Learn about the structure and functions of county governments in Kenya. County governments are responsible for local administration and service delivery.',
 'Jifunze kuhusu muundo na kazi za serikali za kaunti nchini Kenya. Serikali za kaunti zinawajibika kwa utawala wa ndani na utoaji wa huduma.',
 1, 'governance', 'published'),

('Environmental Conservation', 'Uhifadhi wa Mazingira',
 'Discover ways to protect and preserve our environment. Learn about sustainable practices and community involvement in environmental protection.',
 'Gundua njia za kulinda na kuhifadhi mazingira yetu. Jifunze kuhusu mazoea endelevu na ushiriki wa jamii katika kulinda mazingira.',
 2, 'environment', 'published'),

('Citizen Rights and Duties', 'Haki na Majukumu ya Raia',
 'Understanding your rights and responsibilities as a Kenyan citizen. Learn about the constitution and civic participation.',
 'Kuelewa haki na majukumu yako kama raia wa Kenya. Jifunze kuhusu katiba na ushiriki wa kiraia.',
 1, 'rights', 'published'),

('Water Resource Management', 'Usimamizi wa Rasilimali za Maji',
 'Learn about sustainable water management practices and community water projects. Understand the importance of clean water access.',
 'Jifunze kuhusu mazoea endelevu ya usimamizi wa maji na miradi ya maji ya jamii. Elewa umuhimu wa upatikanaji wa maji safi.',
 2, 'environment', 'published'),

('Digital Literacy for Citizens', 'Ujuzi wa Kidijitali kwa Raia',
 'Basic digital skills for modern civic engagement. Learn how to access government services online and participate in digital democracy.',
 'Ujuzi wa msingi wa kidijitali kwa ushiriki wa kiraia wa kisasa. Jifunze jinsi ya kupata huduma za serikali mtandaoni na kushiriki katika demokrasia ya kidijitali.',
 3, 'governance', 'draft');

-- Insert sample tasks
INSERT INTO tasks (type, title_en, title_sw, description_en, description_sw, reward, location, status) VALUES
('photo_verification', 'Document Road Condition', 'Rekodi Hali ya Barabara',
 'Take photos of road conditions in your area and report any issues that need attention.',
 'Piga picha za hali ya barabara katika eneo lako na ripoti masuala yoyote yanayohitaji umakini.',
 50, ST_GeogFromText('POINT(36.8219 -1.2921)'), 'active'),

('community_service', 'Clean Water Point', 'Safisha Kiwanja cha Maji',
 'Help clean and maintain the community water point to ensure clean water access for all.',
 'Saidia kusafisha na kutunza kiwanja cha maji cha jamii ili kuhakikisha upatikanaji wa maji safi kwa wote.',
 100, ST_GeogFromText('POINT(36.8172 -1.2850)'), 'active'),

('education_outreach', 'Teach Digital Skills', 'Fundisha Ujuzi wa Kidijitali',
 'Conduct a digital literacy session for community members who need help with technology.',
 'Fanya kikao cha ujuzi wa kidijitali kwa wanajamii wanaohitaji msaada na teknolojia.',
 150, ST_GeogFromText('POINT(36.8300 -1.2800)'), 'active'),

('environmental_action', 'Tree Planting Drive', 'Msukumo wa Kupanda Miti',
 'Participate in community tree planting to help combat climate change and improve air quality.',
 'Shiriki katika kupanda miti kwa jamii ili kusaidia kupambana na mabadiliko ya tabianchi na kuboresha ubora wa hewa.',
 75, ST_GeogFromText('POINT(36.8100 -1.3000)'), 'active');

-- Insert sample user progress
INSERT INTO user_lessons (user_id, lesson_id, progress, completed, completed_at) VALUES
((SELECT id FROM users WHERE phone = '+254712345678'), 1, 100, true, NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE phone = '+254712345678'), 2, 75, false, NULL),
((SELECT id FROM users WHERE phone = '+254723456789'), 1, 50, false, NULL),
((SELECT id FROM users WHERE phone = '+254734567890'), 3, 100, true, NOW() - INTERVAL '1 day');

-- Insert sample task submissions
INSERT INTO user_tasks (user_id, task_id, status, proof_image_url, submission_notes, submitted_at) VALUES
((SELECT id FROM users WHERE phone = '+254712345678'), 1, 'pending', '/placeholder.svg?height=300&width=400', 'Road has several potholes that need repair', NOW() - INTERVAL '1 hour'),
((SELECT id FROM users WHERE phone = '+254723456789'), 2, 'approved', '/placeholder.svg?height=300&width=400', 'Water point cleaned and disinfected', NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE phone = '+254734567890'), 3, 'pending', '/placeholder.svg?height=300&width=400', 'Taught 15 community members basic smartphone usage', NOW() - INTERVAL '30 minutes');

-- Insert sample token transactions
INSERT INTO token_transactions (user_id, amount, type, source, source_id, description) VALUES
((SELECT id FROM users WHERE phone = '+254712345678'), 100, 'earned', 'lesson', 1, 'Completed lesson: Understanding County Government'),
((SELECT id FROM users WHERE phone = '+254712345678'), 50, 'earned', 'task', 2, 'Completed task: Clean Water Point'),
((SELECT id FROM users WHERE phone = '+254723456789'), 75, 'earned', 'lesson', 1, 'Completed lesson: Understanding County Government'),
((SELECT id FROM users WHERE phone = '+254734567890'), 150, 'earned', 'task', 3, 'Completed task: Teach Digital Skills'),
((SELECT id FROM users WHERE phone = '+254745678901'), -200, 'spent', 'reward', 1, 'Redeemed: Mobile Data Bundle');

-- Insert sample partners
INSERT INTO partners (name, contact_email, contact_phone, status) VALUES
('Safaricom Kenya', 'partnerships@safaricom.co.ke', '+254722000000', 'active'),
('Kenya Power', 'community@kplc.co.ke', '+254711000000', 'active'),
('Equity Bank', 'csr@equitybank.co.ke', '+254763000000', 'active');

-- Insert sample partner offers
INSERT INTO partner_offers (partner_id, name, description, token_value, stock_count, redemption_code, status) VALUES
(1, 'Mobile Data Bundle 1GB', 'Get 1GB of mobile data for your smartphone', 200, 100, 'DATA1GB001', 'active'),
(1, 'Airtime Credit KES 100', 'Receive KES 100 airtime credit', 150, 200, 'AIRTIME100', 'active'),
(2, 'Electricity Tokens KES 500', 'Get KES 500 worth of electricity tokens', 400, 50, 'POWER500', 'active'),
(3, 'Banking Workshop Voucher', 'Free financial literacy workshop attendance', 100, 30, 'FINLIT001', 'active');

-- Insert sample achievements
INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description) VALUES
((SELECT id FROM users WHERE phone = '+254712345678'), 'lesson_completion', 'First Lesson Master', 'Completed your first civic education lesson'),
((SELECT id FROM users WHERE phone = '+254712345678'), 'task_completion', 'Community Helper', 'Completed your first community task'),
((SELECT id FROM users WHERE phone = '+254734567890'), 'token_milestone', 'Token Collector', 'Earned over 1000 tokens'),
((SELECT id FROM users WHERE phone = '+254756789012'), 'streak', 'Weekly Warrior', 'Maintained a 7-day learning streak');

-- Insert sample emergency reports (for testing)
INSERT INTO emergency_reports (user_id, type, description, location, status, priority) VALUES
((SELECT id FROM users WHERE phone = '+254712345678'), 'medical', 'Elderly person needs medical assistance', ST_GeogFromText('POINT(36.8219 -1.2921)'), 'acknowledged', 'high'),
((SELECT id FROM users WHERE phone = '+254723456789'), 'infrastructure', 'Water pipe burst on main road', ST_GeogFromText('POINT(36.8172 -1.2850)'), 'reported', 'medium');

-- Insert sample admin logs
INSERT INTO admin_logs (admin_id, action, target_type, target_id, details) VALUES
((SELECT id FROM users WHERE phone = '+254767890123'), 'user_status_change', 'user', (SELECT id FROM users WHERE phone = '+254712345678')::text, '{"old_status": "active", "new_status": "active", "reason": "routine_check"}'),
((SELECT id FROM users WHERE phone = '+254767890123'), 'task_verification', 'user_task', '2', '{"action": "approved", "tokens_awarded": 100}'),
((SELECT id FROM users WHERE phone = '+254767890123'), 'lesson_publish', 'lesson', '1', '{"action": "published", "title": "Understanding County Government"}');
