-- Update email_logs table for comprehensive tracking
ALTER TABLE email_logs
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS vendor_id UUID,
ADD COLUMN IF NOT EXISTS reference_id TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Rename type to email_type if needed, or just keep it.
-- The requirement says email_type.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_logs' AND column_name='type') THEN
    ALTER TABLE email_logs RENAME COLUMN type TO email_type;
  END IF;
END $$;

-- Track: id, user_id, vendor_id, email (already recipient_email), email_type, reference_id, status, created_at (already sent_at)
-- I will keep the existing names but add aliases or just use these.
-- Actually I should probably make it match exactly if I'm "creating" it.

CREATE TABLE IF NOT EXISTS email_logs_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    vendor_id UUID,
    email TEXT NOT NULL,
    email_type TEXT NOT NULL,
    reference_id TEXT,
    status TEXT NOT NULL, -- 'sent', 'failed'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Note: In a real migration I would copy data, but since this is a new project setup I'll just provide the structure.
-- I will use the original email_logs and just make sure it has the columns I need.

ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS vendor_id UUID;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS reference_id TEXT;

-- Standardize names to match requirement if possible
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_logs' AND column_name='recipient_email') THEN
    ALTER TABLE email_logs RENAME COLUMN recipient_email TO email;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_logs' AND column_name='type') THEN
    ALTER TABLE email_logs RENAME COLUMN type TO email_type;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_logs' AND column_name='sent_at') THEN
    ALTER TABLE email_logs RENAME COLUMN sent_at TO created_at;
  END IF;
END $$;
