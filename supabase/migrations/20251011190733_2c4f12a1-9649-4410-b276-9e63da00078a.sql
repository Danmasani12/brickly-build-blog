-- Create gallery_posts table
CREATE TABLE public.gallery_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'renovation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_post_id UUID REFERENCES public.gallery_posts(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create realty_posts table
CREATE TABLE public.realty_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'lease')),
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial')),
  living_room_sqm DECIMAL,
  kitchen_sqm DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create realty_bedrooms table
CREATE TABLE public.realty_bedrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realty_post_id UUID REFERENCES public.realty_posts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sqm DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create realty_images table
CREATE TABLE public.realty_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realty_post_id UUID REFERENCES public.realty_posts(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realty_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realty_bedrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realty_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_posts (public read, admin write)
CREATE POLICY "Anyone can view gallery posts"
  ON public.gallery_posts FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert gallery posts"
  ON public.gallery_posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update gallery posts"
  ON public.gallery_posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete gallery posts"
  ON public.gallery_posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for gallery_images
CREATE POLICY "Anyone can view gallery images"
  ON public.gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert gallery images"
  ON public.gallery_images FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete gallery images"
  ON public.gallery_images FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for realty_posts
CREATE POLICY "Anyone can view realty posts"
  ON public.realty_posts FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert realty posts"
  ON public.realty_posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update realty posts"
  ON public.realty_posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete realty posts"
  ON public.realty_posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for realty_bedrooms
CREATE POLICY "Anyone can view realty bedrooms"
  ON public.realty_bedrooms FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert realty bedrooms"
  ON public.realty_bedrooms FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete realty bedrooms"
  ON public.realty_bedrooms FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for realty_images
CREATE POLICY "Anyone can view realty images"
  ON public.realty_images FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert realty images"
  ON public.realty_images FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete realty images"
  ON public.realty_images FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create update trigger function for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_gallery_posts_updated_at
  BEFORE UPDATE ON public.gallery_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_realty_posts_updated_at
  BEFORE UPDATE ON public.realty_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();