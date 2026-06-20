import { supabase } from './supabase';

export const uploadLogo = async (file: File): Promise<string | null> => {
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `vendor-logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('assets')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading logo:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('assets')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadBase64Image = async (base64: string, folder: string = 'images'): Promise<string | null> => {
    if (!supabase) return null;

    // Convert base64 to Blob
    const res = await fetch(base64);
    const blob = await res.blob();

    const fileExt = blob.type.split('/')[1] || 'png';
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, blob);

    if (uploadError) {
      console.error('Error uploading base64 image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
}
