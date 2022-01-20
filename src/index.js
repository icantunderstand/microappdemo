import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import history from 'history/browser';
import './index.css';
import { registerApplication, start } from 'single-spa'

async function loadApp(libraryUrl, libraryName) {
  // 打包的webpack配置是umd模式 直接挂载在window上
  if(window[libraryName]) {
    return window[libraryName]
  }
  // 加载并且等待js执行
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = libraryUrl
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
  return window[libraryName]
}

// app组合可以通过走服务端下发配置模式 
const apps = [
  {
    name: 'app1',
    app: () => loadApp('http://localhost:3001/app1.js', 'app1'),
    activeWhen: location => location.pathname.startsWith('/app1'),
    customProps: {}
  },
  {
    name: 'app2',
    app: () => loadApp('http://localhost:3002/app2.js', 'app2'),
    activeWhen: location => location.pathname.startsWith('/app2'),
    customProps: {}
  }
]

for(let i = 0; i < apps.length; i++) {
  registerApplication(apps[i])
}

start()

ReactDOM.render(
  <div>
    this is base app
    <Router history={history}>
      <div><Link to="app2"  >app2</Link></div>
      <div><Link to="app1" >app1</Link></div>
  </Router>
  </div>,
  document.getElementById('root')
);
