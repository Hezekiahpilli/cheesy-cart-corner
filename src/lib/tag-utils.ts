import type { DietaryTag } from '@/types';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const TAG_LABEL_OVERRIDES: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  spicy: 'Spicy',
  bbq: 'BBQ',
  'garden-fresh': 'Garden Fresh',
  'sweet-savory': 'Sweet & Savory',
  loaded: 'Loaded',
  classic: 'Classic',
  'caffeine-free': 'Caffeine Free',
  'sugar-free': 'Sugar Free',
  'gluten-free': 'Gluten-Free',
};

const startCase = (value: string) =>
  value
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getTagLabel = (tag: DietaryTag | string) =>
  TAG_LABEL_OVERRIDES[tag] ?? startCase(tag);

export const getTagBadgeVariant = (tag: DietaryTag | string): BadgeVariant => {
  if (tag === 'spicy') {
    return 'destructive';
  }

  if (tag === 'vegetarian' || tag === 'vegan') {
    return 'secondary';
  }

  return 'outline';
};
