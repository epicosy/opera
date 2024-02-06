import "../styles/globals.css"
import Sidebar from "../components/Sidebar";
import Footer from "./footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body className="flex flex-col min-h-screen">
      <Sidebar/>
      <div className="relative md:ml-48 bg-gray-100 flex-1">
          {/* Header */}
          {children}
      </div>
      <Footer/>
      </body>
    </html>
  )
}
