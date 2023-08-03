const SERVER_URL = 'https://29.javascript.pages.academy/kekstagram';
const ROUTE_PHOTO = '/data';
const DEFAULT_SHOW_ERROR_TIME = 10000;

/**
 * Handle response promise
 *
 * @param {Promise} request
 * @param {function} onSuccess
 * @param {function} onError
 */
const handleResponse = (request, onSuccess, onError) => {
  request.then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`${response.status} ${response.statusText}`);
  })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      onError(error);
    });
};

/**
 * Send get request
 *
 * @param url
 * @param onSuccess
 * @param onError
 */
const get = (url, onSuccess, onError) => {
  const request = fetch(url);
  handleResponse(request, onSuccess, onError);
};

/**
 * Show request error message
 *
 * @param errorMessage
 */
const showError = (errorMessage) => {
  const main = document.querySelector('main');
  const errorElement = document.createElement('div');
  errorElement.style.color = 'red';
  errorElement.style.textAlign = 'center';
  errorElement.id = 'apiError';
  errorElement.textContent = `При загрузке данных с сервера возникла ошибка: ${errorMessage}. Попробуйте перезагрузить страницу`;

  main.prepend(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, DEFAULT_SHOW_ERROR_TIME);
};

/**
 * Send form data
 *
 * @param formData
 * @param onSuccess
 * @param onError
 */
const sendData = (formData, onSuccess, onError) => {
  const request = fetch(
    SERVER_URL,
    {
      method: 'POST',
      body: formData
    }
  );
  handleResponse(request, onSuccess, onError);
};

/**
 * get photo data
 *
 * @param onSuccess
 */
const getPhotoData = (onSuccess) => {
  get(SERVER_URL + ROUTE_PHOTO, onSuccess, showError);
};

export {getPhotoData, sendData};
