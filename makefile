all:
	perl makemacros.pl temp.tw
	./twee/twee -t sugarcane soloqueue.tw temp.tw > soloqueue.tmp
	rm temp.tw
	perl makeformat.pl soloqueue.tmp soloqueue.html
	rm soloqueue.tmp