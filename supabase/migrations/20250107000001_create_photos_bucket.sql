
-- Create photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Create policy to allow public uploads to photos bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos');

-- Create policy to allow public access to photos
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');
