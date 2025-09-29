import { supabase } from '@/integrations/supabase/client';

// Type-safe wrappers for Supabase functions to handle missing types
export const incrementViewCount = async (listingId: string) => {
  try {
    const { error } = await (supabase as any).rpc('increment_view_count', { 
      listing_uuid: listingId 
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

export const incrementInquiryCount = async (listingId: string) => {
  try {
    const { error } = await (supabase as any).rpc('increment_inquiry_count', { 
      listing_uuid: listingId 
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing inquiry count:', error);
    throw error;
  }
};

export const getTotalUsersCount = async () => {
  try {
    const { data, error } = await (supabase as any).rpc('get_total_users_count');
    if (error) throw error;
    return data || 0;
  } catch (error) {
    console.error('Error getting total users count:', error);
    return 0;
  }
};

// Type-safe wrappers for analytics queries
export const getListingAnalytics = async () => {
  try {
    const { data, error } = await (supabase as any)
      .from('listing_analytics')
      .select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching listing analytics:', error);
    return [];
  }
};

// Type-safe wrappers for favorites queries
export const getUserFavorites = async (userId: string) => {
  try {
    const { data, error } = await (supabase as any)
      .from('user_favorites')
      .select('listing_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return [];
  }
};

export const addUserFavorite = async (userId: string, listingId: string) => {
  try {
    const { error } = await (supabase as any)
      .from('user_favorites')
      .insert([{ user_id: userId, listing_id: listingId }]);
    if (error) throw error;
  } catch (error) {
    console.error('Error adding user favorite:', error);
    throw error;
  }
};

export const removeUserFavorite = async (userId: string, listingId: string) => {
  try {
    const { error } = await (supabase as any)
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);
    if (error) throw error;
  } catch (error) {
    console.error('Error removing user favorite:', error);
    throw error;
  }
};