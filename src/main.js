// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局样式
import '@/assets/scss/framework.scss'
import '@/assets/scss/variables.scss'
import '@/assets/scss/icon.scss'

Vue.config.productionTip = false
// Vue.directive('banzi', {
//   twoWay: true,
//   bind: function () {
//     this.codemirror = CodeMirror(this.el, {
//       mode: 'javascript',
//       lineNumbsers: true
//     })
//     this.codemirror.on('change', function () {
//       this.set(this.codemirror.getValue())
//     }.bind(this))
//   },
//   update: function (value, oldValue) {
//     this.codemirror.setValue(value || '')
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
