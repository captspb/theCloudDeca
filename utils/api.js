var Promise = require('es6-promise.min').Promise

var API_URL = 'https://www.tosq20.cn'


function fetchApi(url, method, params) {
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}/${url}`,
      method: method,
      data: params,
      header: header,
      success: function (result) {
        if (result.data.code == 0) {
          resolve(result.data);
        } else {
          reject(result.data)
          if (showTip) {
            wx.showModal({
              title: '提示',
              content: result.data.msg,
              showCancel: false,
              confirmColor: '#00a0e9',
              success: function (res) {
              }
            })
          }
        }
      },
      fail: function (result) {
        reject(result);
      }
    })
  })
}

function fetchGet(url, params = {}) {
  return fetchApi(url, 'GET', params)
}

function fetchPut(url, params = {}) {
  return fetchApi(url, 'PUT', params)
}

function fetchPost(url, params = {}) {
  return fetchApi(url, 'POST', params)
}

function fetchDelete(url, params = {}) {
  return fetchApi(url, 'DELETE', params)
}

module.exports = {
  header: header,
  fetchGet: fetchGet,
  fetchPut: fetchPut,
  fetchPost: fetchPost,
  fetchDelete: fetchDelete,
  setToken: setToken,
  setUdid: setUdid,
  setChannel: setChannel
}
