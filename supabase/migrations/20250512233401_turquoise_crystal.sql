/*
  # Create function to increment clicks

  Creates a stored procedure to safely increment the clicks counter
  for a redirect using optimistic locking to prevent race conditions.
*/

CREATE OR REPLACE FUNCTION increment_clicks(redirect_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE redirects
  SET clicks = clicks + 1
  WHERE id = redirect_id;
END;
$$;