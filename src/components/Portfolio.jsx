import React from "react";
import "./portfolio.css";

const Portfolio = () => {
  React.useEffect(() => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }, []);

  const handleCopy = async (text, e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = "Copy";
      }, 1200);
    } catch {
      alert("Copy failed. Please copy manually: " + text);
    }
  };

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="page-root">
      <header className="site-header">
        <nav className="nav">
          <a href="#top" className="logo">
            Kanhaiya
          </a>
          <div className="nav-links">
            <a href="#projects" onClick={e => handleNavClick(e, "#projects")}>
              Projects
            </a>
            <a href="#skills" onClick={e => handleNavClick(e, "#skills")}>
              Skills
            </a>
            <a
              href="#experience"
              onClick={e => handleNavClick(e, "#experience")}
            >
              Workshops
            </a>
            <a
              href="#education"
              onClick={e => handleNavClick(e, "#education")}
            >
              Education
            </a>
            <a href="#contact" onClick={e => handleNavClick(e, "#contact")}>
              Contact
            </a>
          </div>
        </nav>

        <section className="hero" id="top">
          <div className="hero-text">
            <h1>Hi, I’m Kanhaiya Prasad Sah</h1>
            <p className="subtitle">
              Entry-level developer focused on practical, real-world solutions —
              Python, Java, React, front-end, Android, IoT, and face
              recognition.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn primary">
                View projects
              </a>
              <a
                href="https://www.linkedin.com/in/kanhaiya-sah"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                LinkedIn
              </a>
              <a
                href="mailto:ksah1674@gmail.com"
                className="btn"
              >
                Email
              </a>
              {/* Optional: resume link if you host the PDF */}
              {/* <a href="/KANHAIYA-PRASAD-SAH-RESUME.pdf" target="_blank" rel="noopener noreferrer" className="btn outline">
                Resume
              </a> */}
            </div>
          </div>

          <div className="hero-aside">
            <div className="card objective">
              <h3>Objective</h3>
              <p>
                I’m seeking an entry-level role where I can apply programming and
                problem-solving while learning through hands-on experience rather
                than collecting certificates.
              </p>
            </div>
          </div>
        </section>
      </header>

      <main>
        {/* Projects */}
        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="grid cards">
            {/* Student Attendance Tracker */}
            <article className="card project">
              <div className="card-media">
                <img
                  src="assets/attendance-app.webp"
                  alt="Student Attendance Tracker Kotlin app"
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <h3>Student Attendance Tracker (Kotlin)</h3>
                <p>
                  Daily attendance app built with Kotlin and Android Studio,
                  designed as a simple, reliable classroom attendance sheet and
                  published on the Amazon Appstore.
                </p>
                <ul className="meta">
                  <li>
                    <strong>Stack:</strong> Kotlin, Android Studio
                  </li>
                  <li>
                    <strong>Role:</strong> Solo developer
                  </li>
                </ul>
                <div className="links">
                  <a
                    className="btn small"
                    href="https://www.amazon.com/dp/B0D4DX3DXP"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Amazon Appstore
                  </a>
                </div>
              </div>
            </article>

            {/* Amazon Clone */}
            <article className="card project">
              <div className="card-media">
                <img
                  src="assets/amazon-clone.webp"
                  alt="Amazon Clone front-end website"
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <h3>Amazon Clone (Front-end)</h3>
                <p>
                  Responsive front-end clone of Amazon built by following Apna
                  College resources, focusing on layout structure, reusable
                  components, and CSS architecture.
                </p>
                <ul className="meta">
                  <li>
                    <strong>Stack:</strong> HTML, CSS, JavaScript
                  </li>
                </ul>
                <div className="links">
                  <a
                    className="btn small"
                    href="https://kanhaiyaprasadsah.github.io/Amazon-Clone/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live demo
                  </a>
                  <a
                    className="btn small outline"
                    href="https://github.com/kanhaiyaprasadsah/Amazon-Clone"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </article>

            {/* Game Hub (React) */}
            <article className="card project">
              <div className="card-media">
                <img
                  src="assets/game-hub.webp"
                  alt="Game Hub React project"
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <h3>Game Hub (React)</h3>
                <p>
                  Front-end Game Hub built using React, JavaScript, HTML and CSS,
                  showcasing component-based UI, state management, and responsive
                  design for game listing interfaces.
                </p>
                <ul className="meta">
                  <li>
                    <strong>Stack:</strong> React, JavaScript, HTML, CSS
                  </li>
                </ul>
                <div className="links">
                  {/* Replace with your actual links if different */}
                  <a
                    className="btn small outline"
                    href="https://kanhaiyaprasadsah.github.io/game_hub/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </article>

            {/* Login Auth App */}
            <article className="card project">
              <div className="card-media">
                <img
                  src="assets/flutter-auth.webp"
                  alt="Login authentication app built with Flutterflow and Firebase"
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <h3>Login Auth App (Flutterflow + Firebase)</h3>
                <p>
                  Authentication app built with Flutterflow and Firebase backend,
                  demonstrating rapid no-code/low-code prototyping and secure auth
                  flows with email-based login.
                </p>
                <ul className="meta">
                  <li>
                    <strong>Stack:</strong> Flutterflow, Firebase
                  </li>
                </ul>
                <div className="links">
                  <a
                    className="btn small"
                    href="https://www.linkedin.com/posts/kanhaiya-sah_excited-to-share-that-i-recently-built-a-activity-7315971572329009152-bH2b"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo video
                  </a>
                </div>
              </div>
            </article>

            {/* Face Attendance Application */}
            <article className="card project">
              <div className="card-media">
                <img
                  src="assets/face-attendance.webp"
                  alt="Face attendance application using Python and OpenCV"
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <h3>Face Attendance Application</h3>
                <p>
                  Prototype face-recognition-based attendance system combining
                  Python, OpenCV, Copilot-assisted coding, and Java GUI components
                  to focus on real-time detection and reliability.
                </p>
                <ul className="meta">
                  <li>
                    <strong>Stack:</strong> Python, OpenCV, Java GUI, Copilot AI
                  </li>
                </ul>
                <div className="links">
                  <a
                    className="btn small"
                    href="https://www.linkedin.com/posts/kanhaiya-sah_project-facetrack-intelligent-face-recognition-activity-7360497727224365057-o0E0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo video
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="section">
          <h2>Skills</h2>
          <div className="grid skills">
            <div className="skill-group">
              <h3>Languages</h3>
              <ul>
                <li>C</li>
                <li>Java</li>
                <li>Python</li>
                <li>JavaScript</li>
              </ul>
            </div>
            <div className="skill-group">
              <h3>Front-end</h3>
              <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>React (learning & projects)</li>
              </ul>
            </div>
            <div className="skill-group">
              <h3>Databases</h3>
              <ul>
                <li>MySQL</li>
                <li>Firebase</li>
              </ul>
            </div>
            <div className="skill-group">
              <h3>Tools</h3>
              <ul>
                <li>Android Studio</li>
                <li>Arduino IDE</li>
                <li>VS Code</li>
                <li>Postman</li>
                <li>Flutterflow</li>
                <li>Tableau</li>
                <li>MS Excel / Word</li>
                <li>CMD, Python IDLE</li>
              </ul>
            </div>
            <div className="skill-group">
              <h3>Additional</h3>
              <ul>
                <li>API Testing</li>
                <li>Arduino / Raspberry Pi (IoT)</li>
                <li>Basic CAD</li>
                <li>Share market & business interest</li>
              </ul>
            </div>
            <div className="skill-group">
              <h3>Soft skills</h3>
              <ul>
                <li>Problem solving</li>
                <li>Team player</li>
                <li>Creative thinking</li>
                <li>Presentation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Workshops & Internships */}
        <section id="experience" className="section">
          <h2>Workshops & Internships</h2>
          <div className="timeline">
            <div className="timeline-item">
              <h3>IoT Workshop</h3>
              <p>
                Embedded systems with IoT using Arduino; basics of sensors,
                microcontrollers, and real-time applications.
              </p>
            </div>
            <div className="timeline-item">
              <h3>Data Science Workshop (February 2024)</h3>
              <p>
                Data science using Python; foundations in data analysis and
                visualization.
              </p>
            </div>
            <div className="timeline-item">
              <h3>Cisco Workshop</h3>
              <p>
                Learned network design using Cisco Packet Tracer for real-time
                scenarios and simulations.
              </p>
            </div>
            <div className="timeline-item">
              <h3>Android App Development (Kotlin)</h3>
              <p>
                Android Basics in Compose course; earned badges on my Google
                Developers profile.
              </p>
              <p>
                <a
                  href="https://developer.android.com/courses/android-basics-compose/course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Course
                </a>{" "}
                ·{" "}
                <a
                  href="https://g.dev/dkshah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Badges
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="section">
          <h2>Education</h2>
          <div className="edu">
            <div className="edu-item">
              <h3>Guru Nanak Institute of Technology — B.Tech (IT)</h3>
              <p>CGPA: 7.8 (approx. 78%) · Hyderabad, India</p>
            </div>
            <div className="edu-item">
              <h3>Dhanusha Science Campus — Intermediate</h3>
              <p>GPA: 3.15 (approx. 78.75%) · Janakpur, Nepal</p>
            </div>
            <div className="edu-item">
              <h3>Mithila Montessori School — Schooling</h3>
              <p>GPA: 3.20 (approx. 80%) · Janakpur, Nepal</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section contact">
          <h2>Contact</h2>
          <div className="contact-grid">
            <div>
              <p>
                <strong>Location:</strong> Hyderabad, Telangana, India
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:ksah1674@gmail.com">ksah1674@gmail.com</a>
                <button
                  className="copy"
                  onClick={e => handleCopy("ksah1674@gmail.com", e)}
                >
                  Copy
                </button>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+917396090180">+91 7396090180</a>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/kanhaiya-sah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kanhaiya-sah
                </a>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a
                  href="https://github.com/kanhaiyaprasadsah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kanhaiyaprasadsah
                </a>
              </p>
              <p>
                <strong>Languages:</strong> English, Hindi, Nepali, Maithili,
                Bhojpuri
              </p>
            </div>
            <div className="contact-note">
              <p>
                I’m eager to collaborate on real-time projects and entry-level
                roles where I can build and ship reliable solutions, learn new
                technologies, and keep improving my problem-solving skills.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © <span id="year"></span> Kanhaiya Prasad Sah
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;
