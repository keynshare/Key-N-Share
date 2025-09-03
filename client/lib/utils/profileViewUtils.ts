
// Maximum number of profiles to store in localStorage
const MAX_STORED_PROFILES = 100;

// expiry date of profile views of current user (30 days)
const PROFILE_VIEW_EXPIRY = 30 * 24 * 60 * 60 * 1000;

// For debugging - set to true to enable console logs
const DEBUG = false;

export const hasViewedProfile = (userId: string): boolean => {
  try {
    const viewedProfiles = JSON.parse(localStorage.getItem('viewedProfiles') || '{}');
    
    // If we have many profiles, occasionally clean up on read operations too
    // This distributes the cleanup work across different operations
    if (Object.keys(viewedProfiles).length > MAX_STORED_PROFILES / 2) {
      // 10% chance to perform cleanup during reads
      if (Math.random() < 0.1) {
        const cleanedProfiles = cleanupViewedProfiles(viewedProfiles);
        localStorage.setItem('viewedProfiles', JSON.stringify(cleanedProfiles));
        return cleanedProfiles[userId] !== undefined;
      }
    }
    
    // Works with both boolean and timestamp formats
    return viewedProfiles[userId] !== undefined;
  } catch (error) {
    console.error('Error checking viewed profiles:', error);
    return false;
  }
};

/**
 * Removes expired profile views and limits total number of stored profiles
 */
const cleanupViewedProfiles = (viewedProfiles: Record<string, number | boolean>): Record<string, number> => {
  const now = Date.now();
  const cleanedProfiles: Record<string, number> = {};
  
  const initialCount = Object.keys(viewedProfiles).length;
  let expiredCount = 0;
  
  // First pass: Remove expired entries
  Object.entries(viewedProfiles).forEach(([userId, timestamp]) => {
    // Keep only non-expired entries (convert old boolean format to timestamp if needed)
    if (typeof timestamp === 'boolean') {
      cleanedProfiles[userId] = now; // Convert old format
    } else if (now - timestamp < PROFILE_VIEW_EXPIRY) {
      cleanedProfiles[userId] = timestamp;
    } else {
      expiredCount++;
    }
  });
  
  let removedForLimit = 0;
  
  // Second pass: If still too many entries, remove oldest ones
  const profileIds = Object.keys(cleanedProfiles);
  if (profileIds.length > MAX_STORED_PROFILES) {
    // Sort by timestamp (oldest first)
    const sortedIds = profileIds.sort((a, b) => cleanedProfiles[a] - cleanedProfiles[b]);
    
    // Create new object with only the newest entries
    const newestProfiles: Record<string, number> = {};
    removedForLimit = profileIds.length - MAX_STORED_PROFILES;
    
    for (let i = profileIds.length - MAX_STORED_PROFILES; i < profileIds.length; i++) {
      const id = sortedIds[i];
      newestProfiles[id] = cleanedProfiles[id];
    }
    
    if (DEBUG) {
      console.log(`Profile views cleanup: ${initialCount} total, ${expiredCount} expired, ${removedForLimit} removed for limit, ${Object.keys(newestProfiles).length} remaining`);
    }
    
    return newestProfiles;
  }
  
  if (DEBUG && (expiredCount > 0 || removedForLimit > 0)) {
    console.log(`Profile views cleanup: ${initialCount} total, ${expiredCount} expired, ${removedForLimit} removed for limit, ${Object.keys(cleanedProfiles).length} remaining`);
  }
  
  return cleanedProfiles;
};

/**
 * Get statistics about the viewed profiles storage
 * @returns Object with statistics about the viewed profiles storage
 */
export const getViewedProfilesStats = () => {
  try {
    const viewedProfiles = JSON.parse(localStorage.getItem('viewedProfiles') || '{}');
    const now = Date.now();
    
    let oldestTimestamp = now;
    let newestTimestamp = 0;
    let booleanCount = 0;
    let expiredCount = 0;
    let validCount = 0;
    
    Object.entries(viewedProfiles).forEach(([_, timestamp]) => {
      if (typeof timestamp === 'boolean') {
        booleanCount++;
        validCount++; // Count boolean values as valid
      } else {
        if (timestamp < oldestTimestamp) oldestTimestamp = timestamp;
        if (timestamp > newestTimestamp) newestTimestamp = timestamp;
        
        if (now - timestamp < PROFILE_VIEW_EXPIRY) {
          validCount++;
        } else {
          expiredCount++;
        }
      }
    });
    
    return {
      total: Object.keys(viewedProfiles).length,
      valid: validCount,
      expired: expiredCount,
      booleanFormat: booleanCount,
      oldestDays: oldestTimestamp === now ? 0 : Math.floor((now - oldestTimestamp) / (24 * 60 * 60 * 1000)),
      newestDays: newestTimestamp === 0 ? 0 : Math.floor((now - newestTimestamp) / (24 * 60 * 60 * 1000)),
      storageSize: JSON.stringify(viewedProfiles).length
    };
  } catch (error) {
    console.error('Error getting viewed profiles stats:', error);
    return {
      total: 0,
      valid: 0,
      expired: 0,
      booleanFormat: 0,
      oldestDays: 0,
      newestDays: 0,
      storageSize: 0,
      error: String(error)
    };
  }
};

export const markProfileAsViewed = (userId: string): void => {
  try {
    const viewedProfiles = JSON.parse(localStorage.getItem('viewedProfiles') || '{}');
    
    // Add timestamp to track when profile was viewed
    viewedProfiles[userId] = Date.now();
    
    // Clean up old/excess entries
    const cleanedProfiles = cleanupViewedProfiles(viewedProfiles);
    
    localStorage.setItem('viewedProfiles', JSON.stringify(cleanedProfiles));
  } catch (error) {
    console.error('Error marking profile as viewed:', error);
  }
};

/**
 * Clear all viewed profiles from localStorage
 */
export const clearViewedProfiles = (): void => {
  try {
    localStorage.removeItem('viewedProfiles');
    if (DEBUG) console.log('Cleared all viewed profiles');
  } catch (error) {
    console.error('Error clearing viewed profiles:', error);
  }
};

/**
 * Force cleanup of viewed profiles storage
 * @returns The number of profiles removed
 */
export const forceCleanupViewedProfiles = (): number => {
  try {
    const viewedProfiles = JSON.parse(localStorage.getItem('viewedProfiles') || '{}');
    const initialCount = Object.keys(viewedProfiles).length;
    
    if (initialCount === 0) return 0;
    
    const cleanedProfiles = cleanupViewedProfiles(viewedProfiles);
    localStorage.setItem('viewedProfiles', JSON.stringify(cleanedProfiles));
    
    const finalCount = Object.keys(cleanedProfiles).length;
    return initialCount - finalCount;
  } catch (error) {
    console.error('Error forcing cleanup of viewed profiles:', error);
    return 0;
  }
};

// Utility function to get the count of viewed profiles (only non-expired ones)
export const getViewedProfilesCount = (): number => {
  try {
    const viewedProfiles = JSON.parse(localStorage.getItem('viewedProfiles') || '{}');
    const now = Date.now();
    
    // Only count non-expired profiles
    let count = 0;
    Object.entries(viewedProfiles).forEach(([_, timestamp]) => {
      if (typeof timestamp === 'boolean' || now - Number(timestamp) < PROFILE_VIEW_EXPIRY) {
        count++;
      }
    });
    
    return count;
  } catch (error) {
    console.error('Error getting viewed profiles count:', error);
    return 0;
  }
};