import Head from 'next/head';
import Image from 'next/image';

const Login = () => {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md md:p-8">
          <div className="mb-6 text-left">
            <a href="#" className="font-medium text-[#4caf50] no-underline transition-colors hover:text-[#43a047]">
              Cancel
            </a>
          </div>
          <div className="mb-4 text-left">
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">Sign in or create account</h1>
            <p className="mt-2 text-sm leading-snug text-gray-600">
              Enter your email or mobile number. If you already have a T-Mobile account, we'll ask for your password after.
            </p>
          </div>
          <form>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Email or mobile number"
                className="w-full rounded border border-gray-300 p-3 text-base outline-none transition-colors focus:border-[#4caf50]"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-[#4caf50] p-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#43a047] focus:outline-none"
            >
              Continue
            </button>
          </form>
          <div className="mt-4 text-sm">
            <a href="#" className="font-medium text-[#4caf50] no-underline transition-colors hover:text-[#43a047]">
              Need help?
            </a>
          </div>
          <div className="relative my-5 flex items-center text-gray-400">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-2 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-3 text-base font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50 focus:outline-none">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_and_wordmark_of_Google_G_Suite_in_2020.png"
              alt="Google icon"
              className="h-5 w-5"
            />
            Sign In with Google
          </button>
          <div className="mt-6 flex items-center justify-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="keep-signed-in"
              className="h-4 w-4 accent-[#4caf50]"
              defaultChecked
            />
            <label htmlFor="keep-signed-in">Keep me signed in</label>
            <span className="text-gray-400">ⓘ</span>
          </div>
          <p className="mt-6 text-left text-xs leading-snug text-gray-400">
            By continuing, you've read and agree to our{' '}
            <a href="#" className="text-[#4caf50] no-underline transition-colors hover:text-[#43a047]">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#4caf50] no-underline transition-colors hover:text-[#43a047]">
              Privacy Policy
            </a>
            .
          </p>
          <p className="mt-10 text-center text-xs leading-snug text-gray-400 md:mt-16">
            © Copyright 1997-2025 iHerb, LLC. All rights reserved. iHerb® is a registered trademark of iHerb, LLC. and the iHerb.com Trusted Brands. Healthy Rewards. Logo are trademarks of iHerb, LLC. The claims made about the products sold through this website, have not been evaluated by the United States Food and Drug Administration and are not approved to diagnose, treat, cure or prevent any disease.{' '}
            <a href="#" className="text-[#4caf50] no-underline transition-colors hover:text-[#43a047]">
              Read more 
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;