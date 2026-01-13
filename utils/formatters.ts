export function formatPrice(priceFrom?: number | null, priceTo?: number | null): string {
  if (priceFrom && priceTo) {
    if (priceFrom === priceTo) {
      return `${priceFrom} ₾`;
    }
    return `${priceFrom} - ${priceTo} ₾`;
  }

  if (priceFrom) {
    return `${priceFrom} ₾-დან`;
  }

  if (priceTo) {
    return `${priceTo} ₾-მდე`;
  }

  return '';
}

export function formatRating(rating?: number | null): string {
  if (!rating) return '0.0';
  return rating.toFixed(1);
}

export function formatReviewCount(count?: number | null): string {
  if (!count) return '0';

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return count.toString();
}

export function formatEstimatedTime(hours?: number | null): string {
  if (!hours) return '';

  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} წუთი`;
  }

  if (hours === 1) {
    return '1 საათი';
  }

  if (hours < 24) {
    return `${hours} საათი`;
  }

  const days = Math.round(hours / 24);
  return `${days} დღე`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = [
    'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
    'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
  ];
  const month = months[date.getMonth()];

  return `${day} ${month}`;
}

export function formatFuelPrice(price?: number | null): string {
  if (!price) return '-';
  return `${price.toFixed(2)} ₾`;
}
