// import TextSkeleton from '@/components/skeletons/TextSkeleton';
// import { THIS_MONTH, THIS_WEEK, TODAY, TOTAL } from '@/constants/uiTexts';
// import { httpClient } from '@/utils/axios';
// import { APIResponse, APIStats } from '@/utils/types';
// import { useQuery } from '@tanstack/react-query';

// const uploadStatsLabels: Record<keyof APIStats, string> = {
//   uploaded_files_qty: TOTAL,
//   uploaded_files_qty_today: TODAY,
//   uploaded_files_qty_week: THIS_WEEK,
//   uploaded_files_qty_month: THIS_MONTH,
// };

// const StatsCard = () => {
//   const uploadStats = useQuery<APIResponse<APIStats>>({
//     queryKey: ['uploadStats'],
//     queryFn: () => httpClient.get('/stats/'),
//   });

//   return (
//     <>
//       <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4 lg:grid-cols-4">
//         {Object.keys(uploadStats.data?.data || {}).map((key) => (
//           <div
//             key={key}
//             className="dark:bg-slate-900 relative pt-5 px-4 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
//           >
//             <dt>
//               <p className="text-sm font-medium truncate">
//                 {uploadStatsLabels?.[key as keyof APIStats]}
//               </p>
//             </dt>
//             <dd className="pb-6 flex items-baseline sm:pb-7">
//               <p className="text-2xl font-semibold">
//                 {uploadStats.isLoading ? (
//                   <TextSkeleton className="w-20" />
//                 ) : (
//                   uploadStats.data?.data?.[key as keyof APIStats]
//                 )}
//               </p>
//             </dd>
//           </div>
//         ))}
//       </dl>
//     </>
//   );
// };

// export default StatsCard;
