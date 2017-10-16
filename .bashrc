# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions
alias ll='ls -lh'
alias l='ls -ltrha'
alias la='ls -ah'
alias open='xdg-open'
alias df='df -h'
alias python='python3'
alias ipython='ipython3'
alias pip='pip3'

export PATH=$PATH:~/bin
