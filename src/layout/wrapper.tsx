'use client';
import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { ToastContainer } from 'react-toastify';
import RouteGuard from '@/components/RouteGuard';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [sideMenu, setSideMenu] = useState<boolean>(false);
  return (
    <RouteGuard>
      <div className="tp-main-wrapper bg-slate-100 h-screen">
        <Sidebar sideMenu={sideMenu} setSideMenu={setSideMenu} />
        <div className="tp-main-content lg:ml-[250px] xl:ml-[300px] w-[calc(100% - 300px)]">
          {/* header start */}
          <Header setSideMenu={setSideMenu} />
          {/* header end */}

          {children}
        </div>
        <ToastContainer />
      </div>
    </RouteGuard>
  );
};

export default Wrapper;
