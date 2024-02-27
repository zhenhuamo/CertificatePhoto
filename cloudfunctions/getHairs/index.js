// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const hairs = {}
  hairs.na = await getByTag('na')
  hairs.nv = await getByTag('nv')

  return {
    event,
    hairs,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

async function getByTag (tag) {
  return (await db.collection('resource-images').where({
    type: 'hairs',
    tag,
  }).get()).data
}
