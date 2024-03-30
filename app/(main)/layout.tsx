import {MobileHeader} from "@/components/mobile-header";
import {Sidebar} from "@/components/sidebar";
import React from "react";

function LeanLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:block" />

      <main className="lg:pl-[256px] min-h-screen pt-[50px] lg:pt-0 ">
        <div className="max-w-[1056px] mx-auto pt-6 min-h-screen">
          {children}
        </div>
      </main>
    </>
  );
}

export default LeanLayout;
