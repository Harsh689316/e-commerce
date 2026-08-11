import Footer from "./Footer";
import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />

      <main className="layout-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;