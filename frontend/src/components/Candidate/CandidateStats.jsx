const CandidateStats = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 transition duration-200 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </h2>
            </div>

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${stat.iconBg} ${stat.iconColor}`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateStats;
