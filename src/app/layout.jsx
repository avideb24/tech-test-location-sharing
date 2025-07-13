import "./globals.css";

export const metadata = {
  title: "Tech Test",
  description: "",
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">

      <body
        className={`antialiased bg-light dark:bg-dark text-dark dark:text-light`}>
       
        <div className="min-h-screen">
          {children}
        </div>
       
      </body>
    </html>
  );
}
