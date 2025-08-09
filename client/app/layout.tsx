import type { Metadata } from "next";
import { Cinzel_Decorative, Karla, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/SharedComponents/Navbar";
import { ThemeProvider } from "@/lib/theme-context";
import clsx from "clsx";


const cinzel_decorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});


const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: [ "200", "300", "400", "500", "600", "700", "800"],
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: [ "200", "300", "400", "500", "600", "700", "800"],
});


export const metadata: Metadata = {
  title: "Key N Share",
  description: "Own, protect, and monetize your data in the Web3 era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(bricolage.variable ,karla.className ,  cinzel_decorative.variable, 'bg-white dark:bg-[#000000] text-black dark:text-white transition-colors duration-300')}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
