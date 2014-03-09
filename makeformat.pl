#! /usr/bin/perl -w

# open the input and output files
open(READ, "<$ARGV[0]")
|| die("\nError: $ARGV[0] not found or cannot be opened.");
open(WRITE, ">$ARGV[1]")
|| die("\nError: HTML write file cannot be created.");

# things to replace
$old_title = '<span id="storyTitle"></span>';
$new_title = '<span><img src="title_small.png" alt="Solo Queue" /></span>';
$old_credits = '(This story was created [^\n]*)';
$new_credits = <<'DISCLAIMER';
<em>Solo Queue</em> isn&#39;t endorsed by Riot Games and doesn&#39;t 
reflect the views or opinions of Riot Games or anyone officially involved 
in producing or managing <em>League of Legends</em>. <em>League of 
Legends</em> and Riot Games are trademarks or registered trademarks of 
Riot Games, Inc. <em>League of Legends</em> &#169; Riot Games, Inc.
DISCLAIMER

while(my $line = <READ>)
{
	$line =~ s/$old_title/$new_title/;
	$line =~ s/$old_credits/$1 $new_credits/;
	print WRITE $line;
}

close(READ);
close(WRITE);
print("Complete.\n");
exit(0);