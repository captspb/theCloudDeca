var NewApiRootUrl = 'https://www.tosq20.cn'
var merchant_id = 15
var count = 3

module.exports = {

  baseUrl: NewApiRootUrl,//域名
  merchantInfo: `${NewApiRootUrl}/api/api/Store/list?merchant_id=${merchant_id}`, //案例数据
  promotion: `${NewApiRootUrl}/api/api/campaigntype/list?merchant_id=${merchant_id}`, //案例数据

  caseList: `${NewApiRootUrl}/api/api/case/list?merchant_id=${merchant_id}`, //案例数据
  caseListN: `${NewApiRootUrl}/api/api/case/list?merchant_id=${merchant_id}&size=${count}`, //n条案例数据
  CatalogList: `${NewApiRootUrl}/api/api/catego/list?merchant_id=${merchant_id}`,   //分类目录全部分类数据

  caseDetail: `${NewApiRootUrl}/api/api/case/list?merchant_id=${merchant_id}&id=`, //案例详情数据接口
  caseDetailArea: `${NewApiRootUrl}/api/api/casedetail/list?merchant_id=${merchant_id}&case_id=`, //案例详情数据区域

  proList: `${NewApiRootUrl}/api/api/Prod/list?merchant_id=${merchant_id}`, //产品列表
  proDetail: `${NewApiRootUrl}/api/api/Prod/list?merchant_id=${merchant_id}&id=`, //产品列表
  Evaluate: `${NewApiRootUrl}/api/api/Evaluate/save`, //评论
  EvaluateList: `${NewApiRootUrl}/api/api/Evaluate/list?merchant_id=${merchant_id}`, //评论列表
  EvaluateN: `${NewApiRootUrl}/api/api/Evaluate/list?merchant_id=${merchant_id}&offset=0&size=${count}`, //n条评论列表

  EvaluateMe: `${NewApiRootUrl}/api/api/Evaluate/list?merchant_id=${merchant_id}&offset=0&size=1&client_id=`, //用户自己的评价
  merchant_id:merchant_id,
  auth: `${NewApiRootUrl}/api/api/auth/login_by_weixin`, //授权
  pay: `${NewApiRootUrl}/api/api/pay/index`, //支付
  promotions: `${NewApiRootUrl}/api/api/campaigntype/list?merchant_id=${merchant_id}`, //获取活动
  promotion: `${NewApiRootUrl}/api/api/campaigntype/list?merchant_id=${merchant_id}&id=`, //获取某个活动


  


 

  
};