import Hero from "@/components/Hero";
import ArtCategories from "@/components/ArtCategories";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import ARPreview from "@/components/ARPreview";
import FeaturedArtists from "@/components/FeaturedArtists";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>TypeArts - Global Art Marketplace</title>
        <meta name="description" content="Discover and collect exceptional art from talented artists worldwide. TypeArts connects artists and collectors through innovative technology." />
        <meta property="og:title" content="TypeArts - Global Art Marketplace" />
        <meta property="og:description" content="Discover and collect exceptional art from talented artists worldwide. TypeArts connects artists and collectors through innovative technology." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Hero />
      <ArtCategories />
      <FeaturedArtworks />
      <ARPreview />
      <FeaturedArtists />
      <HowItWorks />
      <CallToAction />
    </>
  );
};

export default Home;
