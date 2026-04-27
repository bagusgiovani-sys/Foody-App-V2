'use client';

import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { name: 'All Restaurant', icon: '/assets/Category/All Food.svg',     href: '/restaurants' },
  { name: 'Nearby',         icon: '/assets/Category/Location.svg',     href: '/restaurants?range=10' },
  { name: 'Discount',       icon: '/assets/Category/Discount.svg',     href: '/restaurants?priceMax=20000' },
  { name: 'Best Seller',    icon: '/assets/Category/Best Seller.svg',  href: '/restaurants?rating=4' },
  { name: 'Delivery',       icon: '/assets/Category/Delivery.svg',     href: '/restaurants?category=Delivery' },
  { name: 'Lunch',          icon: '/assets/Category/Lunch.svg',        href: '/restaurants?category=Lunch' },
] as const;

export default function CategoryShortcuts() {
  return (
    <section className="py-10 px-8 bg-white" aria-label="Browse by category">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between gap-4 md:gap-8">
          {CATEGORIES.map(({ name, icon, href }) => (
            <Link
              key={name}
              href={href}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-50 rounded-full flex items-center justify-center transition-all duration-200 group-hover:bg-orange-100">
                <Image
                  src={icon}
                  alt=""
                  width={36}
                  height={36}
                  className="transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-800 text-center transition-colors group-hover:text-red-500">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
