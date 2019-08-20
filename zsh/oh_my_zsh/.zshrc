# Time analytic
zmodload zsh/zprof

# go环境变量
export GOPATH=$HOME/.go
export GOROOT="$(brew --prefix golang)/libexec"

export PATH=$HOME/bin:/usr/local/bin:$PATH:$GOPATH/bin:$GOROOT/bin
export PATH=$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH

# 如果你不是通过Android Studio安装的sdk，则其路径可能不同，请自行确定清楚。
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
# ZSH_THEME="robbyrussell"

# agnoster https://github.com/agnoster/agnoster-zsh-theme
ZSH_THEME="agnoster"

# powerlevel10k
# ZSH_THEME=powerlevel10k/powerlevel10k
# 隐藏用户名称(user@hostname)
# DEFAULT_USER=`id -un`
# 含有icon的字型,前提你的字体有icon
# POWERLEVEL10K_MODE='nerdfont-complete'
# command line 左边提示内容(文件夹路径、文件夹读写状态、版本控制资讯)
# POWERLEVEL10K_LEFT_PROMPT_ELEMENTS=(dir dir_writable vcs) # <= left prompt 设了 "dir"
# command line 右边提示内容(状态、时间)
# POWERLEVEL10K_RIGHT_PROMPT_ELEMENTS=(status time)

# set 256color
export TERM=xterm-256color


# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
brew
git
sublime
tmux
vscode
zsh-autosuggestions
zsh-completions
zsh-syntax-highlighting
)
autoload -U compinit && compinit

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
alias h='history'
alias j='ls -F --color 2>/dev/null || ls -FG'
alias lsd='ls --color -d *(-/DN) 2>/dev/null || ls -dG *(-/DN)'
alias ll='ls --color -Fl --time-style=long-iso 2>/dev/null || ls -FGlT'
alias la='ls --color -FA 2>/dev/null || ls -FAG'
alias lla='ls -F --color --time-style=long-iso -lA 2>/dev/null || ls -lAFGT'
alias l='ls --color --time-style=long-iso -lFh 2>/dev/null || ls -lFhGT'
alias lsc='t=(*); echo $#t; unset t'
alias lscc='t=(* .*); echo $#t; unset t'
alias g='grep'
alias gv='grep -v'
alias rd='rmdir'
alias md='mkdir -p'
alias dh='df -h'
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
alias ua='uname -a'
alias cu='curl -L'
alias tn='telnet'
alias to='touch'
alias hig='history 1 | grep -i'

# nvm config
export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion" ] && . "/usr/local/opt/nvm/etc/bash_completion"  # This loads nvm bash_completion

