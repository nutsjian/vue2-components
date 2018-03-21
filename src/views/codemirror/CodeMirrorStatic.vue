<template>
  <div class="codemirrorstatic">
    <textarea ref="textarea" v-model="code"></textarea>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import _CodeMirror from 'codemirror'

// language
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'

// theme css
import 'codemirror/theme/base16-dark.css'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

const CodeMirror = window.CodeMirror || _CodeMirror
export default {
  name: 'codemirrorstatic',
  data () {
    const code = ''
    return {
      code
    }
  },
  mounted () {
    console.log(this.$refs.textarea)
    CodeMirror.fromTextArea(this.$refs.textarea, {
      tabSize: 4,
      // 光标当前行会有阴影选中
      styleActiveLine: true,
      // 显示行号
      lineNumbers: true,
      // 代码折叠
      foldGutter: true,
      // 选中某一段后显示光标在选中的最后位置
      showCursorWhenSelecting: true,
      // 代码编辑器的模式（javascript、sql 等）
      mode: 'text/x-kotlin',
      // 主题
      theme: 'base16-dark',
      extraKeys: {
        'F11' (cm) {
          cm.setOption('fullscreen', !cm.getOption('fullscreen'))
        },
        'Esc' (cm) {
          if (cm.getOption('fullscreen')) cm.setOption('fullscreen', false)
        }
      },
      hintOptions: {
        completeSingle: false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
