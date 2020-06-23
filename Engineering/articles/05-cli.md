# 如何开发一个脚手架

## 原理

- **命令行参数**：[process.argv](https://devdocs.io/node/process#process_process_argv)
- **脚本解释程序**：#!/usr/bin/env
  - 放在脚本语言的第一行，目的是指出，你想要你的这个文件中的代码用什么可执行程序去运行它
  - 脚本用 env 启动的原因，是因为脚本解释器在 linux 中可能被安装于不同的目录，env 可以在系统的 PATH 目录中查找
- **可执行文件的软链**：package.json: bin 字段

### demo

```bash
.
├── bin
│   └── index.js
├── index.js
└── package.json
```

bin/index.js

```javascript
const pkg = require('../package.json');

function run(argv) {
  console.log(argv);
  argv = argv.slice(2);
  if (!argv.length) {
    // 对于退出操作，用 process.exit(code) 代替 return，成功的话 code 为 0，失败为 1
    process.exit(1);
  }
  if (argv[0] === '-v' || argv[0] === '--version') {
    console.log(`  version is ${pkg.version}`);
  } else if (argv[0] === '-h' || argv[0] === '--help') {
    console.log('  usage:\n');
    console.log('  -v --version [show version]');
  }
}

run(process.argv);
```

运行

```bash
$ node bin/index.js -v
$ [ '/Users/jiangzhiguo/.nvm/versions/node/v10.15.3/bin/node',
  '/Users/jiangzhiguo/Workspace/jsany/cli-theory/bin/index.js',
  '-v' ]
  version is 1.0.0
```

通过脚本解释程序以及 package.json 的 bin 字段对上面进行简化

bin/index.js

```diff
+ #!/usr/bin/env node
const pkg = require('../package.json')
```

package.json

```json
{
  "name": "cli-theory",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "bin": {
    "cli-theory": "bin/index.js"
  },
  "author": "",
  "license": "ISC"
}
```

### 测试

用过 link 符号链接，模拟发包后进行安装使用这个命令

在这个包的根目录执行：

`yarn link`

查看验证 cli-theory 软链：

```bash
$ cat /usr/local/bin/cli-theory
$ #!/usr/bin/env node

const pkg = require('../package.json')

function run(argv) {
  console.log(argv);
  argv = argv.slice(2)
  if(!argv.length){
    // 对于退出操作，用 process.exit(code) 代替 return，成功的话 code 为 0，失败为 1
    process.exit(1)
  }
  if (argv[0] === '-v' || argv[0] === '--version') {
    console.log(`  version is ${pkg.version}`);
  } else if (argv[0] === '-h' || argv[0] === '--help') {
    console.log('  usage:\n');
    console.log('  -v --version [show version]');
  }
}

run(process.argv)%
```

执行脚手架命令：

```bash
$ cli-theory -v
$ [ '/Users/jiangzhiguo/.nvm/versions/node/v10.15.3/bin/node',
  '/usr/local/bin/cli-theory',
  '-v' ]
  version is 1.0.0
```

可以看到 cli-theory === node bin/index.js，简化了命令

源码：<https://github.com/jsany/cli-theory>

## 完整的脚手架

npm 社区有一些简化的方案/库：

- 命令行参数解决方案： commander、yargs、minimist、optimist、meow、cac
- 命令行交互解决方案：inquirer、prompts、enquirer

其他可能用到的库：

- ora：命令行的 loading 效果
- progress：显示进度条
- chalk：命令行字符串样式美化
- log-symbols：命令行显示 √ 或 × 等图标
- metalsmith：静态网站生成器，批量处理模版
- consolidate：支持各种模版引擎，将用户提交的动态信息填充到模版文件中
- download-git-repo：下载并提取 git 仓库，用于下载模版
- open：打开诸如 URL，文件，可执行文件之类的东西
- clipboardy：访问系统剪贴板（复制/粘贴）
- update-notifier：更新通知
- envinfo：查看当前的环境信息，System、Browsers、Binaries、Managers。。。

<https://www.npmtrends.com/>

源码：<https://github.com/jsany/cli-kit>
