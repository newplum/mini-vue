import { h, renderSlots } from '../../lib/mini-vue.esm.js';

export default {
  setup () {
    return {}
  },
  render () {
    const foo = h('p', {}, 'foo')

    return h('div', {}, [renderSlots(this.$slots, 'header', 10),foo, renderSlots(this.$slots,'footer')]);
  }
}