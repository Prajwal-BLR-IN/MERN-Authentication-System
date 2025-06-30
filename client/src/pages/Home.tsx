import { useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/Appcontext";

const Home = () => {
  const {userData} = useAppContext();
   const textRef = useRef<HTMLHeadingElement>(null);
  const leafRef = useRef<HTMLImageElement>(null);
  const hill1Ref = useRef<HTMLImageElement>(null);
  const hill4Ref = useRef<HTMLImageElement>(null);
  const hill5Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      let value = window.scrollY;

      const maxScroll = 550; 
      if (value > maxScroll) value = maxScroll;
      if (textRef.current) textRef.current.style.marginTop = value * 2.5 + 'px';
      if (leafRef.current) {
        leafRef.current.style.top = value * -1.5 + 'px';
        leafRef.current.style.left = value * 1.5 + 'px';
      }
      if (hill5Ref.current) hill5Ref.current.style.left = value * 1.5 + 'px';
      if (hill4Ref.current) hill4Ref.current.style.left = value * -1.5 + 'px';
      if (hill1Ref.current) hill1Ref.current.style.top = value * 1 + 'px';
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <section className="parallax">
        <img src={assets.hill1} alt="hill" ref={hill1Ref} />
        <img src={assets.hill2} alt="hill" />
        <img src={assets.hill3} alt="hill" />
        <img src={assets.hill4} alt="hill" ref={hill4Ref} />
        <img src={assets.hill5} alt="hill" ref={hill5Ref} />
        <h1 className="parallax-text" ref={textRef}>
          Hey, {typeof userData === "object" && userData !== null && "name" in userData
            ? (userData as { name: string }).name
            : "Stranger"}!
        </h1>
        <img src={assets.tree} alt="tree" />
        <img src={assets.leaf} alt="leaf" ref={leafRef} />
        <img src={assets.plant} alt="plant" />
        <div className="hero-box"></div>
      </section>

      <section className="sec" >
        <h2 className="sec-text autoShow ">Introduction</h2>
        <p className="sec-paragraph autoShow" >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quidem delectus accusamus harum. Ullam neque nemo velit magnam deserunt provident culpa odit, numquam consequatur impedit illum ab est dolor consectetur ratione laborum blanditiis quod minima doloribus maiores expedita eos aut dicta animi! Incidunt, optio aperiam debitis quisquam architecto necessitatibus dolorem, voluptate dolor ab maiores, a voluptatem praesentium voluptas laboriosam voluptates vitae ea totam dolorum ducimus. Corporis magni vitae delectus similique cumque? Debitis totam, consequatur doloribus, soluta non animi ratione ipsa dicta assumenda voluptates reiciendis delectus explicabo repellendus maxime cum laborum. Corporis repellendus cupiditate praesentium tempora, non, sed facilis sint facere quidem doloremque excepturi voluptatum voluptatibus, obcaecati odio aliquid ut. Commodi id quos asperiores consequatur nihil voluptates nesciunt aut et, molestias nam adipisci, ut facilis unde quisquam mollitia aperiam quod ipsa iusto. Blanditiis necessitatibus, quo facere porro voluptatem non cupiditate. Nihil odio soluta debitis aliquam aperiam mollitia eos sed illum? Amet dignissimos, quasi eveniet vel quo voluptates rem aspernatur. Totam, ad suscipit veniam earum et quas corporis. Assumenda qui temporibus illo, neque natus eos quas iste! Maxime magnam molestiae inventore quibusdam aperiam, ipsum ex officia, esse culpa laudantium voluptatem repellat corporis fugit? Incidunt sed obcaecati et est ipsum praesentium beatae.
        </p>
        <p className="sec-paragraph autoShow" >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quidem delectus accusamus harum. Ullam neque nemo velit magnam deserunt provident culpa odit, numquam consequatur impedit illum ab est dolor consectetur ratione laborum blanditiis quod minima doloribus maiores expedita eos aut dicta animi! Incidunt, optio aperiam debitis quisquam architecto necessitatibus dolorem, voluptate dolor ab maiores, a voluptatem praesentium voluptas laboriosam voluptates vitae ea totam dolorum ducimus. Corporis magni vitae delectus similique cumque? Debitis totam, consequatur doloribus, soluta non animi ratione ipsa dicta assumenda voluptates reiciendis delectus explicabo repellendus maxime cum laborum. Corporis repellendus cupiditate praesentium tempora, non, sed facilis sint facere quidem doloremque excepturi voluptatum voluptatibus, obcaecati odio aliquid ut. Commodi id quos asperiores consequatur nihil voluptates nesciunt aut et, molestias nam adipisci, ut facilis unde quisquam mollitia aperiam quod ipsa iusto. Blanditiis necessitatibus, quo facere porro voluptatem non cupiditate. Nihil odio soluta debitis aliquam aperiam mollitia eos sed illum? Amet dignissimos, quasi eveniet vel quo voluptates rem aspernatur. Totam, ad suscipit veniam earum et quas corporis. Assumenda qui temporibus illo, neque natus eos quas iste! Maxime magnam molestiae inventore quibusdam aperiam, ipsum ex officia, esse culpa laudantium voluptatem repellat corporis fugit? Incidunt sed obcaecati et est ipsum praesentium beatae.
        </p>
        <img src={assets.footerImage} alt="footer-image" className="footerImage"  />
      </section>

    </>
  )
}

export default Home