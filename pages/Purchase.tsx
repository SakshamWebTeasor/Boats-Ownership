// AboutUs.tsx

import React from "react";
import styles from "../styles/About.module.css";
import Header from "@/Component/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import ApiLink from "@/Component/ApiLink";

export const getStaticProps: GetStaticProps = async () => {
  const BoatsImage = await fetch(`${ApiLink}/BoatsImage`);
  const boatsImg: string[] = await BoatsImage.json();
  console.log("boatsImg", boatsImg);
  return { props: { boatsImg } };
};

export default function Purchase({
  boatsImg,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={styles.container}>
      <Header Page="Purchase" PrePage="Home" />
      <div className={styles.aboutContent}>
        <section>
          <h2 className={styles.sectionHeader + " mt-3"}>
            Welcome to Boat Coownership Boat Sales
          </h2>
          <p>Explore a World of Possibilities on the Water</p>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>
            Why Choose Boat Coownership Boats?
          </h3>

          <ul>
            <li>
              <strong>Unrivaled Quality:</strong> Each boat in our collection is
              crafted with precision and attention to detail, ensuring a vessel
              that not only looks stunning but also performs flawlessly on the
              water.
            </li>
            <li>
              <strong>Innovative Design:</strong> We stay ahead of the curve
              with cutting-edge designs, incorporating the latest technology to
              enhance safety, efficiency, and overall enjoyment.
            </li>
            <li>
              <strong>Versatility for Every Lifestyle:</strong> Whether you're a
              fishing enthusiast, a family seeking leisurely cruises, or an
              adventure seeker, our diverse range of boats caters to every
              lifestyle and water activity.
            </li>
            <li>
              <strong>Exceptional Performance:</strong> Experience the thrill of
              the open water with boats engineered for exceptional speed,
              maneuverability, and fuel efficiency.
            </li>
          </ul>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>Our Boat Models</h3>
          <Swiper
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {boatsImg?.map((img:string, index:number) => (
              <SwiperSlide>
                <Image
                  src={img}
                  alt={`Boat ${index + 1}`}
                  className={styles.boatImage}
                  width={750}
                  height={750}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>
            The Boat Coownership Advantage
          </h3>

          <ul>
            <li>
              <strong>Customer Satisfaction:</strong> Our commitment to customer
              satisfaction is unwavering. Join a community of happy boat owners
              who have experienced the excellence of Boat Coownership.
            </li>
            <li>
              <strong>Warranty and Support:</strong> Rest easy knowing that your
              investment is protected. Our boats come with comprehensive
              warranties, and our support team is always ready to assist you.
            </li>
          </ul>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>
            Explore Your Next Adventure Today
          </h3>

          <p>
            Ready to make a splash? Browse our collection of exceptional boats
            and take the first step toward a lifetime of aquatic enjoyment.
            Contact us for more information, schedule a test drive, or start
            your purchase journey now.
          </p>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>For partnership</h3>

          <p>
            Partner With Boat Coownership: Elevate Your Business on the Water
          </p>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>
            Why Partner With Boat Coownership?
          </h3>

          <ul>
            <li>
              <strong>Expand Your Reach:</strong> Access our extensive network
              of boating enthusiasts and potential customers. Partnering with us
              provides a unique avenue to showcase your products or services to
              a targeted and engaged audience.
            </li>
            <li>
              <strong>Credibility and Trust:</strong> Benefit from the
              reputation and trust that Boat Coownership has built in the
              boating community. Associating your brand with ours adds
              credibility and instills confidence in your offerings.
            </li>
            <li>
              <strong>Cross-Promotion Opportunities:</strong> Collaborate on
              marketing campaigns, events, and promotions to maximize exposure
              for both parties. Leverage our marketing channels and expertise to
              amplify your brand presence.
            </li>
            <li>
              <strong>Exclusive Discounts and Packages:</strong> Create
              exclusive packages or discounts for our boat buyers, providing
              added value and incentives for them to engage with your business.
            </li>
          </ul>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>
            How to Partner With Us
          </h3>

          <ul>
            <li>
              <strong>Explore Opportunities:</strong> Identify potential areas
              of collaboration that align with your business goals and target
              audience.
            </li>
            <li>
              <strong>Contact Us:</strong> Reach out to our partnership team to
              discuss your ideas, goals, and how we can work together to create
              a mutually beneficial partnership.
            </li>
            <li>
              <strong>Tailored Collaboration:</strong> We believe in customizing
              partnerships to ensure maximum impact. Our team will work with you
              to create a tailored collaboration plan that meets your specific
              needs.
            </li>
          </ul>
        </section>

        <section>
          <h3 className={styles.sectionHeader + " mt-3"}>
            Join Us in Shaping the Future of Boating
          </h3>

          <p>
            Partnering with Boat Coownership is more than a business
            collaboration; it's a journey toward mutual growth and success.
            Connect with us today and let's explore the exciting possibilities
            that lie ahead.
          </p>
        </section>
      </div>
    </div>
  );
}
