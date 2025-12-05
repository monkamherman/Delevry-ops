import React from 'react';
import { Link } from 'react-router-dom';
// import pageNoteFound from '/images/not-found-image.png'
// import SEO from '@/components/custom/utils/SEO';
import SEO from '@/components/ui/SEO';
const PageError: React.FC = () => {
  return (
    <section className="relative h-screen w-screen overflow-x-hidden py-10">
      <SEO
        title="Page Not Found | We are sorry this page is not available"
        description="we are sorry but this page is not available at the moment."
      />

      <div className="container relative z-40 flex h-full w-full flex-col items-center justify-between gap-6 md:flex-row md:gap-10">
        <div className="flex h-full w-full max-w-full flex-1 flex-col items-center justify-center gap-6 py-0 md:gap-8 lg:max-w-[50%] lg:gap-10">
          <div className="w-fit">
            <h1 className="mx-auto w-fit bg-background p-0 text-center text-5xl font-bold md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-tr from-blue-500 via-[#c850c0] to-blue-500 bg-clip-text font-bold text-transparent">
                404
              </span>
            </h1>
            <h2 className="w-fit bg-background p-0 text-center text-2xl font-semibold md:text-3xl lg:text-5xl">
              Page Not Found
            </h2>
          </div>

          <p className="w-fit bg-background p-0 text-center text-base text-foreground/80 md:text-lg">
            Sorry, the page you are looking for could not be found.
          </p>

          {/* Line of separation */}
          <div className="w-full rounded-full border bg-foreground/80 shadow-md"></div>

          {/* Redirection links */}
          <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-4 gap-y-1 text-sm capitalize md:gap-6 md:text-base">
            <Link
              to={'/'}
              className="link-underline bg-gradient-to-tr from-blue-500 via-[#c850c0] to-blue-500 bg-clip-text font-medium text-transparent md:py-2"
            >
              <span>Back to Home</span>
            </Link>

            <Link
              to={'/products'}
              className="link-underline bg-gradient-to-tr from-[#c850c0] to-blue-500 bg-clip-text font-medium text-transparent md:py-2"
            >
              <span>view products</span>
            </Link>

            <Link
              to={'/support'}
              className="link-underline bg-gradient-to-tr from-blue-500 to-[#c850c0] bg-clip-text font-medium text-transparent md:py-2"
            >
              <span>Contact Support</span>
            </Link>
          </div>
        </div>

        <div className="flex w-full max-w-full flex-1 items-center justify-center text-center md:h-full lg:max-w-[50%]">
          {/* <img
						src={pageNoteFound}
						alt="404 page not found"
						className="w-full h-full pointer-events-none select-none"
					/> */}
        </div>
      </div>
    </section>
  );
};

export default PageError;
