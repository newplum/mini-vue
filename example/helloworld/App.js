import { h } from '../../lib/mini-vue.esm.js';
export default  {
  render () {
    return h('div', {id: 'root'}, [
      h('p', {class: 'red'}, 'hi'),
      h('p', {style: 'color:blue'}, 'mini-vue'),
    ]);
  },

  setup () {
    return {
      title: 'mini-vue'
    }
  }
}