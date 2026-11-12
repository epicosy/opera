import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "FindThemAll / Examination", description: "Examination workspace" };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}
