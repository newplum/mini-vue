import { h } from '../../lib/mini-vue.esm.js';
import Foo from './Foo.js'

export default  {
  render () {
    const app = h('div', {}, 'app')
    const foo = h(Foo, {}, {
      header: (arg) =>  h('p', {}, 'header' + arg),
      footer: (arg) =>  h('p', {}, 'footer'),
    })
    return h('div', {}, [app, foo])
  },

  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}