/**
 * Utility for Telegram WebApp Haptic Feedback
 */
export const triggerHaptic = (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy' | 'selection') => {
  try {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    if (!tg?.HapticFeedback) return;

    switch (type) {
      case 'success':
      case 'warning':
      case 'error':
        tg.HapticFeedback.notificationOccurred(type);
        break;
      case 'light':
      case 'medium':
      case 'heavy':
        tg.HapticFeedback.impactOccurred(type);
        break;
      case 'selection':
        tg.HapticFeedback.selectionChanged();
        break;
    }
  } catch (e) {
    console.warn('Haptic feedback not supported or failed', e);
  }
};
