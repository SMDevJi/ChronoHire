import React from 'react'

function Purchases() {
  const plans = [
    {
      title: 'Basic Plan',
      credits: 100,
      price: 5,
      description: 'Perfect for a quick interview practice.',
    },
    {
      title: 'Standard Plan',
      credits: 200,
      price: 10,
      description: 'Ideal for moderate interview preparation.',
    },
    {
      title: 'Premium Plan',
      credits: 500,
      price: 20,
      description: 'For extensive and advanced practice.',
    },
  ];
  return (
    <div className='purchases max-w-3xl mx-auto'>
      <h1 className='text-center text-2xl font-bold mt-6'>Purchases Coins</h1>
      <p className='text-center text-gray-600 text-lg'>Purchase coins to use on interviews</p>
      <div className="cards grid grid-cols-3 gap-3 mt-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="card h-auto p-6 border border-gray-300 rounded-lg shadow-lg flex flex-col items-center space-y-4 max-w-xs transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-gray-400"
          >
            <h3 className="text-xl font-medium text-gray-800">{plan.title}</h3>
            <p className="text-blue-500 text-lg">Credits: {plan.credits}</p>
            <p className="text-2xl font-semibold text-orange-500">${plan.price}</p>
            <p className="text-gray-600 text-center">{plan.description}</p>
            <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer">
              Choose Plan
            </button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Purchases