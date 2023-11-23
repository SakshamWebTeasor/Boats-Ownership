// AboutUs.tsx

import React from "react";
import styles from "../styles/About.module.css";
import Header from "@/Component/Header";

const AboutUs: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header Page="About" PrePage="Home" />
      <div className={styles.aboutContent}>
        <section>
          <h2 className={styles.sectionHeader+" mt-3"}>About Us</h2>
          <p>Welcome to <strong>Boat Coownership</strong>!</p>
        </section>

        <section>
          <h3 className={styles.sectionHeader+" mt-3"}>Our Mission</h3>

          <p>
            At <strong>Boat Coownership</strong>, our mission is to connect people with the joy of boating and create memorable experiences on the water. We strive to provide a seamless platform for boat enthusiasts to find their perfect vessel and for boat owners to connect with enthusiastic users.
          </p>
        </section>

        <section>
          <h3 className={styles.sectionHeader+" mt-3"}>Who We Are</h3>

          <p>
            <strong>Boat Coownership</strong> is a team of boating enthusiasts and technology experts who share a common love for the sea. We've combined our passion for boating with cutting-edge technology to bring you a platform that simplifies the boat buying and renting process. Our team comprises experienced sailors, tech wizards, and customer service champions.
          </p>
        </section>

        <section>
          <h3 className={styles.sectionHeader+" mt-3"}>What Sets Us Apart</h3>

          <ul>
            <li><strong>Diverse Fleet:</strong> Explore a diverse fleet of boats, from luxury yachts to speedy cruisers, ensuring there's a perfect option for every adventure.</li>
            <li><strong>User-Centric Design:</strong> Our platform is designed with users in mind. We've focused on creating an intuitive and user-friendly experience, making it easy for both boat owners and users to navigate.</li>
            <li><strong>Community Building:</strong> Join a community of boat enthusiasts and connect with like-minded individuals. Share your boating experiences, tips, and even plan joint adventures.</li>
          </ul>
        </section>

        <section>
          <h3 className={styles.sectionHeader+" mt-3"}>Our Team</h3>

          <div className={styles.teamMembers}>
            <div>
              <strong>Captain Marina Waters:</strong> As an experienced sailor, Captain Marina brings a wealth of knowledge about the seas and ensures the quality of each vessel on our platform.
            </div>
            <div>
              <strong>Tech Guru Max Masterson:</strong> Max is our technology expert, dedicated to ensuring that our platform runs smoothly and provides a secure and enjoyable experience for users.
            </div>
            <div>
              <strong>Customer Care Specialist Olivia Ocean:</strong> Olivia is here to assist you at every step. Whether you have questions about a boat listing or need guidance on using our platform, Olivia is here to help.
            </div>
          </div>
        </section>

        <section>
          <h3 className={styles.sectionHeader+" mt-3"}>Contact Us</h3>

          <p>
            Ready to set sail or have questions about <strong>Boat Coownership</strong>? Reach out to us at <a href="mailto:contact@boatcoownership.com">contact@boatcoownership.com</a> – we're excited to assist you on your boating journey!
          </p>
        </section>

        <p>
          Thank you for choosing <strong>Boat Coownership</strong>. Let's make waves together!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
