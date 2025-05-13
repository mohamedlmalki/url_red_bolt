import { Redirect } from '../types/redirect';
import { generateShortCode } from './helpers';
import { supabase } from './supabase';

export async function getRedirects(): Promise<Redirect[]> {
  const { data, error } = await supabase
    .from('redirects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting redirects:', error);
    return [];
  }

  return data.map(redirect => ({
    id: redirect.id,
    targetUrl: redirect.target_url,
    shortCode: redirect.short_code,
    createdAt: new Date(redirect.created_at).getTime(),
    clicks: redirect.clicks
  }));
}

export async function createRedirect(targetUrl: string, customPath?: string): Promise<Redirect> {
  const shortCode = customPath || generateShortCode();

  // Check if short code already exists
  const { data: existing } = await supabase
    .from('redirects')
    .select('short_code')
    .eq('short_code', shortCode)
    .limit(1)
    .single();

  if (existing) {
    throw new Error('This custom path is already in use. Please choose another one.');
  }

  const { data, error } = await supabase
    .from('redirects')
    .insert([
      {
        target_url: targetUrl,
        short_code: shortCode,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error('Error creating redirect');
  }

  return {
    id: data.id,
    targetUrl: data.target_url,
    shortCode: data.short_code,
    createdAt: new Date(data.created_at).getTime(),
    clicks: data.clicks
  };
}

export async function getRedirectByShortCode(shortCode: string): Promise<Redirect | undefined> {
  const { data, error } = await supabase
    .from('redirects')
    .select('*')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) {
    return undefined;
  }

  return {
    id: data.id,
    targetUrl: data.target_url,
    shortCode: data.short_code,
    createdAt: new Date(data.created_at).getTime(),
    clicks: data.clicks
  };
}

export async function deleteRedirect(id: string): Promise<void> {
  const { error } = await supabase
    .from('redirects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Error deleting redirect');
  }
}

export async function incrementRedirectClicks(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_clicks', { redirect_id: id });

  if (error) {
    console.error('Error incrementing clicks:', error);
  }
}