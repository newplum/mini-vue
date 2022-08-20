import { h } from '../../lib/mini-vue.esm.js';
window.self = null

const Foo = {
  setup (props) {
    console.log(props)
  },
  render () {
    return h('div', {}, 'foo: ' + this.count)
  }
}
export default  {
  render () {
    window.self = this
    // return h('div', {id: 'root'}, [
    //   h('p', {class: 'red'}, 'hi'),
    //   h('p', {style: 'color:blue'}, 'mini-vue'),
    // ]);
    return h('div', {
      onClick: function mouseover () {
        console.log('Click');
      }
    }, [
      h('p', {}, `hi, ${this.msg}`),
      h(Foo, {count: 2}),
    ])
  },

  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}