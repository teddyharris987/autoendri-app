
CREATE POLICY "Public can read car images" ON storage.objects FOR SELECT USING (bucket_id = 'car-images');
CREATE POLICY "Admins can upload car images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'car-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update car images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'car-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete car images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'car-images' AND public.has_role(auth.uid(), 'admin'));
