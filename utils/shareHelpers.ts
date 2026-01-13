import { Share, Platform } from 'react-native';
import type { MechanicService, Laundry, Drive } from '@/types';

interface ShareOptions {
  title: string;
  message: string;
  url?: string;
}

async function shareContent({ title, message, url }: ShareOptions): Promise<void> {
  try {
    const content = Platform.select({
      ios: { title, message, url },
      android: { title, message: url ? `${message}\n${url}` : message },
    });

    await Share.share(content as { title: string; message: string; url?: string });
  } catch (error) {
    // User cancelled or error occurred
    console.log('Share cancelled or failed');
  }
}

export async function shareService(service: MechanicService): Promise<void> {
  const url = `https://fixmyride.ge/service/${service.id}`;
  const priceText = service.price_from && service.price_to
    ? `${service.price_from}-${service.price_to} ₾`
    : service.price_from
    ? `${service.price_from} ₾-დან`
    : '';

  await shareContent({
    title: service.name,
    message: `${service.name}${priceText ? ` - ${priceText}` : ''}\n${service.address || ''}`,
    url,
  });
}

export async function shareLaundry(laundry: Laundry): Promise<void> {
  const url = `https://fixmyride.ge/laundry/${laundry.id}`;

  await shareContent({
    title: laundry.name,
    message: `${laundry.name}\n${laundry.address || ''}`,
    url,
  });
}

export async function shareDrive(drive: Drive): Promise<void> {
  const url = `https://fixmyride.ge/drive/${drive.id}`;

  await shareContent({
    title: drive.name,
    message: `${drive.name}\n${drive.address || ''}`,
    url,
  });
}
