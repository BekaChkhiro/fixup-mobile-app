import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

export async function callPhone(phoneNumber: string): Promise<void> {
  const cleanNumber = phoneNumber.replace(/\s/g, '');
  const url = `tel:${cleanNumber}`;

  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      'შეცდომა',
      'ტელეფონზე დარეკვა ვერ მოხერხდა',
      [{ text: 'კარგი' }]
    );
  }
}

export function formatPhoneNumber(phone: string): string {
  // Georgian phone format: +995 XXX XX XX XX
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('995') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }

  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}
