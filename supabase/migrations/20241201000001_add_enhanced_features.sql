-- Add user favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Add listing analytics table
CREATE TABLE IF NOT EXISTS listing_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  last_viewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id)
);

-- Add contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user search history table
CREATE TABLE IF NOT EXISTS user_search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;

-- User favorites policies
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Listing analytics policies (admin only for now)
CREATE POLICY "Admins can view all analytics" ON listing_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Contact inquiries policies
CREATE POLICY "Users can view their own inquiries" ON contact_inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all inquiries" ON contact_inquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Search history policies
CREATE POLICY "Users can manage their search history" ON user_search_history
  FOR ALL USING (auth.uid() = user_id);

-- Functions for analytics
CREATE OR REPLACE FUNCTION increment_view_count(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO listing_analytics (listing_id, view_count, last_viewed)
  VALUES (listing_uuid, 1, NOW())
  ON CONFLICT (listing_id) 
  DO UPDATE SET 
    view_count = listing_analytics.view_count + 1,
    last_viewed = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_inquiry_count(listing_uuid UUID)
RETURNS VOID AS $
BEGIN
  INSERT INTO listing_analytics (listing_id, inquiry_count)
  VALUES (listing_uuid, 1)
  ON CONFLICT (listing_id) 
  DO UPDATE SET 
    inquiry_count = listing_analytics.inquiry_count + 1;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total users count
CREATE OR REPLACE FUNCTION get_total_users_count()
RETURNS INTEGER AS $
BEGIN
  RETURN (SELECT COUNT(*) FROM auth.users);
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
