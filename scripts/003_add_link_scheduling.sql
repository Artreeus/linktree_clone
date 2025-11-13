-- Add scheduling columns to links table
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on scheduled queries
CREATE INDEX IF NOT EXISTS idx_links_scheduling ON public.links(scheduled_start, scheduled_end);

-- Create a function to check if a link is currently visible
CREATE OR REPLACE FUNCTION is_link_visible(
  link_active BOOLEAN,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
BEGIN
  -- If link is not active, return false
  IF NOT link_active THEN
    RETURN FALSE;
  END IF;
  
  -- If no scheduling, return true
  IF start_time IS NULL AND end_time IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if current time is within scheduled period
  IF start_time IS NOT NULL AND NOW() < start_time THEN
    RETURN FALSE;
  END IF;
  
  IF end_time IS NOT NULL AND NOW() > end_time THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

