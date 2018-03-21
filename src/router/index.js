import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Markdown from '@/components/Markdown'

// base
import Scoped01 from '@/views/base/Scoped01'
import Scoped02 from '@/views/base/Scoped02'

import NestedScopedTest from '@/views/base/NestedScopedTest'
import NestedScopedTest2 from '@/views/base/NestedScopedTest2'

// code mirror
import CodeMirrorStatic from '@/views/codemirror/CodeMirrorStatic'
import CodeMirrorMarkdown from '@/views/codemirror/CodeMirrorMarkdown'
// components

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'HelloWorld', component: HelloWorld },
    { path: '/markdown', name: 'markdown', component: Markdown },
    { path: '/base/scoped01', name: 'scoped01', component: Scoped01 },
    { path: '/base/scoped02', name: 'scoped02', component: Scoped02 },
    { path: '/base/nestedscopedtest', name: 'nestedscopedtest', component: NestedScopedTest },
    { path: '/base/nestedscopedtest2', name: 'nestedscopedtest2', component: NestedScopedTest2 },
    // code mirror
    { path: '/codemirror/static', name: 'codemirrorstatic', component: CodeMirrorStatic },
    { path: '/codemirror/markdown', name: 'codemirrormarkdown', component: CodeMirrorMarkdown }
  ]
})
