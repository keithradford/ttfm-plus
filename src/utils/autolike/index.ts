export const setupAutolike = (): void => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('autolike/index.js');
  script.id = 'autolike';

  document.querySelector('body').appendChild(script);
};
