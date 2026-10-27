// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const RequireRole = ({ allowedRoles, children, namespace }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(namespace === 'admin' ? 'admin_token' : 'user_token') || localStorage.getItem('token');
    const role = localStorage.getItem(namespace === 'admin' ? 'admin_role' : 'user_role') || localStorage.getItem('role');

    if (!token) {
      message.error('Bạn chưa đăng nhập!');
      navigate('/', { replace: true, state: { from: location } });
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      message.error('Bạn không có quyền truy cập trang này.');
      navigate(namespace === 'admin' ? '/admin/home' : '/app/home', { replace: true });
    }
  }, [navigate, location, allowedRoles]);

  return children;
};

export default RequireRole;


