<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
    </div>
    <div class="editor-content" :class="previewBotn ? 'preview-both' : ''">
      <div class="editor">
        <textarea ref="textarea" v-model="code"></textarea>
      </div>
      <div class="marked markdown-body" v-html="markedHtml"></div>
    </div>
  </div>
</template>

<script>
import _CodeMirror from 'codemirror'
import Showdown from 'showdown'
import showdownHighlight from 'showdown-highlight'
import showdownEmoji from 'showdown-emoji'
// import 'showdown-github'

// 引入codemirror 样式
import 'codemirror/lib/codemirror.css'

import 'highlight.js/styles/atom-one-dark.css'

// 引入github-markdown-css.css
import 'github-markdown-css/github-markdown.css'

// language
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/gfm/gfm.js'

// theme css
import 'codemirror/theme/base16-dark.css'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

const CodeMirror = window.CodeMirror || _CodeMirror
// 在 pre 上添加 hljs 的样式
Showdown.extension('hljs-style', function () {
  return [{
    type: 'output',
    filter: function (source) {
      return source.replace(/(<pre[^>]*>)?[\n\s]?<code([^>]*)>/gi, function (match, pre, codeClass) {
        if (pre) {
          return '<pre class="hljs"><code' + codeClass + '>'
        } else {
          return '<code' + codeClass + '>'
        }
      })
    }
  }]
})

// 设置 showdown 的 option
Showdown.setOption('emoji', true)

// 设置 # ## ### header 带有 id 参数
Showdown.setOption('customizedHeaderId', true)
// 配合上面的参数，会形成 header-xxx 的 id 头
Showdown.setOption('prefixHeaderId', 'header-')

Showdown.setOption('simpleLineBreaks', true)

// 用来处理图片的尺寸
Showdown.setOption('parseImgDimensions', true)

// 在新窗口打开链接
Showdown.setOption('openLinksInNewWindow', true)

Showdown.setOption('metadata', true)

// 自定义 github mentions
Showdown.setOption('ghMentionsLink', 'https://github.com/nutsjian/{u}')

const converter = new Showdown.Converter({
  extensions: [showdownEmoji, showdownHighlight, 'hljs-style']
})

// 设置 github 偏好
converter.setFlavor('github')

export default {
  name: 'codemirrorstatic',
  data () {
    const code = ''
    return {
      code,
      editor: null,
      previewBotn: true,
      content: '',
      markedHtml: '',
      previewMode: 1
    }
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      tabSize: 4,
      // 光标当前行会有阴影选中
      styleActiveLine: true,
      // 自动验证错误
      matchBrackets: true,
      // 是否换行
      lineWrapping: false,
      // 自动补全括号
      autoCloseBrackets: true,
      // 自动闭合标签
      autoCloseTags: true,
      // 显示行号
      lineNumbers: true,
      // 代码折叠
      foldGutter: true,
      // 选中某一段后显示光标在选中的最后位置
      showCursorWhenSelecting: true,
      // 代码编辑器的模式（javascript、sql 等）
      mode: 'gfm',
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

    this.editor.on('change', cm => {
      const content = cm.getValue()
      if (!Object.is(content, this.content)) {
        this.content = content
        // this.change.emit({
        //   editor: this.editor,
        //   content: this.content
        // })
        // this.onModelChange(this.content);
        if (this.previewMode !== 0) {
          this.parseMarked()
        }
      }
    })
  },
  methods: {
    parseMarked () {
      this.markedHtml = converter.makeHtml(this.content || '')
    }
  }
}
</script>
<style lang="scss" scoped>
.markdown-editor {
  .editor-content {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;

    &.preview-full {

      .marked {
        left: 0%;
      }
    }

    &.preview-both {
      .editor {
        width: 50%;
      }

      .marked {
        left: 50%;
        width: 50%;
      }
    }

    .editor {
      width: 100%;
      transition: left 0.1s ease;

      /deep/ .CodeMirror {
        height: auto;
        min-height: 20rem;
        max-height: 46rem;
      }
      /deep/ .CodeMirror-scroll {
        height: auto;
        min-height: 20rem;
        max-height: 46rem;
      }
      /deep/ .CodeMirror-code {
        line-height: 1.6em;
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        height: auto;
      }
    }

    .marked {
      left: 100%;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      overflow: auto;
      z-index: 99;
      color: #333;
      padding: 2em;
      background-color: #ffffff;
      transition: left 0.1s ease;

      /deep/ a {
        color: #209e91;
        font-weight: bold;
        margin: 0 .1em;

        &:hover {
          text-decoration: underline!important;
        }
      }

      /deep/ img {
        max-width: 80%;
        margin: 0 auto;
        display: block;
        text-align: center;
        border-radius: 2px;
        border: .7rem solid rgba(197, 197, 197, 0.4);
      }

      /deep/ p {
        line-height: 2.2em;
        margin-bottom: 1em;
      }

      /deep/ h1,
      /deep/ h2,
      /deep/ h3,
      /deep/ h4,
      /deep/ h5,
      /deep/ h6 {
        margin: 1.5rem 0;
        padding-left: 0;
        line-height: 1.8em;
        font-weight: 700;
        text-indent: 0;
      }

      /deep/ blockquote {
        margin: 1.2em 0;
        text-indent: 0em;
        background-color: rgba(197, 197, 197, 0.4);
        border-left: .5em solid #aaa;
        padding: .5em 1em;
        padding-left: 1.5em;

        p {
          text-indent: 0em;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      /deep/ ul {
        list-style-type: square;
      }

      /deep/ ul, /deep/ ol {

        > li {
          line-height: 1.8em;
          padding: .5em 1em;

          &:hover {
            background-color: rgba(230, 230, 230, 0.7);
          }

          > ul {

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      /deep/ pre {
        margin-bottom: 1em;
        border-radius: 0;
        font-size: 14px;
        background-color: #282c34;
      }
    }
  }
}
</style>
