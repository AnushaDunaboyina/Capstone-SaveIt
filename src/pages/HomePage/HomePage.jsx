import { Link } from "react-router-dom";
import "./HomePage.scss";
import note from "../../assets/images/note1.png";
import link from "../../assets/images/link16.png";
import document from "../../assets/images/doc3.png";

export default function HomePage() {
  return (
    <main className="main-content">
      <div className="homepage">
        <div className="homepage__hero">
          <h2 className="homepage__hero-heading">Save. Organize. Thrive.</h2>
          <p className="homepage__hero-description">
            The all-in-one local storage solution for smarter productivity and
            seamless organization.
          </p>
        </div>

        <div className="homepage__features">
          <div className="homepage__feature homepage__feature--notes">
            <img
              src={note}
              alt="notes image"
              className="homepage__feature-image"
            />
            <div className="homepage__feature-content">
              <h3 className="homepage__feature-heading">
                The only limit is your imagination
              </h3>
              <p className="homepage__feature-description">
                Be limitless with your thoughts and explore the world of
                fun-filled note-taking.
              </p>
              <Link to="/notes">
                <button className="homepage__feature-button">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          <div className="homepage__feature homepage__feature--links">
            <div className="homepage__feature-content">
              <h3 className="homepage__feature-heading">
                Connect smarter, not harder
              </h3>
              <p className="homepage__feature-description">
                Keep your online tools, resources, and inspirations all in one
                place. With Links, efficiency is just a click away.
              </p>
              <Link to="/links">
                <button className="homepage__feature-button">
                  Get Started
                </button>
              </Link>
            </div>
            <img src={link} alt="Links" className="homepage__feature-image" />
          </div>

          <div className="homepage__feature homepage__feature--documents">
            <img
              src={document}
              alt="Documents"
              className="homepage__feature-image"
            />
            <div className="homepage__feature-content">
              <h3 className="homepage__feature-heading">
                Power up your productivity
              </h3>
              <p className="homepage__feature-description">
                Transform the way you manage files. Stay organized, work
                smarter, and accomplish more with your Documents at your
                fingertips.
              </p>
              <Link to="/documents">
                <button className="homepage__feature-button">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
