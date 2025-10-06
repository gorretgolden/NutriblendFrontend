import React from 'react';

const articles = [
  {
    image: "/images/bottle2.avif",
    title: "The 7 Best Immune Supplements For Kids"
  },
  {
    image: "/images/bottle3.avif",
    title: "Top 5 Tips To Thrive in Menopause + Beyond"
  },
  {
    image: "/images/bottle4.avif",
    title: "Buffered Vitamin C With Bioflavonoids: A Powerhouse"
  },
  {
    image: "/images/bottle5.avif",
    title: "How Vitamin D Affects Your Brain: A Doctor's Guide"
  },
  {
    image: "/images/bottle6.avif",
    title: "How To Start Working Out Again: A 7-Step Guide"
  },
  {
    image: "/images/bottle7.avif",
    title: "Oil Of Oregano For Cold And Flu Season"
  },
];

const Blog = () => {
  return (
    <div className="bg-gray-100 p-1">
      <div className="container mx-auto">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {articles.map((article, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 sm:w-72 lg:w-40 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-100 transform hover:shadow-2xl"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-25 object-cover rounded-t-2xl"
              />
              <div className="bg-white p-4">
                <p className="text-sm font-medium text-gray-700 leading-tight">
                  {article.title}
                </p>
              </div>
            </div>
          ))}

          {/* The special "Wellness Hub" card */}
          <a href="#wellness-hub" className="flex-shrink-0 w-30 sm:w-72 lg:w-40 rounded-2xl shadow-lg bg-yellow-400 flex items-center justify-center text-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
            <div className="text-black font-bold text-2xl sm:text-2xl p-3">
              WELLNESS<br />HUB
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Blog;
