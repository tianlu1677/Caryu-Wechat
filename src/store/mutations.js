import Vue from 'vue'
import { querystring } from 'vux'

/**
 * Vuex mutations
 * 供vue页面的使用的methods
 * 调用方式: $store.commit(MethodName, [arg])
 */
export default {
  GET_IDS(state) {
    let params = querystring.parse(decodeURI(location.search))
    let open_id = document.querySelector('input[name=open_id]').value

    if (open_id !== '') {//公众号下面按钮点过去的
      state.open_id = params.open_id || (open_id != '<{$open_id}>' ? open_id : 0)
    } else {//打印详情点过去的,获取URL中的shop_id、open_id、print_id
      state.shop_id = params.shop_id || 0
      state.open_id = params.open_id || 0
      state.print_id = params.print_id || 0

      const arr = ['CarLoanData', 'CarUsedData']
      arr.forEach((v, i) => {
        state[v].city = params.city || ''
        state[v].city_id = params.city_id ? params.city_id.split(',') : []

        /* 车主名字和上牌时间 这次让去掉了不保证后期会不会再加上 所以先注释 */
        // state[v].name = params.name||''
        // state[v][i==0 ? 'buy_time' : 'card_time'] = params.buy_time
      })
    }
  },
  GET_CITY_LIST(state) {
    Vue.http.post('/index.php/Xiaochengxu/Loans/getCityList')
      .then((res) => {
        res = res.data
        if (res.code == 0)
          state.city_list = res.data
        else
          console.info('VUEX__mutations(GET_CITY_LIST)请求返回错误', res)
      })
      .catch(err => console.error('VUEX__mutations(GET_CITY_LIST)执行失败', err))
  },
  GET_USER_CITY(state) {  // 用open_id换取用户关注公众号时 所关联的门店所在的城市ID
    Vue.http.post('/index.php/Xiaochengxu/CarInsurance/getUserCity', { open_id: state.open_id })
      .then(res => {
        res = res.data
        if (res.code == 0)
          state.open_city.CarInsurance = [res.data]
        else
          console.info('VUEX__mutations(GET_USER_CITY)请求返回错误', res)
      })
      .catch(err => console.error('VUEX__mutations(GET_USER_CITY)执行失败', err))
  }
}