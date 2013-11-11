all:
	perl makemacros.pl temp.tw
	twee -t sugarcane soloqueue.tw temp.tw > soloqueue.html
	rm temp.tw