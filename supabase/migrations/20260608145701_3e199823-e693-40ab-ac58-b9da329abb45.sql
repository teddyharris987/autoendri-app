
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;

DROP POLICY "Anyone can submit messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit messages" ON public.contact_messages FOR INSERT
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(phone) BETWEEN 1 AND 30
    AND length(message) BETWEEN 1 AND 2000
  );
