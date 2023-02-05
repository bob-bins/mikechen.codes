export const isMobileDevice = (navigator: Navigator) => navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i);
