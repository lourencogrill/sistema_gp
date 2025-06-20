'use client';

import { useState } from 'react';

// Mock hook for demonstration purposes
export const useNotifications = () => {
  const [rhPendingCount, setRhPendingCount] = useState(3);

  return {
    rhPendingCount,
  };
};
