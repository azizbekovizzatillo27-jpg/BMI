const https = require('https');

function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    if (!text || text.trim() === '') {
      return resolve('');
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const translated = parsed[0].map(item => item[0]).join('');
            resolve(translated);
          } else {
            resolve(text); // Fallback to original text if something goes wrong
          }
        } catch (err) {
          console.error('Translation parsing error:', err);
          resolve(text); // Fallback
        }
      });
    }).on('error', (err) => {
      console.error('Translation network error:', err);
      resolve(text); // Fallback
    });
  });
}

/**
 * Automates translation of object fields.
 * If _uz field exists, and _en or _ru fields are empty, it will translate the _uz field to them.
 * Example: obj = { title_uz: 'Salom', title_en: '', title_ru: '' } -> translates title_en and title_ru
 */
async function autoTranslateObject(obj, fieldsToTranslate) {
  for (const field of fieldsToTranslate) {
    const uzField = `${field}_uz`;
    const enField = `${field}_en`;
    const ruField = `${field}_ru`;

    if (obj[uzField] && obj[uzField].trim() !== '') {
      // Translate to English if empty
      if (!obj[enField] || obj[enField].trim() === '') {
        obj[enField] = await translateText(obj[uzField], 'en');
      }
      // Translate to Russian if empty
      if (!obj[ruField] || obj[ruField].trim() === '') {
        obj[ruField] = await translateText(obj[uzField], 'ru');
      }
    }
  }
  return obj;
}

module.exports = {
  translateText,
  autoTranslateObject
};
