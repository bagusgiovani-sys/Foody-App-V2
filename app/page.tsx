import MainLayout from '@/components/layout/MainLayout';
import HeroSearch from '@/components/layout/HeroSearch';
import CategoryShortcuts from '@/features/restaurants/components/CategoryShortcuts';
import RecommendedSection from '@/features/restaurants/components/RestaurantList';

export default function HomePage() {
  return (
    <MainLayout>
      <section className="relative min-h-[85vh] -mt-[88px]" aria-label="Hero">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/food-hero.jpg)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" aria-hidden="true" />

        <div className="relative flex min-h-[85vh] flex-col items-center justify-center px-8 text-center pt-[88px]">
          <h1 className="mb-4 text-5xl md:text-6xl font-bold text-white leading-tight">
            Explore Culinary Experiences
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Search and refine your choice to discover the perfect restaurant.
          </p>
          <HeroSearch />
        </div>
      </section>

      <CategoryShortcuts />
      <RecommendedSection />
    </MainLayout>
  );
}
