
-- Create policies for the yuuka table to allow public access
-- Since this is a shortlink service, we want to allow anyone to create and read short links

-- Allow anyone to insert new short links
CREATE POLICY "Allow public insert" ON public.yuuka
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read short links (needed for redirects)
CREATE POLICY "Allow public read" ON public.yuuka
  FOR SELECT USING (true);

-- Allow anyone to update short links (optional, for future features)
CREATE POLICY "Allow public update" ON public.yuuka
  FOR UPDATE USING (true);

-- Allow anyone to delete short links (for dashboard functionality)
CREATE POLICY "Allow public delete" ON public.yuuka
  FOR DELETE USING (true);
