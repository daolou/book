# Time analytic
zmodload zsh/zprof

# 环境变量
export GOPATH=$HOME/.go
export GOROOT=/usr/local/opt/go/libexec
export PATH=$HOME/bin:/usr/local/bin:$GOPATH/bin:$GOROOT/bin:$PATH
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
export PATH="/usr/local/opt/gettext/bin:$PATH"

# 如果你不是通过Android Studio安装的sdk，则其路径可能不同，请自行确定清楚。
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# set 256color
export TERM=xterm-256color

# 插件
# plugins=(
# git
# vscode
# tmux
# sublime
# )

# nvm config
export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion" ] && . "/usr/local/opt/nvm/etc/bash_completion"  # This loads nvm bash_completion

# 显示git信息
git-branch-name() {
  git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3
}
git-branch-prompt() {
  local branch=`git-branch-name`
  if [ $branch ]; then printf " [%s]" $branch; fi
}

# tmux
tmux bind r source ~/.tmux.conf

#{{{ 命令提示符、标题栏、任务栏样式、颜色
precmd() {
    # %{%F{cyan}%}
    # %n -- username
    # %{%F{green}%}
    # %M -- hostname
    # :
    # %{%F{red}%}
    # %(?..[%?]:) -- error code
    # %{%F{white}%}
    # %~ -- dir
    # $'\n' -- new line
    # %% -- %
    PROMPT="%{%F{red}%}%(?..[%?]:)%{%F{cyan}%}%~%{%F{green}%}$(git-branch-prompt)"$'\n'%{%F{white}%}"%% "
    # PROMPT="%{%F{cyan}%}%n@%{%F{green}%}%M:%{%F{red}%}%(?..[%?]:)%{%F{white}%}%~%{%F{green}%}$(git-branch-prompt)"$'\n'%{%F{white}%}"%% "

    # 清空上次显示的命令
    # %30<..<内容%<< 从左截断
    # %~ 当前目录路径
    [[ $TERM == screen* ]] && print -Pn "\ek%30<..<%~%<<\e\\"
}

case $TERM {
    (screen*)
    preexec() {
        # \ek 起始
        # %30>..内容%<<  如果超过 30 个字符就从右截断
        # ${1/[\\\%]*/@@@} 截断 \ 和 % 之后的内容，避免出乱码输出
        # \e\\ 终止
        print -Pn "\ek%30>..>${1/[\\\%]*/@@@}%<<\e\\"
    }
    ;;

    (xterm*)
    preexec() {
        # \e]0;内容\a
        print -Pn "\e]0;%~$ ${1/[\\\%]*/@@@}\a"
    }
    ;;
}

# eval `dircolors ~/.dir_colors`
source ~/.file_colors
#}}}

#{{{ 关于历史纪录的配置
# 历史纪录条目数量
export HISTSIZE=10000
# 注销后保存的历史纪录条目数量
export SAVEHIST=10000
# 历史纪录文件
export HISTFILE=~/.zhistory
# 修改 esc 超时时间为 0.01s
export KEYTIMEOUT=1
# 多个 zsh 间分享历史纪录
setopt SHARE_HISTORY
# 如果连续输入的命令相同，历史纪录中只保留一个
setopt HIST_IGNORE_DUPS
# 为历史纪录中的命令添加时间戳
#setopt EXTENDED_HISTORY
# 启用 cd 命令的历史纪录，cd -[TAB]进入历史路径
setopt AUTO_PUSHD
# 相同的历史路径只保留一个
setopt PUSHD_IGNORE_DUPS
# 在命令前添加空格，不将此命令添加到纪录文件中
setopt HIST_IGNORE_SPACE
# 加强版通配符
setopt EXTENDED_GLOB
# 在后台运行命令时不调整优先级
setopt NO_BG_NICE
# 禁用终端响铃
unsetopt BEEP
#}}}

#{{{ 按键绑定
bindkey -v
bindkey "^a"      beginning-of-line
bindkey "^e"      end-of-line
bindkey "^r"      history-incremental-search-backward
bindkey "^s"      history-incremental-search-forward
# 避免从普通模式转换成插入模式后退格键无法删除内容
bindkey "^?"      backward-delete-char

# 影响功能键的使用
bindkey "\e[1~"   beginning-of-line
bindkey "\e[2~"   insert-last-word
bindkey "\e[3~"   delete-char
bindkey "\e[4~"   end-of-line
bindkey "\e[5~"   backward-word
bindkey "\e[6~"   forward-word
bindkey "\e[7~"   beginning-of-line
bindkey "\e[8~"   end-of-line
bindkey "\e[A"    up-line-or-search
bindkey "\e[B"    down-line-or-search
bindkey "\e[C"    forward-char
bindkey "\e[D"    backward-char
bindkey "\eOH"    beginning-of-line
bindkey "\eOF"    end-of-line
bindkey "\e[H"    beginning-of-line
bindkey "\e[F"    end-of-line

bindkey "^p"      up-line-or-search
bindkey "^n"      down-line-or-search
bindkey '^t'      quoted-insert
bindkey '^w'      forward-word
bindkey '^u'      backward-word
bindkey '^f'      kill-word
bindkey '^k'      backward-kill-word
bindkey '^g'      kill-line
bindkey '^b'      backward-kill-line

# 用 vim 编辑命令行
autoload -U       edit-command-line
zle -N            edit-command-line
bindkey '^o'      edit-command-line

# 在命令前插入 sudo
sudo-command-line() {
    [[ -z $BUFFER ]] && zle up-history
    [[ $BUFFER != sudo\ * ]] && BUFFER="sudo $BUFFER"
    # 光标移动到行末
    zle end-of-line
}

zle -N sudo-command-line
bindkey '^y' sudo-command-line

# ctrl + a 行首
# ctrl + b 删除左边所有内容
# ctrl + c 发送 SIGINT 信号
# ctrl + d 结束输入
# ctrl + e 行尾
# ctrl + f 删除右边一个词
# ctrl + g 删除右边所有内容
# ctrl + h 退格
# ctrl + i tab
# ctrl + j 回车（不能修改，不然影响 shift + 回车）
# ctrl + k 删除左边一个词
# ctrl + l 清屏
# ctrl + m 回车
# ctrl + n 下一个历史命令
# ctrl + o 用 vim 编辑命令行
# ctrl + p 上一个历史命令
# ctrl + q 清空当前行并暂存，自动填到下一行
# ctrl + r 向后搜索历史命令
# ctrl + s 向前搜索历史命令
# ctrl + t 输入转义字符（代替 ctrl + v）
# ctrl + u 向左移动一个词
# ctrl + v 输入转义字符
# ctrl + w 向右移动一个词
# ctrl + x 很多功能
# ctrl + y 命令前添加 sudo
# ctrl + z 休眠当前进程
#}}}

#{{{ 自动补全
# 扩展路径
# /v/c/p/p => /var/cache/pacman/pkg
setopt complete_in_word

#以下字符视为单词的一部分
WORDCHARS='*?_-[]~=&;!#$%^(){}<>'

setopt AUTO_LIST
setopt AUTO_MENU
# 开启此选项，补全时会直接选中菜单项
# setopt MENU_COMPLETE
#
fpath+=(~/.bin/comp)
autoload -U compinit
compinit

_force_rehash() {
    ((CURRENT == 1)) && rehash
    return 1    # Because we didn't really complete anything
}
zstyle ':completion:::::' completer _force_rehash _complete _approximate

# 自动补全选项
zstyle ':completion:*' verbose yes
zstyle ':completion:*' menu select
zstyle ':completion:*:*:default' force-list always
zstyle ':completion:*' select-prompt '%SSelect:  lines: %L  matches: %M  [%p]'
zstyle ':completion:*:match:*' original only
zstyle ':completion::prefix-1:*' completer _complete
zstyle ':completion:predict:*' completer _complete
zstyle ':completion:incremental:*' completer _complete _correct
zstyle ':completion:*' completer _complete _prefix _correct _prefix _match _approximate

# 路径补全
zstyle ':completion:*' expand 'yes'
zstyle ':completion:*' squeeze-slashes 'yes'
zstyle ':completion::complete:*' '\\'

# 彩色补全菜单
export ZLSCOLORS=$LS_COLORS
zmodload zsh/complist
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}

# 修正大小写
zstyle ':completion:*' matcher-list '' 'm:{a-zA-Z}={A-Za-z}'

# 错误校正
zstyle ':completion:*' completer _complete _match _approximate
zstyle ':completion:*:match:*' original only
zstyle ':completion:*:approximate:*' max-errors 1 numeric

# 补全类型提示分组
zstyle ':completion:*:matches' group 'yes'
zstyle ':completion:*' group-name ''
zstyle ':completion:*:options' description 'yes'
zstyle ':completion:*:options' auto-description '%d'
zstyle ':completion:*:descriptions' format $'\e[01;33m -- %d --\e[0m'
zstyle ':completion:*:messages' format $'\e[01;35m -- %d --\e[0m'
zstyle ':completion:*:warnings' format $'\e[01;31m -- No Matches Found --\e[0m'
zstyle ':completion:*:corrections' format $'\e[01;32m -- %d (errors: %e) --\e[0m'

# kill 补全
zstyle ':completion:*:*:kill:*:processes' list-colors '=(#b) #([0-9]#)*=0=01;31'
zstyle ':completion:*:*:kill:*' menu yes select
zstyle ':completion:*:*:*:*:processes' force-list always
zstyle ':completion:*:processes' command 'ps -au$USER'

# cd ~ 补全顺序
zstyle ':completion:*:-tilde-:*' group-order 'named-directories' 'path-directories' 'users' 'expand'

# 空行(光标在行首)补全 "cd "
user-complete() {
    case $BUFFER {
        "" )
            # 空行填入 "cd "
            BUFFER="cd "
            zle end-of-line
            zle expand-or-complete
            ;;

        " " )
            BUFFER="!?"
            zle end-of-line
            zle expand-or-complete
            ;;

        * )
            zle expand-or-complete
            ;;
    }
}

zle -N user-complete
bindkey "\t" user-complete
##}}}

#{{{ 杂项
# 进入相应的路径时只要 cd ~xxx
hash -d mine='/mnt/c/mine'

# 加载函数
autoload -U zmv

# 按照对应命令补全
compdef cwi=time
compdef vwi=time
compdef fwi=time
compdef lwi=time
compdef st=sudo
compdef whoneeds=pactree

zstyle ':completion:*:ping:*' hosts www.baidu.com www.google.com
zstyle ':completion:*:my-accounts' users-hosts goreliu@192.168.1.{2,3,6,7,9}
#}}}

#{{{ 和 zsh 无关的配置
export LANG=en_US.UTF-8
export PYTHONDONTWRITEBYTECODE=1
export M=192.168.1
RPI=(192.168.1.6 192.168.1.7)
(($+USER)) || export USER=goreliu
(($+SHELL)) || export SHELL=/bin/zsh
umask 022

(($+TMUX == 0 && $+USE_TMUX)) && {
    (($+ATTACH_ONLY)) && {
        tmux a 2>/dev/null || {
            cd && exec tmux
        }
        exit
    }

    tmux new-window -c $PWD 2>/dev/null && exec tmux a
    exec tmux
}

alias h='history'
alias j='ls -F --color 2>/dev/null || ls -FG'
alias lsd='ls --color -d *(-/DN) 2>/dev/null || ls -dG *(-/DN)'
alias ll='ls --color -Fl --time-style=long-iso 2>/dev/null || ls -FGlT'
alias la='ls --color -FA 2>/dev/null || ls -FAG'
alias lla='ls -F --color --time-style=long-iso -lA 2>/dev/null || ls -lAFGT'
alias l='ls --color --time-style=long-iso -lFh 2>/dev/null || ls -lFhGT'
alias lsc='t=(*); echo $#t; unset t'
alias lscc='t=(* .*); echo $#t; unset t'
alias tl = 'tmux ls'
alias ta = 'tmux a -t'
alias ts = 'tmux new -s'
alias g='grep'
alias gv='grep -v'
alias rd='rmdir'
alias md='mkdir -p'
alias v='vim -p'
alias sv='sudo vim -p'
alias py='python3'
alias py2='python2'
alias info='info --vi-keys'
alias s='sudo'
alias hd='hexdump -C'
alias le='less -iRf'
alias dh='df -hT'
alias hi='ifconfig 2>/dev/null | grep broadcast | cut -d" " -f10'
alias upf='droopy 8888'
alias dof="echo $(hi | tail -n 1):8888; darkhttpd \$PWD --port 8888"
alias ucat='iconv -f gb18030 -t utf-8 -c'
alias gcat='iconv -f utf-8 -t gb18030 -c'
alias u16cat='iconv -f utf-16 -t utf-8 -c'
alias dub='du -sbh'
alias dud='du --max-depth 1 -bh'
alias psa='ps aux'
alias psg='psa | grep -v grep | grep'
alias pk='pkill'
alias pk9='pkill -9'
alias ka='killall'
alias ka9='killall -9'
alias pst='pstree'
alias mt="top -u $USER"
alias ctime='time cat'
alias wi='which'
alias redir='rmdir **/*(/^F)'
alias cpui='grep MHz /proc/cpuinfo'
alias fng='find | grep -P'
alias e='print'
alias p='print'
alias pl='print -l'
alias pn='print -n'
alias pc='print -P'
alias f='file'
alias i='git'
alias ic='ifconfig'
alias m='man'
alias q='exit'
alias vd='vimdiff'
alias wl='wc -l'
alias frm='free -m'
alias d='tree'
alias gmc='gm convert'
alias gmcq='gm convert -quality'
alias jl='ll /dev | grep -E "(sd|mmcblk)"'
alias pb='dlsource search'
alias pbg='dlsource download'
alias pbu='dlsource update'
alias ,='fzf --reverse'
alias ua='uname -a'
alias utf8_add_bom='sed -i "1s/^/\xEF\xBB\xBF/g"'
alias lc='lolcat'
alias sm='sudo mount'
alias um='sudo umount'
alias vrc='vim ~/.zshrc; zc; exec zsh'
alias u='cd -'
alias w='w -i'
alias dmg='dmesg'
alias da='date +"%Y-%m-%d %H:%M:%S (%u)"'
alias wd='w3m -dump'
alias di='colordiff'
alias we='wget'
alias cu='curl -L'
alias tn='telnet'
alias ca='noglob calc'
alias mmv='noglob zmv -W'
alias rpd='rm -rv $PWD && cd ..'
alias rpdf='rm -rvf $PWD && cd ..'
alias keepdir='touch .keep; chmod 400 .keep'
alias icmu="git commit -am \"Files: \$(git st -s | tr '\n' ' ')\""
alias iu='git push'
alias icmuu='icmu && iu'
alias ipu='git pull'
alias ist='git status'
alias idi='git diff'
alias idig='git diff | ucat | le'
alias uf='unfunction'
alias ti='time'
alias uu='exec zsh'
alias at='zmodload zsh/sched; sched'
alias aria='aria2c -c -s10 -k1M -x16 --enable-rpc=false'
alias dos2unix='sed -i "s/\r$//g"'
alias unix2dos='sed -i "s/$/\r/g"'
alias sshs='sudo /bin/sshd'
alias sshk='sudo killall sshd'
alias sort='LANG=C sort'
alias ma='make'
alias ffmpeg='ffmpeg -hide_banner'
alias ffprobe='ffprobe -hide_banner'
alias wgetall='wget -r -nd -np -c'
alias wgetsite='wget -r -p -np -k -c'
alias dlrpi='wgetsite 192.168.1.7:8888; mv 192.168.1.7:8888/* .; rm index.html; rd 192.168.1.7:8888'
alias mksrcinfo='makepkg --printsrcinfo > .SRCINFO'
alias rf='readlink -f'
alias ydl='youtube-dl'
alias fa='fc -IA'
alias fr='fc -IR'
alias dlc='DIANA_HOST=192.168.1.6 diana'
alias to='touch'
alias hig='history 1 | grep -i'
# aliasend

if [[ -e /dev/lxss ]] {
    export PATH=/usr/bin
    export DISPLAY=:0

    alias cmd='/init /mnt/c/Windows/System32/cmd.exe'
    alias ahk='z c:/mine/app/AutoHotkey/AutoHotkeyU64.exe'
    alias ahk32='z c:/mine/app/AutoHotkey/AutoHotkeyU32.exe'
    alias np='st z c:/mine/app/notepad++/notepad++.exe'
    alias di='st z c:/mine/app/WinMerge/WinMergeU.exe'
    alias mpv='st z c:/mine/app/mpv/mpv.exe'
    alias flve='z c:/mine/app/FLV_Extract/FLVExtractCL.exe'
    alias ipconfig='/init /mnt/c/Windows/System32/ipconfig.exe'
    alias tl='/init /mnt/c/Windows/System32/tasklist.exe'
    alias tlg='/init /mnt/c/Windows/System32/tasklist.exe | grep -i'
    alias netstat='/init /mnt/c/Windows/System32/netstat.exe'
    alias ps1='/init /mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe'
    alias pa='/init /mnt/c/mine/app/0misc/bin/pclip.exe'
    alias msg="/init /mnt/c/Windows/System32/msg.exe $USER"
    alias cl='/init /mnt/c/Windows/System32/clip.exe'
    alias csc='/init /mnt/c/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe /utf8output /nologo'
    alias chrome='/init /mnt/c/Users/goreliu/AppData/Local/CentBrowser/Application/chrome.exe'
    alias cmdtool='/mnt/c/mine/app/wsl-terminal/cmdtool'
    alias se='sudo /bin/systemctl3.py'
    alias wtcc='z tcc'
    alias wgcc='z gcc.exe'
    alias wg++='z g++.exe'
    alias wstrip='z strip.exe'
    alias wp='/init /mnt/c/mine/app/wsl-terminal/bin/mintty.exe /bin/winpty.exe'
    alias reg='z reg'
    alias vsls='w3m -dump http://$RPI[1]/apps/aria2c/data/dl | grep page_white'
    alias vsd='vs vsd'
    alias vsmv='vs vsmv'
    alias vsrm='vs vsrm'
    alias eh='export http_proxy=127.0.0.1:1080; export https_proxy=127.0.0.1:1080'
    alias uh='unset http_proxy; unset https_proxy'
    alias handle='/init /mnt/c/mine/app/Handle/handle64.exe'
    alias sslog='tailf /mnt/c/mine/app/shadowsocks/ss_win_temp/shadowsocks.log'
    alias syncmine='syncdir /mnt/c/mine /mnt/e/mine'
    alias apktool='/init /mnt/c/mine/app/apktool/apktool.bat'
    alias signapk='/init /mnt/c/mine/app/APKSign/signapk.bat'
    alias zipalign='/init /mnt/c/mine/app/APKSign/zipalign.exe -p 4'

    alias vm='/init /mnt/c/Program\ Files/Oracle/VirtualBox/VBoxManage.exe'
    alias vmlist='vm list vms; echo --RUNNING--; vm list runningvms'
    alias vmup='vm startvm archlinux --type headless'
    alias vmdown='vm controlvm archlinux savestate'
    alias vmpause='vm controlvm archlinux pause'
    alias vmresume='vm controlvm archlinux resume'
    alias vmhalt='vm controlvm archlinux poweroff'

    alias cyg='/init /mnt/c/cygwin64/setup-x86_64.exe -BOqnM'
    alias cygpi='/init /mnt/c/cygwin64/setup-x86_64.exe -BOqnP'
    alias cygpp='/init /mnt/c/cygwin64/setup-x86_64.exe -BOqnx'
    alias cygpud='/init /mnt/c/cygwin64/setup-x86_64.exe -BOqng'
    alias cygpq='sed 1d /mnt/c/cygwin64/etc/setup/installed.db'
    alias cygpqm='grep " 1$" /mnt/c/cygwin64/etc/setup/installed.db'
    alias cygpqi='cygpsi'

    cygy() {
        cat /mnt/c/cygwin64/tmp/http%3a%2f%2fmirrors.ustc.edu.cn%2fcygwin%2f/x86_64/setup.ini | \
            sed -n "/@ $1.*/,/^version/p"
    }

    cygpsi() {
        cat /mnt/c/cygwin64/tmp/http%3a%2f%2fmirrors.ustc.edu.cn%2fcygwin%2f/x86_64/setup.ini | \
            sed -n "/@ $1$/,/^$/p" | sed '$d'
    }

    cygpql() {
        zcat /mnt/c/cygwin64/etc/setup/$1.lst
    }

    vv() {
        [[ $1 == "-r" ]] && {
            ssh -tq -p 2222 127.0.0.1 $*[2,-1]
            return
        }

        local args
        (($# >= 1)) && args="zsh -ic '$*'"

        ssh -tq -p 2222 127.0.0.1 $args
    }

    say() {
        (cd; z c:/mine/app/AutoHotkey/AutoHotkeyU64.exe .bin/src/say.ahk "$*" &)
    }

    fm() {
        local filename

        if [[ -d $1 ]] {
            cd $1
        } else {
            cd ${1:h}
            filename=${1:t}
        }

        st /init /mnt/c/mine/app/totalcmd/Totalcmd64.exe "$(z)/$filename"
        cd - >/dev/null
    }

    wsudo() {
        z c:/mine/app/0misc/bin/sudo.js $*
    }

    disma() {
        wsudo -k Dism.exe /Online /Cleanup-Image /AnalyzeComponentStore
    }

    dismc() {
        wsudo -k Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase
    }

    tk() {
        z taskkill /f /im $1.exe
    }

    zz() {
        /init /mnt/c/mine/app/0misc/bin/sh.exe -c "$*"
    }

    vsdl() {
        (($# == 0)) && {
            1=http://192.168.1.6/apps/aria2c/data/dl
        }

        wget $1 -O - 2>/dev/null \
            | sed '1,/Parent folder/d' | grep -o 'href="[^"]\+' | sed 's/href="//g' \
            | while {read file} {
            aria http://$RPI[1]$file http://$RPI[2]$file
        }

        for i (*(.N)) {
            [[ $(hexdump -n 10 $i | head -c 32) == "0000000 0a0a 213c 4f44 5443 5059" ]] && {
                rm $i && mkdir $i && (cd $i && vsdl $1/$i)
            }
        }
    }

    backupconf() {
        cd /mnt/c/mine/app/0misc/conf/$HOST || return 1

        date +"%Y-%m-%d %H:%M:%S" > version

        rm *.reg
        z reg export HKEY_CURRENT_USER\\Software\\Honeyview Honeyview.reg
        z reg export HKEY_CURRENT_USER\\Software\\Bandizip Bandizip.reg

        =rm -r Startup
        cp -r "/mnt/c/Users/goreliu/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup" .

        =rm -r mine
        cp -r "/mnt/c/Users/goreliu/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/mine" .

        mdcd tc
        cp /mnt/c/mine/app/totalcmd/{Wincmd.ini,TCMark.ini} .
        cd $OLDPWD

        mdcd vimd
        cat /mnt/c/mine/app/VimDesktop/custom.ahk | grep -Ev NONONO > custom.ahk
        cp /mnt/c/mine/app/VimDesktop/conf/vimd.ini .
        cd $OLDPWD

        mdcd runz
        cp /mnt/c/mine/app/RunZ/conf/{RunZ.ini,RunZ.auto.ini} .
        cd $OLDPWD

        mdcd notepad++
        cp /mnt/c/mine/app/notepad++/config.xml .
        cd $OLDPWD

        cp /home/goreliu/git/python-tuya/mybulb .

        git add -f *
    }

    uselog() {
        local query="$*"
        [[ -n $query ]] || {
            query="^$(date +%Y%m%d)"
        }

        cat ~/mine/app/0misc/log/run.log | grep $query
    }

    apksign() {
        /init /mnt/c/mine/app/APKSign/zipalign.exe -p 4 $1 $1.align.apk
        /init /mnt/c/mine/app/APKSign/signapk.bat $1.align.apk $1.out.apk
        rm $1.align.apk
    }
} elif [[ $OSTYPE == *android* ]] {
    export SHELL=/bin/zsh
    alias dh='df 2>/dev/null'
    alias frm="free -m | sed 's/ \+/  /g'"
    alias mt='atop'
    alias chr='termux-chroot zsh'
    alias lock='termux-wake-lock'
    alias unlock='termux-wake-unlock'

    precmd() {
        PROMPT="%{%F{cyan}%}goreliu@%{%F{green}%}my-phone:%{%F{red}%}%(?..[%?]:)%{%F{white}%}%~"$'\n'"%% "
    }
} else {
    alias se='sudo systemctl'
    alias jf='journalctl -f'
    alias vsls='l ~/data/dl'
    alias vsd='tree ~/data'
    alias vsmv='dedfiles ~/data ~/data/dl'
    alias vsrm='rm -v ~/data/dl/*.*'
    alias remove_useless_pkg='sudo pacman -Rcn jfsutils lvm2 logrotate mdadm nano \
        pcmciautils reiserfsprogs texinfo vi xfsprogs'
}

path+=(~/.bin)
# 开启后 exec zsh 后 ctrl + a 异常
# export EDITOR=vim
export PAGER='less -irf'
export GREP_COLOR='40;33;01'
# 禁用 ctrl + s
stty -ixon

# man 颜色
export LESS_TERMCAP_mb=$'\E[01;31m'
# 标题和命令主体
export LESS_TERMCAP_md=$'\E[01;32m'
export LESS_TERMCAP_me=$'\E[0m'
export LESS_TERMCAP_se=$'\E[0m'
export LESS_TERMCAP_so=$'\E[01;44;33m'
export LESS_TERMCAP_ue=$'\E[0m'
# 命令参数
export LESS_TERMCAP_us=$'\E[04;36;4m'

imgresize() {
    gm mogrify -resize $1x$2 $3
}

c() {
    cd $1
    ls -F --color
}

rm() {
    for i ($*) {
        [[ -e $i/.keep ]] && {
            print -P "%BDon't delete $i !!!"
            return 1
        }
    }

    =rm -v $*
}

calc() {
    zmodload zsh/mathfunc
    echo $(($*))
}

gr() {
    grep --color $* -r .
}

k() {
    if (($# == 0)) {
        cd ..
    } else {
        go_dir='.'
        for i ({1..$1}) {
            go_dir=$go_dir/..
        }
        cd $go_dir
    }

    ls -F --color
}

t() {
    cat $1 2>/dev/null || ls -lF --color $* 2>/dev/null
}

cwi() {
    buffer=("${(f)$(which -a $1)}")
    print -l $buffer

    [[ -e $buffer[-1] ]] && {
        echo
        cat $buffer[-1]
    }
}

vwi() {
    buffer=("${(f)$(which -a $1)}")
    print -l $buffer

    [[ -e $buffer[-1] ]] && {
        vim -p $buffer[-1]
        return
    }

    buffer=$(type $1)
    buffer=${buffer#$1*function from }
    if [[ -e $buffer ]] {
        vim "+/^ *$1(" -p $buffer
    } elif [[ $buffer == *"is an alias for"* ]] {
        vim "+/^ *alias $1=" -p ~/.zshrc
    }
}

lwi() {
    l $(which $*)
}

fwi() {
    file $(which $*)
}

ac() {
    if (($# == 1)) {
        awk '{print $'$1'}' $2
    } elif (($# == 2)) {
        awk -F$2 '{print $'$1'}' $3
    } elif (($# == 0)) {
        awk '{print $1}' $1
    }
}

0x() {
    echo $((16#$1))
}

0o() {
    echo $((8#$1))
}

0b() {
    echo $((2#$1))
}

p16() {
    echo $(([#16] $1))
}

p8() {
    echo $(([#8] $1))
}

p2() {
    echo $(([#2] $1))
}

exaac() {
    # ffmpeg -i $1 -vn -sn -c:a copy -y -map 0:a:0 $1.aac
    ffmpeg -i $1 -acodec copy -vn $1.aac
}

exmp4() {
    ffmpeg -i $1 -acodec copy -vn $1.aac
    ffmpeg -i $1 -vcodec copy -an $1.mp4
}

aac2m4a() {
    MP4Box -add $1 -new ${1/aac/m4a}
}

tophistory() {
    num=20
    (($+1)) && num=$1
    history 1 \
        | awk '{CMD[$2]++;count++;}END \
            { for (a in CMD)print CMD[a] " " CMD[a]/count*100 "% " a;}' \
        | column -c3 -s " " -t | sort -nr | nl | head -n$num
}

colorbar() {
    awk 'BEGIN{
        s="               "; s=s s s s s s s s;
        for (colnum = 0; colnum<77; colnum++) {
            r = 255-(colnum*255/76);
            g = (colnum*510/76);
            b = (colnum*255/76);
            if (g>255) g = 510-g;
            printf "\033[48;2;%d;%d;%dm", r,g,b;
            printf "\033[38;2;%d;%d;%dm", 255-r,255-g,255-b;
            printf "%s\033[0m", substr(s,colnum+1,1);
        }
        printf "\n";
    }'
}

loop() {
    while ((1)) {
        eval $*
    }
}

vs() {
    [[ $1 == "-r" ]] && {
        ssh -tq $USER@$RPI[1] $*[2,-1]
        return
    }

    local args
    (($# >= 1)) && args="zsh -ic '$*'"

    ssh -tq $USER@$RPI[1] $args
}

vs1() {
    [[ $1 == "-r" ]] && {
        ssh -tq -p 8022 $USER@192.168.1.3 $*[2,-1]
        return
    }

    local args
    (($# >= 1)) && args="zsh -ic '$*'"

    ssh -tq -p 8022 $USER@192.168.1.3 $args
}

icm() {
    git cm "$*"
}

syncdir() {
    # syncdir dir1/ dir2/
    if [[ $3 == "-r" ]] {
        rsync --exclude foobar2000/running --delete -av $1/ $2/
    } else {
        rsync --exclude foobar2000/running -n --delete -av $1/ $2/
    }
}

mdcd() {
    md $1
    cd $1
}

st() {
    ($* &)
}

rr() {
    (($+max_process)) || typeset -gi max_process=10
    (($+running_process)) || typeset -gA running_process=()

    while {getopts j:h arg} {
        case $arg {
            (j)
            ((OPTARG > 0)) && max_process=$OPTARG
            ;;

            (h)
            echo "Usage: $0 [-j max_process] [cmd] [args]"
            return
            ;;
        }
    }

    shift $((OPTIND - 1))

    (($# == 0)) && {
        for i (${(k)running_process}) {
            [[ -e $i ]] || unset "running_process[$i]"
        }

        echo "running/max: $#running_process/$max_process"
        (($#running_process > 0)) && echo "pids:" ${${(k)running_process/\/proc\/}/\/exe}
        return 0
    }

    while ((1)) {
        local running_process_num=$#running_process

        if (($running_process_num < max_process)) {
            $* &
            running_process[/proc/$!/exe]=1
            return
        }

        for i (${(k)running_process}) {
            [[ -e $i ]] || unset "running_process[$i]"
        }

        (($#running_process == $running_process_num)) && {
            echo "wait $running_process_num pids:" ${${(k)running_process/\/proc\/}/\/exe}
            inotifywait -q ${(k)running_process}
        }
    }
}

vmpath() {
   echo scp -r $(hi | head -n 1):$PWD/$1 .
}

zc() {
    [[ ~/.zshrc.zwc -nt ~/.zshrc ]] || {
        echo update .zshrc.zwc
        zcompile ~/.zshrc
    }

    [[ ~/.zcompdump.zwc -nt ~/.zcompdump ]] || {
        echo update .zcompdump.zwc
        zcompile ~/.zcompdump
    }

    [[ ~/.file_colors -nt ~/.dir_colors ]] || {
        echo update .file_colors
        dircolors ~/.dir_colors > ~/.file_colors
    }
}

mm() {
    # /etc/mail/exim.conf
    # begin rewrite
    # goreliu@my-laptop goreliu@my.laptop.com Ffrs

    mail -s "$*" ly50247@126.com
}

ww() {
    local key="SCU34549Tb55ef71d00f362509116d94a14407f835bcdaa414979d"
    curl "http://sc.ftqq.com/$key.send?text=$1&desp=$2"
}

b() {
    local_dir=$(readlink -f $PWD)
    remote_dir=/

    [[ $local_dir == /mnt/* ]] && {
        remote_dir=/store/$local_dir[8,-1]

        [[ "$(baidupcs pwd)" == $remote_dir ]] || {
            baidupcs cd $remote_dir
        }
    }

    [[ $1 == push ]] && {
        baidupcs synch -cru $local_dir $remote_dir
        return
    }

    [[ $1 == cmp ]] && {
        baidupcs compare -cru $local_dir $remote_dir
        return
    }

    [[ $1 == diffc ]] && {
        vimdiff <(ls | sed "s|^|$remote_dir/|g" | sort) \
            <(baidupcs ls | grep /store/ | sed 's|^.*  /store/|/store/|g' | sort)
        return
    }

    [[ $1 == diff ]] && {
        find | sed "1d; s|^./|$remote_dir/|g" | sort > /tmp/local.txt

        echo -n > /tmp/remote.tmp.txt
        for i (. **/(N)) {
            echo List $i ...
            baidupcs ls $i | grep /store/ >> /tmp/remote.tmp.txt
        }

        cat /tmp/remote.tmp.txt | sed 's|^.*  /store/|/store/|g' | sort > /tmp/remote.txt

        vimdiff /tmp/local.txt /tmp/remote.txt

        =rm /tmp/{local.txt,remote.txt,remote.tmp.txt}

        return
    }

    baidupcs $*
}

tf() {
    if [[ -e /dev/lxss && $(readlink -f $PWD) == /mnt/* ]] {
        tailf $*
    } else {
        tail -f $*
    }
}

note() {
    if [[ $1 == "" ]] {
        cat >> ~/.cache/note
    } elif [[ $1 == -r ]] {
        cat ~/.cache/note
    } elif [[ $1 == -v ]] {
        vim ~/.cache/note
    } elif [[ $1 == -g ]] {
        cat ~/.cache/note | grep $*[2,-1]
    } else {
        echo $* >> ~/.cache/note
    }
}
# funcend

if (($+commands[pacman])) {
    alias pac='sudo pacman --color auto'
    alias y='pacman --color auto -Ss'
    (($+commands[yaourt])) && {
        alias pac='yaourt'
        alias y='yaourt'
    }
    alias pi='pac -S'
    alias pia='pac -S --noconfirm'
    alias pid='pac -S -d -d'
    alias pli='pac -U'
    alias pud="sudo pacman --color auto -Syu"
    alias pudd="pac -Syu --aur"
    alias psu="pac -Su"
    alias pd='pac -Sw'
    alias pp='pac -Rcsn'
    alias psi='pac -Si'
    alias pq='pac -Q'
    alias pqi='pac -Qi'
    alias pqe='pacman -Qeq | sort | less'
    alias psl='pkgfile -l'
    alias pql='pac -Ql'
    alias pso='pkgfile -v'
    alias pqo='pac -Qo'
    alias pqd='pac -Qdt'
    alias pqm='pac -Qqm'
    alias pqt='pactree'
    alias pqn='whoneeds'
    alias prd='pac -Rdd'
    alias pae='pac -D --asexplicit'
    alias pad='pac -D --asdeps'
    alias pcl='echo y"\n"y | pac -Scc'
    alias pbs='pac -G'
    alias pfy='sudo pkgfile -uz'
    alias pls='pac -Ss'
    alias ped='sudo vim /etc/pacman.d/mirrorlist'
    alias pedd='sudo vim /etc/pacman.conf'

    pqii() {
        cat /var/lib/pacman/local/$1-*/install
    }
} elif (($+commands[apt-get])) {
    alias pg='apt-cache search'
    alias y='apt list 2>/dev/null | grep'
    alias pi='apt-get install'
    alias pia='apt-get install'
    alias pp='apt-get purge'
    alias pud='apt-get update; apt-get upgrade'
    alias psu='apt-get upgrade'
    alias pqd='apt-get autoremove'
    alias pcl='apt-get clean'
    alias pql='dpkg -L'
    alias pq='apt list --installed'
    alias pqe='apt-mark showmanual | less'
    alias pqm='apt list --installed 2>/dev/null | grep -F ",local"'
    alias psi='apt show'
    alias pqi='dpkg -s'
    alias pqo='dpkg -S'
    alias pli='dpkg -i'
    alias pls='apt list'
    alias pae='apt-mark manual'
    alias pad='apt-mark auto'
    alias pd='pi -d'
    alias ped='apt edit-sources'
}
#}}}
