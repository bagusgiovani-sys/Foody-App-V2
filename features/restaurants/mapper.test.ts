import { describe, it, expect } from 'vitest';
import { toRestaurant, toMenuItemDetail, toReviewDetail, toRestaurantDetail } from './mapper';
import {
  apiRestaurant,
  apiMenuItem,
  apiReview,
  apiRestaurantDetail,
} from '@/test/fixtures/restaurant.fixture';

describe('toRestaurant', () => {
  it('maps star to rating', () => {
    const result = toRestaurant(apiRestaurant);
    expect(result.rating).toBe(4.5);
    expect(result).not.toHaveProperty('star');
  });

  it('preserves id, name, place, category, reviewCount, menuCount, priceRange', () => {
    const result = toRestaurant(apiRestaurant);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Warung Soto');
    expect(result.place).toBe('Jakarta Selatan');
    expect(result.category).toBe('Indonesian');
    expect(result.reviewCount).toBe(12);
    expect(result.menuCount).toBe(8);
    expect(result.priceRange).toEqual({ min: 15000, max: 50000 });
  });

  it('handles null category', () => {
    expect(toRestaurant({ ...apiRestaurant, category: null }).category).toBeNull();
  });

  it('omits distance when not present in source', () => {
    expect(toRestaurant(apiRestaurant).distance).toBeUndefined();
  });

  it('passes through distance when present', () => {
    expect(toRestaurant({ ...apiRestaurant, distance: 1.5 }).distance).toBe(1.5);
  });
});

describe('toMenuItemDetail', () => {
  it('maps foodName to name', () => {
    const result = toMenuItemDetail(apiMenuItem);
    expect(result.name).toBe('Soto Ayam');
    expect(result).not.toHaveProperty('foodName');
  });

  it('preserves food type', () => {
    expect(toMenuItemDetail(apiMenuItem).type).toBe('food');
  });

  it('preserves drink type', () => {
    expect(toMenuItemDetail({ ...apiMenuItem, type: 'drink' }).type).toBe('drink');
  });

  it('coerces unknown type to food', () => {
    expect(toMenuItemDetail({ ...apiMenuItem, type: 'snack' }).type).toBe('food');
  });

  it('preserves id, price, and image', () => {
    const result = toMenuItemDetail(apiMenuItem);
    expect(result.id).toBe(1);
    expect(result.price).toBe(25000);
    expect(result.image).toBe('https://example.com/soto.jpg');
  });
});

describe('toReviewDetail', () => {
  it('maps star to rating', () => {
    const result = toReviewDetail(apiReview);
    expect(result.rating).toBe(5);
    expect(result).not.toHaveProperty('star');
  });

  it('preserves comment, createdAt, and user', () => {
    const result = toReviewDetail(apiReview);
    expect(result.comment).toBe('Sangat enak!');
    expect(result.createdAt).toBe('2024-01-15T10:00:00Z');
    expect(result.user.name).toBe('Alice');
  });
});

describe('toRestaurantDetail', () => {
  it('maps star to rating', () => {
    expect(toRestaurantDetail(apiRestaurantDetail).rating).toBe(4.5);
  });

  it('drops averageRating from output', () => {
    expect(toRestaurantDetail(apiRestaurantDetail)).not.toHaveProperty('averageRating');
  });

  it('drops coordinates from output', () => {
    expect(toRestaurantDetail(apiRestaurantDetail)).not.toHaveProperty('coordinates');
  });

  it('maps nested menus — foodName becomes name', () => {
    const result = toRestaurantDetail(apiRestaurantDetail);
    expect(result.menus[0].name).toBe('Soto Ayam');
    expect(result.menus[0]).not.toHaveProperty('foodName');
  });

  it('maps nested reviews — star becomes rating', () => {
    expect(toRestaurantDetail(apiRestaurantDetail).reviews[0].rating).toBe(5);
  });

  it('preserves totalMenus and totalReviews', () => {
    const result = toRestaurantDetail(apiRestaurantDetail);
    expect(result.totalMenus).toBe(8);
    expect(result.totalReviews).toBe(12);
  });
});
