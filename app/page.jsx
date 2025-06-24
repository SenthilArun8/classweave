import Hero from './components/Hero';
import SubHeading from './components/SubHeading';
import SamplePage from './components/SamplePage';
import SampleStories from './components/SampleStories';

export default function Home() {
  return (
    <>
      <Hero
        title='Classweave AI'
        subtitle='Find personalized activities for toddlers, preschoolers, and students'
      />
      <SampleStories />
      <SamplePage />
      <SubHeading />
    </>
  );
}
