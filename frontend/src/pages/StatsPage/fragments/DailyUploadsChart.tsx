// import { httpClient } from '@/utils/axios';
// import { useQueries } from '@tanstack/react-query';
// import { useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Legend,
// } from 'recharts';
// import { MdBarChart } from 'react-icons/md';
// import { FaChartLine } from 'react-icons/fa6';
// import SegmentedControl from '@/components/inputs/SegmentedControl';
// import SkeletonChart from '@/components/skeletons/SkeletonChart';
// import { UPLOADS_DAILY_CHART } from '@/constants/uiTexts';

// const daysQtyInThisMonth = new Date(
//   new Date().getFullYear(),
//   new Date().getMonth() + 1,
//   0,
// ).getDate();

// const DailyUploadsChart = () => {
//   const [chartType, setChartType] = useState('line');
//   const dailyUploads = useQueries({
//     queries: Array.from({ length: daysQtyInThisMonth }, (_, i) => {
//       const date = new Date(
//         new Date().getFullYear(),
//         new Date().getMonth(),
//         i + 1,
//       );
//       const dateStr = date.toISOString().split('T')[0];

//       return {
//         queryKey: ['dailyUploads', dateStr],
//         queryFn: async () => {
//           return httpClient.get(
//             `/stats/by_date_interval?start_date=${dateStr}`,
//           );
//         },
//       };
//     }),
//   });

//   if (dailyUploads.some((query) => query.isLoading)) {
//     return <SkeletonChart />;
//   }

//   if (dailyUploads.some((query) => query.isError)) {
//     return <div>Error fetching data</div>;
//   }

//   const chartData = dailyUploads.map((dailyUpload, index) => {
//     const count = dailyUpload.data?.data;
//     return {
//       date: index + 1,
//       uploads: count,
//     };
//   });

//   return (
//     <div className="mt-10 flex flex-col bg-white dark:bg-slate-900 p-4 rounded-md shadow-md">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl leading-6 font-medium">{UPLOADS_DAILY_CHART}</h2>
//         <SegmentedControl
//           className="self-end my-2"
//           options={[
//             {
//               icon: <MdBarChart />,
//               onClick: () => setChartType('bar'),
//               active: chartType === 'bar',
//             },
//             {
//               icon: <FaChartLine />,
//               onClick: () => setChartType('line'),
//               active: chartType === 'line',
//             },
//           ]}
//         />
//       </div>

//       <ResponsiveContainer width="100%" height={400}>
//         {chartType === 'bar' ? (
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis width={20} />
//             <Tooltip />
//             <Bar dataKey="uploads" fill="#8884d8" />
//           </BarChart>
//         ) : (
//           <LineChart width={400} height={400} data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis width={20} />
//             <Tooltip />
//             <Legend />

//             <Line
//               type="monotone"
//               dataKey="uploads"
//               stroke="#8884d8"
//               strokeDasharray="5 5"
//             />
//           </LineChart>
//         )}
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default DailyUploadsChart;
