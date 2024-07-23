/**
 * fetch 封装，timeout，cancel;
    ========================
    const p = $get(
      "https://api.apiopen.top/getJoke",
      {
        page: 1,
        count: 2,
        type: "video"
      },
      {
        credentials: "omit",
        headers: {
          "Content-Type": "text/plain"
        }
      }
    );
    console.log(p);
    p.then(res => {
      console.log("res:::", res);
    }).catch(err => {
      console.log("err:::", err);
    });
    // 手动取消请求
    p.cancel();
 */
import { qsStringify } from './index';

// 默认超时：30s
const defaultTimeout = 30 * 1000;
// 默认url
const defaultURL = '';
// 默认fetch配置
const defaultConfig = {
  credentials: 'include',
  mode: 'cors',
  cache: 'default',
  headers: {
    'Content-Type': 'application/json'
  }
};
// 校验status状态码
const checkStatus = (reject, response) => {
  const response2json = response.json();
  if (response.status >= 200 && response.status < 300) {
    console.log('response2json: ', response2json);
    return response2json;
  } else {
    reject(response2json);
  }
};
export const _fetch = (
  (fetch) =>
  (url, { timeout = defaultTimeout, ...rest }) => {
    console.log(url, { timeout, ...rest });
    // 定义终止函数
    let Abort = null;
    // 可被终止（reject）的promise
    const abort_promise = new Promise((resolve, reject) => {
      Abort = (msg = 'canceled.') => {
        reject(msg);
      };
    });
    // 调用超时
    if (timeout && typeof abort === 'function') {
      setTimeout(() => {
        Abort(`timeout：${timeout}ms`);
      }, timeout);
    }
    // 业务API的promise
    const fetch_promise = new Promise((resolve, reject) => {
      if (!url.startsWith('http')) {
        url = `${defaultURL}${url}`;
      }
      fetch(url, rest)
        .then((response) => checkStatus(reject, response))
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log('request fail url:', url);
          console.log('request fail reason:', error);
          reject(error);
        });
    });
    // race：返回最快的结果（resolve/reject）
    const promise = Promise.race([fetch_promise, abort_promise]);
    // console.log(promise)
    // 将终止函数作为结果返回，达到可取手动取消请求的目的
    promise.cancel = Abort;
    return promise;
  }
)(fetch);

export const generateConfig = (method, params, config) => {
  const finalConfig = { ...defaultConfig };
  if (method === 'GET') {
    Object.assign(finalConfig, { method }, config);
  } else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const body = JSON.stringify(params);
    Object.assign(finalConfig, { method }, { body }, config);
  } else if (method === 'UPLOAD') {
    const formData = new FormData();
    if (!params.length) {
      return { success: false, message: '未选择文件' };
    }
    for (const i of params) {
      const path = i.path;
      const arr = path.split('/');
      const file = {
        uri: path,
        type: 'multipart/form-data',
        name: escape(arr[arr.length - 1]),
        fileType: i.mime
      };
      formData.append('file', file);
    }
    Object.assign(
      finalConfig,
      { method: 'POST' },
      { headers: { 'Content-Type': 'multipart/form-data' } },
      { body: formData },
      config
    );
  }
  return finalConfig;
};

export const $get = (url, params = {}, config = {}) => {
  url = `${url}?${qsStringify(params)}`;
  const finalConfig = generateConfig('GET', params, config);
  return _fetch(url, finalConfig);
};

export const $post = (url, params = {}, config = {}) => {
  const finalConfig = generateConfig('POST', params, config);
  return _fetch(url, finalConfig);
};
export const $put = (url, params = {}, config = {}) => {
  const finalConfig = generateConfig('PUT', params, config);
  return _fetch(url, finalConfig);
};
export const $delete = (url, params = {}, config = {}) => {
  const finalConfig = generateConfig('DELETE', params, config);
  return _fetch(url, finalConfig);
};
export const $upload = (url, fileArr = [], config = {}) => {
  const finalConfig = generateConfig('UPLOAD', fileArr, config);
  return _fetch(url, finalConfig);
};
