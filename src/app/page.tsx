import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen bg-[#F7F4ED] w-full relative flex flex-col gap-5 text-center justify-center items-center">
      <header className="w-full flex justify-between items-center absolute top-0 py-5 px-40 border-b border-black">
        <h1 className="text-3xl font-sans font-semibold">Medium</h1>
        <div className="flex items-center gap-7">
          <h3 className="font-medium">Our story</h3>
          <h3 className="text-[14px] font-medium">Membership</h3>
          <h3 className="text-[14px] font-medium">Write</h3>
          <Link
            className="text-[14px] font-medium text-black"
            href="/auth/signin"
          >
            Sign in
          </Link>
          <Link
            className="text-[14px] bg-black rounded-full font-medium py-2 px-4 text-white"
            href="/auth/signup"
          >
            Sign up
          </Link>
        </div>
      </header>
      <main className="flex justify-between w-full h-full items-center overflow-hidden">
        <div className="flex justify-center ml-36 gap-10 flex-col items-start">
          <h1 className="text-left text-[#242424] text-[100px] leading-[.9]">Human <br />stories & ideas</h1>
          <p className="text-[24px] text-[#242424] font-[100] ">A place to read, write, and deepen your understanding</p>
          <button className="text-[20px] text-white bg-[#191919] px-8 py-2 rounded-full">Start reading</button>
        </div>
        <img className="h-[542px] object-cover object-center" src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png" alt="" />
      </main>
      <footer className="w-full text-[13px] flex justify-center items-center gap-5 absolute bottom-0 py-5 border-t border-black">
        <h3 className="text-[#6B6B6B] cursor-pointer">Help</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Status</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">About</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Carrers</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Press</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Blog</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Privacy</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Term</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Text to speech</h3>
        <h3 className="text-[#6B6B6B] cursor-pointer">Teams</h3>
      </footer>
    </main>
  );
}
