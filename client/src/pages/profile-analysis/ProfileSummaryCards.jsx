import React from 'react';

const Card = ({ title, value, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] p-5 flex flex-col justify-center items-center border border-gray-50 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">{title}</h3>
    <p className={`text-3xl font-extrabold ${colorClass}`}>{value}</p>
  </div>
);

const ProfileSummaryCards = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
      <Card title="Total Solved" value={data.totalSolved} colorClass="text-blue-600 dark:text-blue-400" />
      <Card title="Easy" value={data.easySolved} colorClass="text-green-500" />
      <Card title="Medium" value={data.mediumSolved} colorClass="text-yellow-500" />
      <Card title="Hard" value={data.hardSolved} colorClass="text-red-500" />
      <Card title="Acceptance Rate" value={`${data.acceptanceRate}%`} colorClass="text-purple-600 dark:text-purple-400" />
      <Card title="Ranking" value={data.ranking.toLocaleString()} colorClass="text-indigo-600 dark:text-indigo-400" />
      <Card title="Contest Rating" value={Math.round(data.contestRating)} colorClass="text-pink-600 dark:text-pink-400" />
    </div>
  );
};

export default ProfileSummaryCards;
