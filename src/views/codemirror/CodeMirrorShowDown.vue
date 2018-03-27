<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
      <span class="editor-toolbar__formats">
        <button type="button" @click="drawH1()"><span class="iconfont icon-h1"></span></button>
        <button type="button" @click="drawH2()"><span class="iconfont icon-h2"></span></button>
        <button type="button" @click="drawH3()"><span class="iconfont icon-h3"></span></button>
        <button type="button" @click="drawH4()"><span class="iconfont icon-h4"></span></button>
        <button type="button" @click="drawH5()"><span class="iconfont icon-h5"></span></button>
        <button type="button"><span class="iconfont icon-clear"></span></button>
        <button type="button" @click="toggleBold()"><span class="iconfont icon-bold"></span></button>
        <button type="button" @click="toggleItalic()"><span class="iconfont icon-italic"></span></button>
        <button type="button" @click="drawLink()"><span class="iconfont icon-link"></span></button>
        <button type="button"><span class="iconfont icon-unlink"></span></button>
        <button type="button" @click="toggleDeleteLine()"><span class="iconfont icon-delline"></span></button>
        <button type="button"><span class="iconfont icon-underline"></span></button>
        <button type="button" @click="drawCode()"><span class="iconfont icon-code"></span></button>
        <button type="button" @click="drawQuote()"><span class="iconfont icon-blockquote"></span></button>
        <button type="button"><span class="iconfont icon-video"></span></button>
        <button type="button" @click="drawImage()"><span class="iconfont icon-image"></span></button>
        <button type="button"><span class="iconfont icon-brush"></span></button>
        <button type="button" @click="drawHr()"><span class="iconfont icon-hr"></span></button>
        <button type="button" @click="redo()"><span class="iconfont icon-redo"></span></button>
        <button type="button" @click="undo()"><span class="iconfont icon-undo"></span></button>
      </span>
      <span class="editor-toolbar__formats">
        <button type="button" @click="wordCount()"><span class="iconfont icon-mode-edit"></span></button>
        <button type="button" @click="goEdit()" :class="[previewMode === 3 ? 'muted' : '']"><span class="iconfont icon-mode-edit"></span></button>
        <button type="button" @click="goLive()" :class="[previewMode === 1 ? 'muted' : '']"><span class="iconfont icon-mode-live"></span></button>
        <button type="button" @click="goPreview()" :class="[previewMode === 2 ? 'muted' : '']"><span class="iconfont icon-mode-preview"></span></button>
      </span>
    </div>
    <div class="editor-content" :class="{'preview-full': previewMode === 2, 'preview-both': previewMode === 1}">
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
      cm: null,
      previewBotn: true,
      content: '',
      markedHtml: '',
      // 1 实况模式 2 预览模式 3 编辑模式
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
      lineWrapping: true,
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

    this.cm = this.editor.codemirror

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
    },
    drawH1 () {
      this._drawHH('#')
    },
    drawH2 () {
      this._drawHH('##')
    },
    drawH3 () {
      this._drawHH('###')
    },
    drawH4 () {
      this._drawHH('####')
    },
    drawH5 () {
      this._drawHH('#####')
    },
    _drawHH (flags) {
      var startPoint = this.editor.getCursor('start')
      var text = this.editor.getLine(startPoint.line)
      if (text.startsWith(flags)) {
        text = text.substr((flags + ' ').length)
      } else {
        text = flags + ' ' + text
      }
      this.editor.replaceRange(text, {line: startPoint.line, ch: 0}, {line: startPoint.line + 1, ch: 0})
      this.editor.focus()
    },
    drawCode () {
      var pos = this.editor.getCursor()
      var stat = this.getState(pos)
      this._replaceSelection(this.editor, stat.code, '```java\n', '\n```')
    },
    drawQuote () {
      var pos = this.editor.getCursor()
      var stat = this.getState(pos)
      this._replaceSelection(this.editor, stat.quote, '> ', '\n')
    },
    drawImage () {
      var pos = this.editor.getCursor()
      var stat = this.getState(pos)
      this._replaceSelection(this.editor, stat.image, '![](', ')')
    },
    drawLink () {
      var pos = this.editor.getCursor()
      var stat = this.getState(pos)
      this._replaceSelection(this.editor, stat.link, '[', '](https://)')
    },
    toggleBold () {
      var stat = this.getState()
      var text = '加粗文字'
      var start = '**'
      var end = '**'
      var startPoint, endPoint, curPoint
      if (this.editor.getSelection()) {
        startPoint = this.editor.getCursor('from')
        endPoint = this.editor.getCursor('to')
      } else {
        // 没有选中
        curPoint = this.editor.getCursor()
      }
      if (stat.bold) {
        if (curPoint || this.editor.getRange({line: startPoint.line, ch: startPoint.ch - 2}, startPoint) !== '**' || this.editor.getRange(endPoint, {line: endPoint.line, ch: endPoint.ch + 2}) !== '**') {
          // 没有选中，或选中的不全
          return
        } else {
          text = this.editor.getSelection()
          startPoint.ch -= 2
          endPoint.ch += 2
          this.editor.replaceRange(text, startPoint, endPoint)
          endPoint.ch -= 4
        }
      } else {
        var _text = this.editor.getSelection() || text
        this.editor.replaceSelection(start + _text + end)
        if (curPoint) {
          startPoint = { line: curPoint.line, ch: curPoint.ch + 2 }
          endPoint = { line: curPoint.line, ch: curPoint.ch + 6 }
        } else {
          startPoint.ch += 2
          endPoint.ch += 2
        }
      }

      this.editor.setSelection(startPoint, endPoint)
      this.editor.focus()
    },
    toggleItalic () {
      var stat = this.getState()
      var text = '斜体文字'
      var start = '*'
      var end = '*'
      var startPoint
      var endPoint
      var curPoint
      if (this.editor.getSelection()) {
        // 有选中
        startPoint = this.editor.getCursor('from')
        endPoint = this.editor.getCursor('to')
      } else {
        // 没有选中
        curPoint = this.editor.getCursor()
      }
      if (stat.italic) {
        if (curPoint || this.editor.getRange({line: startPoint.line, ch: startPoint.ch - 1}, startPoint) !== '*' || this.editor.getRange(endPoint, {line: endPoint.line, ch: endPoint.ch + 1}) !== '*') {
          // 没有选中或选中的不全
          return
        } else {
          text = this.editor.getSelection()
          startPoint.ch -= 1
          endPoint.ch += 1
          this.editor.replaceRange(text, startPoint, endPoint)
          endPoint.ch -= 2
        }
      } else {
        var _text = this.editor.getSelection() || text
        this.editor.replaceSelection(start + _text + end)
        if (curPoint) {
          startPoint = {line: curPoint.line, ch: curPoint.ch + 1}
          endPoint = {line: curPoint.line, ch: curPoint.ch + 5}
        } else {
          startPoint.ch += 1
          endPoint.ch += 1
        }
      }
      this.editor.setSelection(startPoint, endPoint)
      this.editor.focus()
    },
    toggleDeleteLine () {
      var stat = this.getState()
      console.log(stat)
      // var text = '删除文字'
      // var start = '~~'
      // var end = '~~'
      // var startPoint
      // var endPoint
      // var curPoint
      // if (this.editor.getSelection()) {
      //   // 有选中
      //   startPoint = this.editor.getCursor('from')
      //   endPoint = this.editor.getCursor('to')
      // } else {
      //   // 没有选中
      //   curPoint = this.editor.getCursor()
      // }
      // if (stat.italic) {
      //   if (curPoint || this.editor.getRange({line: startPoint.line, ch: startPoint.ch - 1}, startPoint) !== '*' || this.editor.getRange(endPoint, {line: endPoint.line, ch: endPoint.ch + 1}) !== '*') {
      //     // 没有选中或选中的不全
      //     return
      //   } else {
      //     text = this.editor.getSelection()
      //     startPoint.ch -= 1
      //     endPoint.ch += 1
      //     this.editor.replaceRange(text, startPoint, endPoint)
      //     endPoint.ch -= 2
      //   }
      // } else {
      //   var _text = this.editor.getSelection() || text
      //   this.editor.replaceSelection(start + _text + end)
      //   if (curPoint) {
      //     startPoint = {line: curPoint.line, ch: curPoint.ch + 1}
      //     endPoint = {line: curPoint.line, ch: curPoint.ch + 5}
      //   } else {
      //     startPoint.ch += 1
      //     endPoint.ch += 1
      //   }
      // }
      // this.editor.setSelection(startPoint, endPoint)
      // this.editor.focus()
    },
    _toggleLine () {
      var stat = this.getState()
      var startPoint = this.editor.getCursor('start')
      var endPoint = this.editor.getCursor('end')
      var that = this
      var repl = {
        quote: /^(\s*)>\s+/,
        code: /^(\s*)```\n\s+/,
        header: /^(\s*)##/,
        'unordered-list': /^(\s*)(\*|-|\+)\s+/,
        'ordered-list': /^(\s*)\d+\.\s+/
      }
      var map = {
        quote: '> ',
        code: '```\n\n```',
        header: '##标题##',
        'unordered-list': '* ',
        'ordered-list': '1. '
      }
      for (var i = startPoint.line; i <= endPoint.line; i++) {
        (function (i) {
          var text = that.editor.getLine(i)
          if (stat[name]) {
            text = text.replace(repl[name], '$1')
          } else {
            text = map[name] + text
          }
          that.editor.replaceRange(text, {line: i, ch: 0}, {line: i + 1, ch: 0})
        })(i)
      }
      this.editor.focus()
    },
    _replaceSelection (cm, active, start, end) {
      var text
      var startPoint = cm.getCursor('start')
      var endPoint = cm.getCursor('end')
      if (active) {
        text = cm.getLine(startPoint.line)
        start = text.slice(0, startPoint.ch)
        end = text.slice(startPoint.ch)
        cm.setLine(startPoint.line, start + end)
      } else {
        text = cm.getSelection()
        cm.replaceSelection(start + text + end)
        startPoint.ch += start.length
        endPoint.ch += start.length
      }
      cm.setSelection(startPoint, endPoint)
      cm.focus()
    },
    drawHr () {
      var cursor = this.editor.getCursor()
      this.editor.replaceRange('\n\n----------\n\n', cursor)
      this.editor.setCursor({line: cursor.line + 4, ch: 0})
      this.editor.focus()
    },
    undo () {
      this.editor.undo()
      this.editor.focus()
    },
    redo () {
      this.editor.redo()
      this.editor.focus()
    },
    goLive () {
      var wrapper = this.editor.getWrapperElement()
      var preview = wrapper.lastChild
      console.log(preview)
      this.previewMode = 1
    },
    goEdit () {
      this.previewMode = 3
    },
    goPreview () {
      this.previewMode = 2
    },
    getState (pos) {
      pos = pos || this.editor.getCursor('start')
      var stat = this.editor.getTokenAt(pos)
      console.log(stat)
      if (!stat.type || stat.type.split) {
        return {}
      } else {
        var types = stat.type.split(' ')
        var ret = {}
        var data
        var text
        for (var i = 0; i < types.length; i++) {
          if (data === 'strong') {
            ret.bold = true
          } else if (data === 'variable-2') {
            text = this.cm.getLine(pos.line)
            if (/^\s*\d+\.\s/.test(text)) {
              ret['ordered-list'] = true
            } else {
              ret['unordered-list'] = true
            }
          } else if (data === 'quote') {
            ret.quote = true
          } else {
            ret.italic = true
          }
        }
        return ret
      }
    },
    wordCount () {
      var data = this.editor.getValue()
      var pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g
      var m = data.match(pattern)
      var count = 0
      if (m === null) {
        return count
      }
      for (var i = 0; i < m.length; i++) {
        if (m[i].charCodeAt(0) >= 0x4E00) {
          count += m[i].length
        } else {
          count += 1
        }
      }
      console.log(count)
      return count
    }
  }
}
</script>
<style lang="scss" scoped>
.ve-snow, .ve-stroke {
  fill: none;
  stroke: #444;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
.markdown-editor {
  width: 1024px;

  .editor-toolbar {
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
    padding: 8px;

    .editor-toolbar__formats {
      margin-right: 15px;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;

      & button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 26px;
        padding: 3px 5px;
        width: 30px;
        box-sizing: border-box;
        outline: none;

        svg {
          float: left;
          width: 100%;
        }

        & span {
          font-size: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          color: #333;
          color: #5a5858;

          &:hover {
            color: #06c;
          }
        }

        & span.icon-link,
        & span.icon-unlink
         {
          font-size: 22px;
          font-weight: bold;
        }

        & span.icon-delline,
        & span.icon-underline {
          font-size: 22px;
        }

      }

      & button.muted {
        cursor: default;

        & span {
          color: #c7c7c7;
          &:hover {
            color: #c7c7c7;
          }
        }
      }
    }
  }

  .editor-content {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;

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
      background-color: #f6f6f6;
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
