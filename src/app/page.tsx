import AICreationForm from "@/components/AICreationForm"; // Updated import
import Image from "next/image";

// New Header Component (inlined for simplicity)
const AppHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800 shadow-md">
    <div className="flex w-full max-w-3xl mx-auto items-center justify-between py-4 px-4 sm:px-16">
      <div className="flex items-center space-x-4">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <h1 className="text-xl font-bold tracking-tight text-black dark:text-zinc-50 hidden sm:block">
            AI App Prototype
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <a 
          href="[https://github.com/google/genai-js](https://github.com/google/genai-js)"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Gen AI SDK
        </a>
      </div>
    </div>
  </header>
);

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* <Image
          className="dark:invert self-center sm:self-start" // Centered logo
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
        
        <div className="flex flex-col items-center gap-6 text-center w-full my-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-zinc-50">
            AI-Powered App Prototype
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Welcome to your end-to-end AI-native application builder. Describe your feature, and the AI will propose a code solution for review.
          </p>
          
          {/* Add the new AICreationForm component here */}
          <AICreationForm />
          
        </div>

        {/* Keeping the footer links for now, but you can remove them */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
          {/* <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="[https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app](https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy on Vercel
          </a> */}
          {/* <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="[https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app](https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app)"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a> */}
        </div>
      </main>
    </div>
  );
}