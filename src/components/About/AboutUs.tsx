import React from 'react';

const MellonHardware = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="bg-[#4caf50] text-white py-9 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About NutriBlend Haven
          </h1>
        </div>
      </section>

       {/* Our Story Section */}
       <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
          Our Story
       </h2>
        <p className="text-lg sm:text-xl leading-relaxed text-gray-600">
          Founded in 2010, Nutriblend Haven has grown from a small local supplier
          to a trusted name in the hardware industry. We specialize in providing
           high-quality Supplements, furniture, Supplies, and other medical materials to
        support both professional doctors and Health specialist enthusiasts.
        </p>
      </div>
      {/* Savings Section */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#4caf50] mb-4">
              Why NutriBlend Haven
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-[#4caf50] mb-3">
                Ability to have genuine products
              </h3>
              <div className="w-12 h-1 bg-[#4caf50] my-4"></div>
              <p className="text-gray-600">
                All temperature-controlled facilities to ensure quality
                Genuine reviews only from verified customers
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-[#4caf50] mb-3">
                Favourable interest rates
              </h3>
              <div className="w-12 h-1 bg-[#4caf50] my-4"></div>
              <p className="text-gray-600">
                No third-party sales. Direct from suppliers and authorized distributors
                Independent lab testing on NutriBlend's House Brands
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-[#4caf50] mb-3">
                Convenient and easy
              </h3>
              <div className="w-12 h-1 bg-[#4caf50] my-4"></div>
              <p className="text-gray-600">
                Expiration dates on product descriptions
                24/7 customer service. Easy returns and refunds
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-[#4caf50] mb-3">
                Flexibility for usage
              </h3>
              <div className="w-12 h-1 bg-[#4caf50] my-4"></div>
              <p className="text-gray-600">
                We don't interfere with how you run your business, we are
                concerned with timely repayments. Therefore, Nutriblend
                Haven is the best option for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MellonHardware;

// // components/AboutUs/AboutUs.tsx
// import React from 'react';

// const AboutUs: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-[#ffffff] font-sans">
//       {/* Hero Section */}
//       <div
//         className="relative bg-[#4caf50] py-20 px-4 sm:px-6 lg:px-8 text-white flex flex-col items-center justify-center text-center"
//         style={{
//           backgroundImage:
//             'url("https://via.placeholder.com/1500x400/4caf50/ffffff?text=Mellon+Hardware+Tools")',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="absolute inset-0 bg-[#4caf50] opacity-70"></div>
//         <div className="relative z-10">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
//             About Mellon Hardware
//           </h1>
//           <p className="text-xl sm:text-2xl font-medium drop-shadow-md">
//             Building trust since 2010
//           </p>
//         </div>
//       </div>

//       {/* Our Story Section */}
//       <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
//         <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
//           Our Story
//         </h2>
//         <p className="text-lg sm:text-xl leading-relaxed text-gray-600">
//           Founded in 2010, Mellon Hardware has grown from a small local supplier
//           to a trusted name in the hardware industry. We specialize in providing
//           high-quality cement, nails, tools, and other construction materials to
//           support both professional contractors and DIY enthusiasts.
//         </p>
//       </div>

//       {/* Savings & Benefits Section */}
//       <div className="min-h-screen bg-[#ffffff] py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4caf50] mb-12">
//             Why you should save with us
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300">
//               <h3 className="text-xl font-bold mb-4 text-[#4caf50]">
//                 Ability to grow your business
//               </h3>
//               <p className="text-base text-gray-600">
//                 With Plus Save, we offer you a convenient way to get a business
//                 loan, without need to wait until your business has generated
//                 enough profit to fund expansion yourself.
//               </p>
//             </div>

//             <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300">
//               <h3 className="text-xl font-bold mb-4 text-[#4caf50]">
//                 Favourable interest rates
//               </h3>
//               <p className="text-base text-gray-600">
//                 Our interest rates on loan applications are negotiable
//                 especially if you are looking for a more long-term funding
//                 option. The interest you pay on the loan repayments is tax-free.
//               </p>
//             </div>

//             <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300">
//               <h3 className="text-xl font-bold mb-4 text-[#4caf50]">
//                 Convenient and easy
//               </h3>
//               <p className="text-base text-gray-600">
//                 Getting a business loan is as easy as getting in touch with a
//                 lender and talking about the possibility of securing financing.
//                 We ease the process of loan disbursements.
//               </p>
//             </div>

//             <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300">
//               <h3 className="text-xl font-bold mb-4 text-[#4caf50]">
//                 Flexibility for usage
//               </h3>
//               <p className="text-base text-gray-600">
//                 We don’t interfere with how you run your business, we are
//                 concerned with timely repayments. Therefore, Plus Save Financial
//                 Solutions is the best option for you.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;

