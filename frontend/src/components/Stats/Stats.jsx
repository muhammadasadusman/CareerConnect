const Stats = () => {
  const stats = [
    ["10,000+", "Jobs Available"],
    ["5,000+", "Companies"],
    ["15,000+", "Active Candidates"],
    ["500+", "Jobs Added Daily"]
  ];

  return (
    <section className="bg-[#070B2B] py-10">
      
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 p-5 sm:p-6">

        {stats.map((item) => (
          <div key={item[1]} className="text-center">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {item[0]}
            </h2>

            <p className="text-sm text-gray-500">
              {item[1]}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Stats;