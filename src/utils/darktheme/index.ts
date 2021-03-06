export const addDarkThemeCSS = (): void => {
  const link = document.createElement('link');
  link.href = chrome.extension.getURL('styles/darktheme.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.id = 'darkThemeCSS';

  document.getElementsByTagName('head')[0].appendChild(link);
};

export const removeDarkThemeCSS = (): void => {
  document.getElementById('darkThemeCSS').remove();
};
