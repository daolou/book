"********************************************************
"                   一般性配置                          *
"********************************************************

"关闭vim一致性原则,避免以前版本的一些bug和局限
set nocompatible

"显示行号
set number

"设置在编辑过程中右下角显示光标的行列信息
set ruler

"在状态栏显示正在输入的命令
set showcmd

"设置历史记录条数
set history=1000

"设置取消备份 禁止临时文件的生成
set nobackup
set noswapfile

"设置匹配模式,类似当输入一个左括号时会匹配相应的那个右括号
set showmatch

"设置C/C++方式自动对齐
set autoindent
set cindent

"开启语法高亮功能
syntax enable
syntax on

"指定配色方案为256色
set t_Co=256

"设置搜索时忽略大小写
set ignorecase

"实时显示搜索结果
set incsearch

"配置backspace的工作方式
set backspace=indent,eol,start

"设置在vim中可以使用鼠标
set mouse=a

"设置tab宽度
set tabstop=4

"设置自动对齐空格数
set shiftwidth=4

"设置退格键时可以删除4个空格
set smarttab
set softtabstop=4

"将tab键自动转换为空格
set expandtab

"设置编码方式
set encoding=utf-8

"自动判断编码时 依次尝试以下编码
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1

"检测文件类型
filetype on

"针对不同的文件采取不同的缩进方式
filetype indent on

"启动智能补全
filetype plugin indent on

"括号自动补全
inoremap ( ()<ESC>i
inoremap [ []<ESC>i
inoremap { {}<ESC>i
inoremap < <><ESC>i

"直接使用y p进行系统级复制粘贴
set clipboard=unnamedplus
