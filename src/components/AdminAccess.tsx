import React, { ReactNode } from 'react';

interface AdminAccessProps {
  children: ReactNode;
}

const AdminAccess: React.FC<AdminAccessProps> = ({ children }) => {
  // Simple wrapper component for admin access
  // The actual admin checks are handled in individual components
  return <>{children}</>;
};

export default AdminAccess;
