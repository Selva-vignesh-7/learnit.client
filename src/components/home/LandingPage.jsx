import styles from "./LandingPage.module.css";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Team />
      <GetStarted />
    </>
  );
}

export default LandingPage;

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <h1>
          Learn Better.
          <br /> Plan Smarter.
        </h1>
        <p>
          The AI-Powered Personalized Study Planner automatically organizes your
          learning goals into a structured, efficient, and personalized weekly
          schedule.
        </p>
        <div className={styles.buttons}>
          <Link to="/auth/register" className={styles.getStartedButton}>
            Get Started
          </Link>
          <a href="#features" className={styles.learnMoreButton}>
            Learn More
          </a>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img src="src/assets/hero-image.png" alt="Hero Illustration" />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className={styles.features}>
      <h2>Product Features</h2>
      <p>
        Smart scheduling, structured modules, and real-time progress tracking—
        all working together to keep your learning consistent and effortless.
      </p>
      <div className={styles.featureList}>
        <div className={styles.featureItem}>
          <img
            src="src/assets/personalized-learning.jpg"
            alt="Personalized Plans"
          />
          <h3>Personalized Plans</h3>
          <p>
            Your availability + your goals = a structured weekly plan optimized
            for pacing, order, and balance.
          </p>
        </div>
        <div className={styles.featureItem}>
          <img
            src="src/assets/ai-course-structure.jpg"
            alt="AI-Generated Course Structure"
          />
          <h3>AI-Generated Course Structure</h3>
          <p>
            Enter your topics — the system creates complete modules, subtopics,
            and estimates for how long each part will take.
          </p>
        </div>
        <div className={styles.featureItem}>
          <img src="src/assets/progress-tracking.jpg" alt="Progress Tracking" />
          <h3>Progress Tracking</h3>
          <p>
            Track your completed sessions, understand your workload, and get
            helpful AI-backed recommendations to stay consistent.
          </p>
        </div>
        <div className={styles.featureItem}>
          <img src="src/assets/resource-library.jpg" alt="Resource Library" />
          <h3>Resource Library</h3>
          <p>
            Access a vast library of learning materials and resources with the
            help of AI.
          </p>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="about-us" className={styles.team}>
      <h2>Meet the Team</h2>
      <p>The developers behind the AI-Powered Personalized Study Planner.</p>
      <div className={styles.teamList}>
        <div className={styles.teamItem}>
          <img src="src/assets/hero-image.png" alt="Aravinth Krishna R" />
          <h3>Aravinth Krishna R</h3>
          <h4>Full Stack Developer</h4>
          <Socials
            github="https://github.com/yourusername"
            linkedin="https://www.linkedin.com/in/aravinthkrishna/"
            website="https://yourwebsite.com"
          />
        </div>
        <div className={styles.teamItem}>
          <img src="src/assets/hero-image.png" alt="Selvavignesh G R" />
          <h3>Selvavignesh G R</h3>
          <h4>Full Stack Developer</h4>
          <Socials
            github="https://github.com/selvavignesh"
            linkedin="https://www.linkedin.com/in/selvavignesh/"
            website="https://yourwebsite.com"
          />
        </div>
        <div className={styles.teamItem}>
          <img src="src/assets/hero-image.png" alt="Karolina A" />
          <h3>Karolina A</h3>
          <h4>Full Stack Developer</h4>
          <Socials github="#" linkedin="#" website="#" />
        </div>
        <div className={styles.teamItem}>
          <img src="src/assets/hero-image.png" alt="Loga Priya S" />
          <h3>Loga Priya S</h3>
          <h4>Full Stack Developer</h4>
          <Socials github="#" linkedin="#" website="#" />
        </div>
      </div>
    </section>
  );
}

function Socials({ github, linkedin, website }) {
  return (
    <div className={styles.socials}>
      <a href={github} target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>
      <a href={website} target="_blank" rel="noopener noreferrer">
        <FaGlobe />
      </a>
    </div>
  );
}

function GetStarted() {
  return (
    <section id="contact" className={styles.getStarted}>
      <h2>Start Your Personalized Learning Journey!</h2>
      <p>
        Turn your goals into a structured, achievable weekly plan — powered by
        AI, tailored entirely for you.
      </p>
      <Link to="/auth/register" className={styles.getStartedButton}>
        Get Started
      </Link>
    </section>
  );
}
