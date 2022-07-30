import { h } from '../../lib/mini-vue.esm.js';
window.self = null
export default  {
  render () {
    window.self = this
    // return h('div', {id: 'root'}, [
    //   h('p', {class: 'red'}, 'hi'),
    //   h('p', {style: 'color:blue'}, 'mini-vue'),
    // ]);
    return h('div', null, `hi, ${this.msg}`)
  },

  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}