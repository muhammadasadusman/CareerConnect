
import Companies from "../components/Companies/Companies";
import FeaturedJobs from "../components/FeaturedJobs/FeaturedJobs";
import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navbar/Navbar";
import Stats from "../components/Stats/Stats";

const Home = () => {
  return(
  <>
  <Navbar/>
  <Hero/>
  <Stats/>
  <FeaturedJobs/>
  <Companies/>
  </>
  );
};

export default Home;