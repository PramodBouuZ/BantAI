-- Add status column to vendor_registrations to track onboarding state
-- This provides a persistence layer for vendor status since public.users schema is restricted

ALTER TABLE IF EXISTS public.vendor_registrations
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected', 'Suspended'));

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_status ON public.vendor_registrations (status);

-- Update RLS policies to allow admins to update status
CREATE POLICY "Admins can update vendor status" ON public.vendor_registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        ) OR
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'info.bouuz@gmail.com'
    );
