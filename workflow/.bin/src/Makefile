all: ../darkhttpd ../z ../tailf

../darkhttpd: darkhttpd.c
	gcc -Ofast -DNO_IPV6 -DBUILD_DATE="\"$$(date "+%Y-%m-%d %H:%M:%S")\"" $< -o $@
	strip $@
	sudo setcap cap_net_bind_service=eip ../darkhttpd

../z: z.c
	gcc -Ofast $< -o $@
	strip $@

../tailf: tailf.c
	gcc -Ofast $< -o $@
	strip $@
