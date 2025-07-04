-- Seed data for CivicHero platform

-- Insert sample lessons
INSERT INTO lessons (title_en, title_sw, description_en, description_sw, content_en, content_sw, category, difficulty, estimated_time, xp_reward, token_reward, sort_order) VALUES
('Introduction to Kenyan Constitution', 'Utangulizi wa Katiba ya Kenya', 'Learn the basics of Kenya''s constitution and its importance', 'Jifunze misingi ya katiba ya Kenya na umuhimu wake', 'The Constitution of Kenya is the supreme law of the Republic of Kenya...', 'Katiba ya Kenya ni sheria kuu ya Jamhuri ya Kenya...', 'constitution', 1, 15, 50, 25, 1),

('Your Rights as a Citizen', 'Haki Zako kama Raia', 'Understanding your fundamental rights and freedoms', 'Kuelewa haki na uhuru wako wa kimsingi', 'As a Kenyan citizen, you have fundamental rights protected by the constitution...', 'Kama raia wa Kenya, una haki za kimsingi zinazolindwa na katiba...', 'rights', 1, 20, 50, 25, 2),

('How Government Works', 'Jinsi Serikali Inavyofanya Kazi', 'Learn about the three arms of government', 'Jifunze kuhusu mikono mitatu ya serikali', 'The Kenyan government has three main arms: Executive, Legislature, and Judiciary...', 'Serikali ya Kenya ina mikono mitatu mikuu: Utendaji, Ubunge, na Mahakama...', 'government', 2, 25, 75, 35, 3),

('Voting and Elections', 'Kupiga Kura na Uchaguzi', 'Understanding the electoral process in Kenya', 'Kuelewa mchakato wa uchaguzi nchini Kenya', 'Elections are the cornerstone of democracy in Kenya...', 'Uchaguzi ni msingi wa demokrasia nchini Kenya...', 'elections', 2, 30, 75, 35, 4),

('County Government Functions', 'Kazi za Serikali za Kaunti', 'Learn about devolved government and county functions', 'Jifunze kuhusu serikali za ugatuzi na kazi za kaunti', 'County governments handle devolved functions like healthcare, agriculture...', 'Serikali za kaunti zinashughulikia kazi za ugatuzi kama afya, kilimo...', 'devolution', 2, 20, 60, 30, 5);

-- Insert sample tasks
INSERT INTO tasks (title_en, title_sw, description_en, description_sw, type, category, location, county, max_participants, xp_reward, token_reward, start_date, end_date) VALUES
('Community Health Survey', 'Utafiti wa Afya ya Jamii', 'Help collect data on community health needs', 'Saidia kukusanya data kuhusu mahitaji ya afya ya jamii', 'survey', 'health', 'Nairobi CBD', 'Nairobi', 50, 100, 50, NOW() + INTERVAL '1 day', NOW() + INTERVAL '7 days'),

('Youth Leadership Workshop', 'Warsha ya Uongozi wa Vijana', 'Participate in leadership training for young people', 'Shiriki katika mafunzo ya uongozi kwa vijana', 'workshop', 'leadership', 'Mombasa', 'Mombasa', 30, 150, 75, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days'),

('Environmental Clean-up Drive', 'Msafara wa Usafi wa Mazingira', 'Join community members in cleaning local environment', 'Jiunge na wanajamii katika kusafisha mazingira ya mtaa', 'volunteer', 'environment', 'Kisumu Lakefront', 'Kisumu', 100, 120, 60, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days'),

('Civic Education Outreach', 'Ufikishaji wa Elimu ya Uraia', 'Help educate community members about their civic rights', 'Saidia kuelimisha wanajamii kuhusu haki zao za kiraia', 'outreach', 'education', 'Eldoret Town', 'Uasin Gishu', 20, 200, 100, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days');

-- Insert achievements
INSERT INTO achievements (code, name_en, name_sw, description_en, description_sw, category, xp_reward, token_reward, badge_icon) VALUES
('first_login', 'First Steps', 'Hatua za Kwanza', 'Welcome to CivicHero! You''ve taken your first step.', 'Karibu CivicHero! Umechukua hatua yako ya kwanza.', 'onboarding', 25, 10, '🎯'),

('onboarding_complete', 'Setup Master', 'Bingwa wa Usanidi', 'You''ve completed your profile setup successfully.', 'Umekamilisha usanidi wa wasifu wako kwa ufanisi.', 'onboarding', 100, 50, '✅'),

('first_lesson', 'Scholar', 'Mwanafunzi', 'You''ve completed your first civic lesson.', 'Umekamilisha somo lako la kwanza la uraia.', 'learning', 50, 25, '📚'),

('lesson_streak_5', 'Dedicated Learner', 'Mwanafunzi Mwaminifu', 'You''ve completed 5 lessons in a row.', 'Umekamilisha masomo 5 mfululizo.', 'learning', 150, 75, '🔥'),

('first_task', 'Community Helper', 'Msaidizi wa Jamii', 'You''ve completed your first community task.', 'Umekamilisha kazi yako ya kwanza ya kijamii.', 'participation', 100, 50, '🤝'),

('task_master', 'Task Master', 'Bingwa wa Kazi', 'You''ve completed 10 community tasks.', 'Umekamilisha kazi 10 za kijamii.', 'participation', 500, 250, '🏆'),

('level_5', 'Rising Star', 'Nyota Inayoongezeka', 'You''ve reached Level 5! Keep going!', 'Umefika Kiwango cha 5! Endelea!', 'progression', 200, 100, '⭐'),

('county_champion', 'County Champion', 'Bingwa wa Kaunti', 'You''re among the top contributors in your county.', 'Uko miongoni mwa wachangiaji wakuu katika kaunti yako.', 'leadership', 300, 150, '👑');

-- Insert sample notifications templates
INSERT INTO notifications (user_id, title_en, title_sw, message_en, message_sw, type, priority, send_push, send_sms) 
SELECT 
    id,
    'Welcome to CivicHero!',
    'Karibu CivicHero!',
    'Thank you for joining CivicHero. Start your civic journey by completing your first lesson.',
    'Asante kwa kujiunga na CivicHero. Anza safari yako ya uraia kwa kukamilisha somo lako la kwanza.',
    'welcome',
    'normal',
    true,
    false
FROM users 
WHERE created_at > NOW() - INTERVAL '1 day'
LIMIT 5;
