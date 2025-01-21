import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FILES_TAB, UPLOAD_FILES_TAB } from '@/constants/uiTexts';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoCloudUpload } from 'react-icons/io5';
import { MdOutlineQueryStats } from 'react-icons/md';
import { PiFilesFill } from 'react-icons/pi';
import { useFilesStore } from '@/utils/zustandStorage';
import { FileStoreState } from '@/utils/zustandStorage/types';
import { useEffect, useMemo, useState } from 'react';
import DarkModeToggle from '@/fragments/DarkModeToggle';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const Base = () => {
  const { isAuthenticated } = useAuth();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const nav = useNavigate();
  const location = useLocation();
  const filesCount = useFilesStore(
    (state: FileStoreState) => state.files.length,
  );
  const TABS = useMemo( 
    () => [
      {
        href: '/upload',
        label: UPLOAD_FILES_TAB,
        icon: IoCloudUpload,
      },
      {
        href: '/files',
        label: FILES_TAB,
        icon: PiFilesFill,
        badge: filesCount,
      },
      {
        href: '/stats',
        label: 'Stats',
        icon: MdOutlineQueryStats,
      },
    ],
    [filesCount],
  );

  useEffect(() => {
    setSelectedIdx(
      TABS.findIndex((tab) => location.pathname.includes(tab.href)),
    );
  }, [setSelectedIdx, location.pathname, TABS]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  return (
    <div className="w-full h-full bg-white dark:bg-slate-950 text-black dark:text-white overflow-x-hidden">
      <div className="w-5/6 h-full mx-auto py-2">
        <div className="sm:hidden w-full h-full">
          <TabGroup
            selectedIndex={selectedIdx}
            className="flex flex-col justify-between w-full h-full"
          >
            <TabPanels className="flex flex-col justify-center ">
              {TABS.map((tab) => (
                <TabPanel key={tab.href} className="py-10 ">
                  <Outlet />
                </TabPanel>
              ))}
            </TabPanels>

            <TabList>
              {/** the number of grid cols should be the same of TABS.length */}
              <div className={`w-full grid grid-cols-3`}>
                {TABS.map((tab) => (
                  <Tab
                    key={tab.href}
                    onClick={() => nav(tab.href)}
                    className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-300 group inline-flex justify-center items-center py-4 px-1 border-b-2 font-medium text-sm outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600 dark:data-[selected]:border-indigo-100 dark:data-[selected]:text-indigo-200 flex-col"
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </Tab>
                ))}
              </div>
            </TabList>
          </TabGroup>
        </div>

        <div className="w-full h-full hidden sm:block">
          <TabGroup selectedIndex={selectedIdx} className="w-full h-full">
            <TabList className="flex space-x-8">
              {TABS.map((tab) => (
                <Tab
                  key={tab.href}
                  onClick={() => nav(tab.href)}
                  className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-300 group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600 dark:data-[selected]:border-indigo-100 dark:data-[selected]:text-indigo-200"
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">
                      {tab.badge}
                    </span>
                  )}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {TABS.map((tab) => (
                <TabPanel key={tab.href}>
                  <div className="mt-4">
                    <Outlet />
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>

        {/** 16.67 / 2 ~= 8.35 - where 16.67 is the remaining screen space outside the component width w-5/6 */}
        <DarkModeToggle className="absolute top-4 right-[8.35%]" />
      </div>
    </div>
  );
};

export default Base;
