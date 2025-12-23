import styles from "./HomeFooter.module.css";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";

function HomeFooter() {
  return (
    <footer className={styles.homeFooter}>
      <h1>Learnit</h1>
      <span className={styles.tagline}>
        © 2025 Learnit. All rights reserved.
      </span>
      <Socials />
    </footer>
  );
}

export default HomeFooter;

function Socials() {
  return (
    <div className={styles.socials}>
      <FaGithub />
      <FaLinkedin />
      <FaGlobe />
    </div>
  );
}
