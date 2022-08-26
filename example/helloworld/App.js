import { h } from '../../lib/mini-vue.esm.js';
window.self = null

const Foo = {
  setup (props, {emit}) {
    const emitAdd = () => {
      emit('add', {a:1})
    }
    return {
      emitAdd
    }
  },
  render () {
    return h('button', {
      onClick: this.emitAdd
    }, 'add')
  }
}
export default  {
  render () {
    window.self = this
    // return h('div', {id: 'root'}, [
    //   h('p', {class: 'red'}, 'hi'),
    //   h('p', {style: 'color:blue'}, 'mini-vue'),
    // ]);
    return h('div', {}, [
      h('p', {}, `hi, ${this.msg}`),
      h(Foo, {
        count: 2,
        onAdd(arg) {
          console.log('Add 触发了')
          console.log(arg)
        }
      }),
    ])
  },

  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}