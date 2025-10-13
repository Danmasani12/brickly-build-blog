-- Add moderator role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';

-- Update RLS policies to allow moderators to insert but not delete

-- Gallery Posts: Moderators can insert and update
CREATE POLICY "Moderators can insert gallery posts"
ON public.gallery_posts
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can update gallery posts"
ON public.gallery_posts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Gallery Images: Moderators can insert
CREATE POLICY "Moderators can insert gallery images"
ON public.gallery_images
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Realty Posts: Moderators can insert and update
CREATE POLICY "Moderators can insert realty posts"
ON public.realty_posts
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can update realty posts"
ON public.realty_posts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Realty Images: Moderators can insert
CREATE POLICY "Moderators can insert realty images"
ON public.realty_images
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Realty Bedrooms: Moderators can insert
CREATE POLICY "Moderators can insert realty bedrooms"
ON public.realty_bedrooms
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));