// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数，更新用户剩余次数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const data = {
		// 累计生成照片 只增不减
		accumCreatePhoto: _.inc(event.inc > 0 ? 0 : -(event.inc)),
		count: _.inc(event.isVip ? 0 : (1 * event.inc))
  }
  // 签到，更新签到时间
	if (event.signIn) {
		data.signInDate = new Date(Date.now() + 1000 * 60 * 60 * 8).toDateString().trim()
	}
  // 更新当前用户次数
	const res = await db.collection('user').where({
		openid: event.openid || wxContext.OPENID
	}).update({ data })

	return {
		success: res.stats.updated > 0,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}