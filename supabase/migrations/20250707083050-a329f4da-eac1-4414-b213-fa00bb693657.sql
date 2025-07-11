
-- Create the tracking_data table that the ShortcodeDashboard component expects
CREATE TABLE public.tracking_data (
  id SERIAL PRIMARY KEY,
  short_code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'location', 'ip_only', 'fallback')),
  yuuka TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- Create an index for better performance when querying by short_code
CREATE INDEX idx_tracking_data_short_code ON public.tracking_data(short_code);

-- Create an index for better performance when querying by created_at
CREATE INDEX idx_tracking_data_created_at ON public.tracking_data(created_at);

-- Enable Row Level Security (optional - you can disable this if you want public access)
ALTER TABLE public.tracking_data ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (you can modify this based on your needs)
CREATE POLICY "Allow public read access" ON public.tracking_data
  FOR SELECT USING (true);

-- Create a policy to allow public insert access (you can modify this based on your needs)
CREATE POLICY "Allow public insert access" ON public.tracking_data
  FOR INSERT WITH CHECK (true);
